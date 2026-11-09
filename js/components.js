// ==================== UI 組件模組 ====================

// 1. 頂部模式導航列
const NavBar = {
  name: 'NavBar',
  props: ['currentMode', 'stars'],
  emits: ['set-mode'],
  template: `
    <div class="flex flex-wrap justify-between items-center mb-3 pb-3 border-b border-gray-100 gap-2">
      <div class="flex flex-wrap gap-1.5 sm:gap-2">
        <button @click="$emit('set-mode', 'study')" 
                :class="currentMode === 'study' ? 'bg-amber-400 text-amber-950 font-black shadow' : 'bg-gray-100 text-gray-500'"
                class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition">📖 單字溫習</button>
        <button @click="$emit('set-mode', 'trial_listen')" 
                :class="currentMode === 'trial_listen' ? 'bg-blue-500 text-white font-black shadow' : 'bg-gray-100 text-gray-500'"
                class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition">👂 聽力試煉</button>
        <button @click="$emit('set-mode', 'trial_spell')" 
                :class="currentMode === 'trial_spell' ? 'bg-emerald-500 text-white font-black shadow' : 'bg-gray-100 text-gray-500'"
                class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition">🧩 拼字試煉</button>
        <button @click="$emit('set-mode', 'boss')" 
                :class="currentMode === 'boss' ? 'bg-red-500 text-white font-black shadow animate-pulse' : 'bg-gray-100 text-gray-500'"
                class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition">⚔️ 決戰 Boss</button>
      </div>
      <div class="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full text-amber-900 font-black text-sm">
        <span>⭐ 星幣:</span><span>{{ stars }}</span>
      </div>
    </div>
  `
};

// 2. 書本與課次選單組件
const BookUnitSelector = {
  name: 'BookUnitSelector',
  props: ['bookList', 'selectedBookId', 'unitList', 'selectedUnit', 'totalWords', 'currentMode', 'currentIndex', 'currentWordCount'],
  emits: ['change-book', 'change-unit'],
  template: `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 bg-amber-50/90 p-2.5 rounded-2xl border border-amber-200 gap-2">
      <div class="flex flex-wrap items-center gap-2">
        <div v-if="bookList && bookList.length > 1" class="flex items-center gap-1">
          <span class="text-xs font-black text-amber-900">📘 本冊:</span>
          <select :value="selectedBookId" @change="$emit('change-book', $event.target.value)"
                  class="bg-white border border-amber-300 text-amber-950 font-bold py-1 px-2 rounded-xl shadow-sm text-xs outline-none focus:ring-2 focus:ring-amber-400">
            <option v-for="b in bookList" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-xs font-black text-amber-900">📚 課次:</span>
          <select :value="selectedUnit" @change="$emit('change-unit', $event.target.value)"
                  class="bg-white border border-amber-300 text-amber-950 font-bold py-1 px-2.5 rounded-xl shadow-sm text-xs outline-none focus:ring-2 focus:ring-amber-400">
            <option value="ALL">全部 (共 {{ totalWords }} 字)</option>
            <option v-for="u in unitList" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
      </div>
      <div v-if="currentMode === 'study' && currentWordCount > 0" class="text-xs font-bold text-amber-800 self-end sm:self-auto">
        {{ currentIndex + 1 }} / {{ currentWordCount }}
      </div>
    </div>
  `
};

