import { recognizeInk } from '../services/handwriting.js';

export default {
  name: 'BossBattle',
  props: {
    gameState: String,
    bossHp: Number,
    playerHp: Number,
    timer: Number,
    isWritingActive: Boolean,
    question: Object,
    questionIndex: Number,
    totalQuestions: Number,
    maskedSentence: String,
    typedWord: String,
    isRecognizing: Boolean,
    lastRecognizedLetter: String,
    combatMsg: String,
    combatMsgColor: String,
    isShaking: Boolean,
    isListening: Boolean
  },
  emits: [
    'add-space', 'backspace', 'clear', 'submit', 'voice-attack',
    'restart', 'writing-start', 'writing-end'
  ],
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

    watch(() => props.questionIndex, () => {
      clearCanvas();
    });

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
      <!-- 戰鬥雙方血量條 -->
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

      <!-- 戰鬥進行中 -->
      <div v-if="gameState === 'playing' && question" class="space-y-3" :class="{ 'shake-anim': isShaking }">
        <div class="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3.5 text-center shadow-inner relative">
          <div class="text-[11px] font-black text-purple-400">第 {{ questionIndex + 1 }} 題 / 共 {{ totalQuestions }} 題</div>
          
          <h2 class="text-2xl sm:text-3xl font-black text-purple-950 mt-1">
            {{ question.meaning }}
          </h2>

          <div class="inline-block bg-purple-200/80 text-purple-900 px-3 py-0.5 rounded-full text-xs font-bold tracking-widest mt-1">
            提示：{{ question.hint }} (共 {{ question.word.length }} 字元)
          </div>

          <p class="text-xs text-gray-500 italic mt-1 bg-white/70 p-1.5 rounded-lg border border-purple-100">
            “ {{ maskedSentence }} ”
          </p>
        </div>

        <!-- 拼字呈現區 -->
        <div class="bg-white border-2 border-purple-300 rounded-2xl p-2.5 flex items-center justify-between shadow-sm">
          <div class="flex items-center gap-1.5 pl-2 overflow-x-auto min-h-[38px]">
            <span class="text-xs font-bold text-gray-400 shrink-0">拼字：</span>
            
            <span v-if="typedWord.length === 0" class="text-xl font-black text-gray-300 tracking-wider font-mono">
              _____
            </span>

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
            <button @click="$emit('add-space')" 
                    type="button"
                    class="bg-purple-100 hover:bg-purple-200 active:scale-90 text-purple-900 font-bold px-3 py-1.5 rounded-xl text-xs transition border border-purple-300 shadow-sm">
              ␣ 空白
            </button>
            <button @click="$emit('backspace')" 
                    type="button"
                    class="bg-amber-100 hover:bg-amber-200 active:scale-90 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-xs transition">
              ⌫ 倒退
            </button>
            <button @click="$emit('clear')" 
                    type="button"
                    class="bg-gray-100 hover:bg-gray-200 active:scale-90 text-gray-600 font-bold px-3 py-1.5 rounded-xl text-xs transition">
              清空
            </button>
          </div>
        </div>

        <!-- 專用手寫畫布 -->
        <div class="bg-purple-100/50 border-2 border-dashed border-purple-300 rounded-2xl p-2 flex flex-col items-center relative">
          <div class="flex justify-between w-full px-2 text-[11px] font-bold text-purple-700 mb-1">
            <span>✍️ 在此手寫字母（寫完停筆自動辨識）：</span>
            <span v-if="lastRecognizedLetter" class="text-purple-900 font-black">剛填入: {{ lastRecognizedLetter }}</span>
          </div>
          
          <canvas ref="hwCanvas" 
                  class="handwriting-canvas bg-white rounded-xl shadow-inner border border-purple-200 cursor-crosshair"
                  height="140"></canvas>
        </div>

        <!-- 操作按鈕 -->
        <div class="grid grid-cols-2 gap-2">
          <button @click="$emit('submit')" 
                  class="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black py-3 rounded-2xl text-base shadow-md transition flex items-center justify-center gap-1">
            <span>發動攻擊 ⚔️</span>
          </button>

          <button @click="$emit('voice-attack')" 
                  :class="isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95'"
                  class="text-white font-black py-3 rounded-2xl text-sm sm:text-base shadow-md transition flex items-center justify-center gap-1">
            <span>🎤 {{ isListening ? '傾聽中...' : '開口唸單字' }}</span>
          </button>
        </div>

        <div v-if="combatMsg" class="text-center text-sm sm:text-base font-black transition" :class="combatMsgColor">
          {{ combatMsg }}
        </div>
      </div>

      <!-- 勝利畫面 -->
      <div v-else-if="gameState === 'victory'" class="text-center py-10 space-y-3">
        <div class="text-6xl animate-bounce">👑 🏆 ⚔️</div>
        <h2 class="text-2xl sm:text-3xl font-black text-amber-500">大勝利！巨龍被你擊敗了！</h2>
        <p class="text-gray-600 text-sm">你成功看著中文完整手寫背出所有單字與片語，獲得 10 顆星幣！</p>
        <button @click="$emit('restart')" class="bg-green-500 hover:bg-green-600 text-white font-black px-6 py-3 rounded-2xl text-lg shadow-lg active:scale-95 transition">
          再次挑戰魔王 ➔
        </button>
      </div>

      <!-- 失敗畫面 -->
      <div v-else-if="gameState === 'gameover'" class="text-center py-10 space-y-3">
        <div class="text-6xl">👻 💥</div>
        <h2 class="text-2xl sm:text-3xl font-black text-red-500">體力耗盡... 挑戰失敗！</h2>
        <p class="text-gray-600 text-sm">單字片語還不夠熟練，先回到前面溫習並利用拼字練習記熟吧！</p>
        <button @click="$emit('restart')" class="bg-red-500 hover:bg-red-600 text-white font-black px-6 py-3 rounded-2xl text-lg shadow-lg active:scale-95 transition">
          重新挑戰 ➔
        </button>
      </div>
    </div>
  `
};