// 3. 單字溫習模式組件
const StudyMode = {
  name: 'StudyMode',
  props: ['word', 'currentRate', 'isListening', 'feedback', 'feedbackColor'],
  emits: ['set-rate', 'speak', 'voice-challenge', 'next'],
  template: `
    <div>
      <div class="flex justify-end mb-3">
        <div class="flex gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 text-xs font-bold">
          <button @click="$emit('set-rate', 0.5)" :class="currentRate === 0.5 ? 'bg-amber-500 text-white' : 'text-gray-600'" class="px-2 py-1 rounded-lg">🐢 0.5x</button>
          <button @click="$emit('set-rate', 1.0)" :class="currentRate === 1.0 ? 'bg-amber-500 text-white' : 'text-gray-600'" class="px-2 py-1 rounded-lg">🚶 1.0x</button>
          <button @click="$emit('set-rate', 1.25)" :class="currentRate === 1.25 ? 'bg-amber-500 text-white' : 'text-gray-600'" class="px-2 py-1 rounded-lg">🐰 1.25x</button>
        </div>
      </div>
      <div v-if="word" class="space-y-4 text-center">
        <div class="bg-amber-50 border border-amber-200 rounded-3xl p-5 shadow-inner">
          <div class="flex items-center justify-center gap-3">
            <h1 class="text-4xl sm:text-5xl font-black text-blue-900 tracking-wide">{{ word.word }}</h1>
            <button @click="$emit('speak', word.word)" class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-2.5 rounded-2xl shadow transition">🔊</button>
          </div>
          <p class="text-2xl font-bold text-gray-800 mt-2">{{ word.meaning }}</p>
        </div>
        <div @click="$emit('speak', word.sentence)" class="bg-blue-50 hover:bg-blue-100/70 border border-blue-200 rounded-2xl p-4 text-left cursor-pointer transition">
          <div class="flex justify-between items-start">
            <p class="text-lg font-medium text-blue-950 pr-6">“ {{ word.sentence }} ”</p>
            <span class="text-blue-500 text-sm">🔊</span>
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ word.sentence_cn }}</p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button @click="$emit('speak', word.word)" class="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-3.5 rounded-xl shadow flex items-center justify-center gap-1">
            <span>🔊 聽發音</span><span class="hidden sm:inline text-xs opacity-75">(Space)</span>
          </button>
          <button @click="$emit('voice-challenge')" :class="isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600 active:scale-95'" class="text-white font-bold py-3.5 rounded-xl shadow flex items-center justify-center gap-1">
            <span>🎤 {{ isListening ? '傾聽中...' : '開口挑戰' }}</span><span class="hidden sm:inline text-xs opacity-75">(R)</span>
          </button>
        </div>
        <div v-if="feedback" class="text-lg font-black" :class="feedbackColor">{{ feedback }}</div>
        <button @click="$emit('next')" class="w-full bg-amber-400 hover:bg-amber-500 active:scale-98 py-3.5 rounded-xl font-black text-lg text-amber-950 shadow">下一題 ➔</button>
      </div>
    </div>
  `
};

// 4. 聽力試煉組件
const ListenTrial = {
  name: 'ListenTrial',
  props: ['word', 'trialIndex', 'totalTrials', 'feedback', 'feedbackColor'],
  emits: ['speak', 'check'],
  template: `
    <div>
      <div class="text-center mb-4">
        <span class="bg-blue-100 text-blue-800 text-xs font-black px-3 py-1 rounded-full">關卡：聽力盲測</span>
        <h2 class="text-xl sm:text-2xl font-black text-slate-800 mt-1">選出發音對應的中文意思！</h2>
        <p class="text-xs text-gray-400 mt-0.5">進度：{{ trialIndex + 1 }} / {{ totalTrials }}</p>
      </div>
      <div v-if="word" class="space-y-4 text-center">
        <div class="bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl p-6 flex flex-col items-center justify-center">
          <button @click="$emit('speak', word.word)" class="bg-blue-600 hover:bg-blue-700 active:scale-90 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-xl transition">🔊</button>
          <span class="text-xs font-bold text-blue-600 mt-2">點擊播放發音</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button v-for="(opt, idx) in word.options" :key="idx" @click="$emit('check', opt)"
                  class="bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400 active:scale-95 p-3.5 rounded-2xl text-base sm:text-lg font-bold text-slate-700 shadow-sm transition">
            {{ opt }}
          </button>
        </div>
        <div v-if="feedback" class="text-lg font-black" :class="feedbackColor">{{ feedback }}</div>
      </div>
    </div>
  `
};

// 5. 拼字試煉組件
const SpellTrial = {
  name: 'SpellTrial',
  props: ['word', 'trialIndex', 'totalTrials', 'spelledLetters', 'scrambledPool', 'feedback', 'feedbackColor'],
  emits: ['speak', 'pick-letter', 'remove-letter', 'reset', 'check'],
  template: `
    <div>
      <div class="text-center mb-4">
        <span class="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">關卡：拼字積木</span>
        <h2 class="text-xl sm:text-2xl font-black text-slate-800 mt-1">拼出正確英文單字！</h2>
        <p class="text-xs text-gray-400 mt-0.5">進度：{{ trialIndex + 1 }} / {{ totalTrials }}</p>
      </div>
      <div v-if="word" class="space-y-4 text-center">
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex justify-between items-center px-5">
          <span class="text-xl sm:text-2xl font-black text-emerald-950">{{ word.meaning }}</span>
          <button @click="$emit('speak', word.word)" class="bg-emerald-600 text-white p-2 rounded-xl text-xs font-bold shadow">🔊 發音提示</button>
        </div>
        <div class="flex flex-wrap justify-center gap-1.5 min-h-[46px] p-2 bg-slate-100 rounded-2xl border-2 border-slate-300">
          <span v-for="(letter, i) in spelledLetters" :key="i" @click="$emit('remove-letter', i)"
                class="w-10 h-10 bg-white text-emerald-700 border-2 border-emerald-400 rounded-xl font-black text-lg flex items-center justify-center cursor-pointer shadow-sm active:scale-95">
            {{ letter === ' ' ? '␣' : letter }}
          </span>
        </div>
        <div class="flex flex-wrap justify-center gap-1.5 pt-1">
          <button v-for="(item, idx) in scrambledPool" :key="idx" :disabled="item.used" @click="$emit('pick-letter', item)"
                  :class="item.used ? 'opacity-20 cursor-not-allowed bg-gray-200' : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-90 shadow-md'"
                  class="w-10 h-10 rounded-xl font-black text-lg flex items-center justify-center transition">
            {{ item.letter === ' ' ? '␣' : item.letter }}
          </button>
        </div>
        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <button @click="$emit('reset')" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 rounded-xl text-sm">🔄 重新拼湊</button>
          <button @click="$emit('check')" class="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl shadow text-sm">✨ 檢查拼字</button>
        </div>
        <div v-if="feedback" class="text-lg font-black" :class="feedbackColor">{{ feedback }}</div>
      </div>
    </div>
  `
};

// 6. 決戰 Boss 組件 (1:1 絕對座標畫布與防手勢拖動)
const BossBattle = {
  name: 'BossBattle',
  props: [
    'gameState', 'bossHp', 'playerHp', 'timer', 'isWritingActive', 'question',
    'questionIndex', 'totalQuestions', 'maskedSentence', 'typedWord', 'isRecognizing',
    'lastRecognizedLetter', 'combatMsg', 'combatMsgColor', 'isShaking', 'isListening'
  ],
  emits: ['add-space', 'backspace', 'clear', 'submit', 'voice-attack', 'restart', 'writing-start', 'writing-end'],
  setup(props, { emit }) {
    const { ref, onMounted, onUnmounted, nextTick, watch } = Vue;
    const hwCanvas = ref(null);
    let hwCtx = null;
    let isDrawing = false;
    let currentStroke = [];
    let strokes = [];
    let recognizeTimer = null;

    const getPointPos = (canvas, clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: Math.round(clientX - rect.left),
        y: Math.round(clientY - rect.top)
      };
    };

    const initCanvas = () => {
      if (!hwCanvas.value) return;
      const canvas = hwCanvas.value;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width);
      canvas.height = 140;

      hwCtx = canvas.getContext('2d');
      hwCtx.lineWidth = 4;
      hwCtx.lineCap = 'round';
      hwCtx.lineJoin = 'round';
      hwCtx.strokeStyle = '#4338ca';
      clearCanvas();
      setupEvents(canvas);
    };

    const clearCanvas = () => {
      if (!hwCtx || !hwCanvas.value) return;
      hwCtx.clearRect(0, 0, hwCanvas.value.width, hwCanvas.value.height);
      strokes = [];
    };

    const setupEvents = (canvas) => {
      if (canvas._touchBound) return;
      canvas._touchBound = true;

      const onStart = (cx, cy) => {
        isDrawing = true;
        emit('writing-start');
        clearTimeout(recognizeTimer);
        const pos = getPointPos(canvas, cx, cy);
        currentStroke = [[pos.x], [pos.y]];
        hwCtx.beginPath();
        hwCtx.moveTo(pos.x, pos.y);
      };

      const onMove = (cx, cy) => {
        if (!isDrawing) return;
        const pos = getPointPos(canvas, cx, cy);
        currentStroke[0].push(pos.x);
        currentStroke[1].push(pos.y);
        hwCtx.lineTo(pos.x, pos.y);
        hwCtx.stroke();
      };

      const onEnd = () => {
        if (!isDrawing) return;
        isDrawing = false;
        if (currentStroke.length && currentStroke[0].length) {
          strokes.push(currentStroke);
        }

        clearTimeout(recognizeTimer);
        recognizeTimer = setTimeout(async () => {
          if (strokes.length > 0) {
            const letter = await recognizeInk(strokes, canvas.width, canvas.height);
            emit('writing-end', letter);
          } else {
            emit('writing-end', '');
          }
          clearCanvas();
        }, 600);
      };

      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: false });

      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: false });

      canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        onEnd();
      }, { passive: false });

      canvas.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
      window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
      window.addEventListener('mouseup', () => onEnd());
    };

    watch(() => props.questionIndex, () => { clearCanvas(); });

    onMounted(() => {
      nextTick(() => initCanvas());
      window.addEventListener('resize', initCanvas);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', initCanvas);
    });

    return { hwCanvas, clearCanvas };
  },
  template: `
    <div>
      <div class="space-y-2 mb-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <div>
          <div class="flex justify-between items-center text-xs sm:text-sm font-black mb-0.5 text-purple-900">
            <span>👾 單字暗黑巨龍 (Boss)</span>
            <span>{{ bossHp }} / 100 HP</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div class="bg-purple-600 h-3 rounded-full transition-all duration-500" :style="{ width: bossHp + '%' }"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between items-center text-xs sm:text-sm font-black mb-0.5 text-green-900">
            <span>🧙‍♂️ 小小冒險家 (你)</span>
            <span>{{ playerHp }} / 100 HP</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div class="bg-green-500 h-3 rounded-full transition-all duration-300" :style="{ width: playerHp + '%' }"></div>
          </div>
        </div>
        <div v-if="gameState === 'playing'">
          <div class="flex justify-between text-[11px] font-bold text-gray-500 mb-0.5">
            <span class="flex items-center gap-1">
              <span>倒數計時</span>
              <span v-if="isWritingActive" class="text-purple-600 font-black animate-pulse">（動筆中，計時暫停⏸️）</span>
            </span>
            <span class="font-mono font-bold">{{ timer }} 秒</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div class="h-2 rounded-full transition-all duration-1000 linear" 
                 :class="timer <= 10 ? 'bg-red-500 animate-pulse' : 'bg-amber-400'"
                 :style="{ width: (timer / 45) * 100 + '%' }"></div>
          </div>
        </div>
      </div>

      <div v-if="gameState === 'playing' && question" class="space-y-3" :class="{ 'shake-anim': isShaking }">
        <div class="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3.5 text-center shadow-inner relative">
          <div class="text-[11px] font-black text-purple-400">第 {{ questionIndex + 1 }} 題 / 共 {{ totalQuestions }} 題</div>
          <h2 class="text-2xl sm:text-3xl font-black text-purple-950 mt-1">{{ question.meaning }}</h2>
          <div class="inline-block bg-purple-200/80 text-purple-900 px-3 py-0.5 rounded-full text-xs font-bold tracking-widest mt-1">
            提示：{{ question.hint }} (共 {{ question.word.length }} 字元)
          </div>
          <p class="text-xs text-gray-500 italic mt-1 bg-white/70 p-1.5 rounded-lg border border-purple-100">“ {{ maskedSentence }} ”</p>
        </div>

        <div class="bg-white border-2 border-purple-300 rounded-2xl p-2.5 flex items-center justify-between shadow-sm">
          <div class="flex items-center gap-1.5 pl-2 overflow-x-auto min-h-[38px]">
            <span class="text-xs font-bold text-gray-400 shrink-0">拼字：</span>
            <span v-if="typedWord.length === 0" class="text-xl font-black text-gray-300 tracking-wider font-mono">_____</span>
            <div v-else class="flex items-center gap-1">
              <span v-for="(char, idx) in typedWord" :key="idx"
                    :class="char === ' ' 
                      ? 'bg-purple-100 text-purple-700 border-b-4 border-purple-500 px-2 py-0.5 rounded text-xs font-black shadow-inner' 
                      : 'text-2xl font-black text-purple-900 font-mono'">
                {{ char === ' ' ? '␣ 空格' : char }}
              </span>
            </div>
            <span v-if="isRecognizing" class="text-xs text-purple-500 animate-pulse font-bold shrink-0 ml-1">（辨識中...）</span>
          </div>

          <div class="flex gap-1.5 shrink-0 ml-2">
            <button @click="$emit('add-space')" type="button" class="bg-purple-100 hover:bg-purple-200 active:scale-90 text-purple-900 font-bold px-3 py-1.5 rounded-xl text-xs transition border border-purple-300 shadow-sm">␣ 空白</button>
            <button @click="$emit('backspace')" type="button" class="bg-amber-100 hover:bg-amber-200 active:scale-90 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-xs transition">⌫ 倒退</button>
            <button @click="$emit('clear')" type="button" class="bg-gray-100 hover:bg-gray-200 active:scale-90 text-gray-600 font-bold px-3 py-1.5 rounded-xl text-xs transition">清空</button>
          </div>
        </div>

        <div class="bg-purple-100/50 border-2 border-dashed border-purple-300 rounded-2xl p-2 flex flex-col items-center relative">
          <div class="flex justify-between w-full px-2 text-[11px] font-bold text-purple-700 mb-1">
            <span>✍️ 在此手寫字母（寫完停筆自動辨識）：</span>
            <span v-if="lastRecognizedLetter" class="text-purple-900 font-black">剛填入: {{ lastRecognizedLetter }}</span>
          </div>
          <canvas ref="hwCanvas" class="handwriting-canvas bg-white rounded-xl shadow-inner border border-purple-200 cursor-crosshair" height="140"></canvas>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button @click="$emit('submit')" class="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black py-3 rounded-2xl text-base shadow-md transition flex items-center justify-center gap-1">發動攻擊 ⚔️</button>
          <button @click="$emit('voice-attack')" :class="isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95'" class="text-white font-black py-3 rounded-2xl text-sm sm:text-base shadow-md transition flex items-center justify-center gap-1">🎤 {{ isListening ? '傾聽中...' : '開口唸單字' }}</button>
        </div>

        <div v-if="combatMsg" class="text-center text-sm sm:text-base font-black transition" :class="combatMsgColor">{{ combatMsg }}</div>
      </div>

      <div v-else-if="gameState === 'victory'" class="text-center py-10 space-y-3">
        <div class="text-6xl animate-bounce">👑 🏆 ⚔️</div>
        <h2 class="text-2xl sm:text-3xl font-black text-amber-500">大勝利！巨龍被你擊敗了！</h2>
        <p class="text-gray-600 text-sm">你成功看著中文完整手寫背出所有單字與片語，獲得 10 顆星幣！</p>
        <button @click="$emit('restart')" class="bg-green-500 hover:bg-green-600 text-white font-black px-6 py-3 rounded-2xl text-lg shadow-lg active:scale-95 transition">再次挑戰魔王 ➔</button>
      </div>

      <div v-else-if="gameState === 'gameover'" class="text-center py-10 space-y-3">
        <div class="text-6xl">👻 💥</div>
        <h2 class="text-2xl sm:text-3xl font-black text-red-500">體力耗盡... 挑戰失敗！</h2>
        <p class="text-gray-600 text-sm">單字片語還不夠熟練，先回到前面溫習並利用拼字練習記熟吧！</p>
        <button @click="$emit('restart')" class="bg-red-500 hover:bg-red-600 text-white font-black px-6 py-3 rounded-2xl text-lg shadow-lg active:scale-95 transition">重新挑戰 ➔</button>
      </div>
    </div>
  `
};
