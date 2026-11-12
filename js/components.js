// ==================== UI 組件模組 ====================

// 頂部勇者資訊列
const ProfileBar = {
  name: 'ProfileBar',
  props: ['currentUser', 'users'],
  emits: ['switch-user', 'open-profile-modal'],
  template: `
    <div class="flex items-center justify-between bg-gradient-to-r from-amber-500 to-indigo-600 text-white px-3 sm:px-4 py-2 rounded-2xl mb-3 shadow-md">
      <div class="flex items-center gap-2">
        <span class="text-2xl">{{ currentUser.avatar || '🧙‍♂️' }}</span>
        <div>
          <div class="flex items-center gap-1.5">
            <span class="font-black text-sm sm:text-base tracking-wide">{{ currentUser.name }}</span>
            <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">勇者</span>
          </div>
          <div class="text-[10px] sm:text-xs text-amber-200 font-bold">
            已擊敗巨龍: {{ currentUser.bossVictories }} 次
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <select :value="currentUser.id" 
                @change="$emit('switch-user', $event.target.value)"
                class="bg-white/20 hover:bg-white/30 text-white font-bold py-1 px-2 rounded-xl text-xs outline-none cursor-pointer border border-white/30">
          <option v-for="u in users" :key="u.id" :value="u.id" class="text-slate-800">
            {{ u.avatar }} {{ u.name }}
          </option>
        </select>

        <button @click="$emit('open-profile-modal')" 
                type="button"
                class="bg-white text-indigo-950 hover:bg-amber-100 active:scale-95 font-black px-2.5 py-1 rounded-xl text-xs shadow transition flex items-center gap-1">
          📊 <span>歷程/課本</span>
        </button>
      </div>
    </div>
  `
};

// 頂部模式導航列
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

// 書本與課次選單組件
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

// 學習歷程與小孩課本指定彈跳視窗
const UserProfileModal = {
  name: 'UserProfileModal',
  props: ['show', 'currentUser', 'users', 'allAvailableBooks'],
  emits: ['close', 'save-user-settings', 'add-user', 'delete-user'],
  data() {
    return {
      editName: '',
      editAvatar: '🧙‍♂️',
      selectedBooks: [],
      newUserName: '',
      newUserAvatar: '🧝‍♀️',
      avatarList: ['🧙‍♂️', '🧝‍♀️', '🦸‍♂️', '🦸‍♀️', '🥷', '🧑‍🚀', '👸', '🤴', '🦁', '🦖']
    };
  },
  watch: {
    currentUser: {
      immediate: true,
      handler(u) {
        if (u) {
          this.editName = u.name || '';
          this.editAvatar = u.avatar || '🧙‍♂️';
          this.selectedBooks = Array.isArray(u.assignedBookIds) ? [...u.assignedBookIds] : [];
        }
      }
    }
  },
  computed: {
    studiedCount() {
      if (!this.currentUser || !this.currentUser.studiedWords) return 0;
      return Object.keys(this.currentUser.studiedWords).length;
    },
    listenRate() {
      if (!this.currentUser || !this.currentUser.listenAttempts) return 0;
      return Math.round((this.currentUser.listenCorrect / this.currentUser.listenAttempts) * 100);
    },
    spellRate() {
      if (!this.currentUser || !this.currentUser.spellAttempts) return 0;
      return Math.round((this.currentUser.spellCorrect / this.currentUser.spellAttempts) * 100);
    }
  },
  methods: {
    toggleBook(bookId) {
      const idx = this.selectedBooks.indexOf(bookId);
      if (idx > -1) {
        this.selectedBooks.splice(idx, 1);
      } else {
        this.selectedBooks.push(bookId);
      }
    },
    saveCurrent() {
      this.$emit('save-user-settings', {
        id: this.currentUser.id,
        name: this.editName.trim() || this.currentUser.name,
        avatar: this.editAvatar,
        assignedBookIds: this.selectedBooks
      });
      this.$emit('close');
    },
    addNewUser() {
      if (!this.newUserName.trim()) return;
      this.$emit('add-user', {
        name: this.newUserName.trim(),
        avatar: this.newUserAvatar
      });
      this.newUserName = '';
    }
  },
  template: `
    <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div class="bg-white w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto border-4 border-indigo-200">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📜</span>
            <h2 class="text-xl font-black text-slate-800">勇者冒險日誌 & 學習狀態</h2>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl font-bold p-1">✕</button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-center">
          <div class="bg-amber-50 border border-amber-200 rounded-2xl p-2.5">
            <div class="text-xs font-bold text-amber-800">⭐ 累積星幣</div>
            <div class="text-xl font-black text-amber-950 mt-0.5">{{ currentUser.stars }}</div>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-2xl p-2.5">
            <div class="text-xs font-bold text-blue-800">📖 已學單字</div>
            <div class="text-xl font-black text-blue-950 mt-0.5">{{ studiedCount }} 字</div>
          </div>
          <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5">
            <div class="text-xs font-bold text-emerald-800">👂 聽力答對率</div>
            <div class="text-xl font-black text-emerald-950 mt-0.5">{{ listenRate }}%</div>
          </div>
          <div class="bg-purple-50 border border-purple-200 rounded-2xl p-2.5">
            <div class="text-xs font-bold text-purple-800">🐉 巨龍斬擊</div>
            <div class="text-xl font-black text-purple-950 mt-0.5">{{ currentUser.bossVictories }} 勝</div>
          </div>
        </div>

        <div class="mt-5 space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div class="text-xs font-black text-slate-700">✏️ 目前使用者設定：</div>
          <div class="flex items-center gap-2">
            <input v-model="editName" type="text" placeholder="小孩姓名/稱呼"
                   class="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-bold flex-1 outline-none focus:ring-2 focus:ring-indigo-400">
            <div class="flex gap-1 overflow-x-auto py-1">
              <span v-for="av in avatarList" :key="av" @click="editAvatar = av"
                    :class="editAvatar === av ? 'bg-indigo-200 border-2 border-indigo-600 scale-110' : 'bg-white border border-slate-200'"
                    class="cursor-pointer text-lg p-1 rounded-xl transition">
                {{ av }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-4 space-y-2">
          <div class="flex justify-between items-center">
            <div class="text-xs font-black text-slate-800">📚 指定此勇者的學習課本：</div>
            <span class="text-[11px] text-gray-500 font-bold">（不勾選代表可見全部）</span>
          </div>
          <div class="space-y-1.5 max-h-36 overflow-y-auto bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
            <label v-for="b in allAvailableBooks" :key="b.id" 
                   class="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50">
              <input type="checkbox" 
                     :checked="selectedBooks.includes(b.id)"
                     @change="toggleBook(b.id)"
                     class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500">
              <span class="text-xs font-bold text-slate-700">{{ b.name }}</span>
            </label>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
          <input v-model="newUserName" type="text" placeholder="新增小孩 (例如: 二寶)"
                 class="bg-white border border-slate-300 rounded-xl px-3 py-1 text-xs font-bold flex-1 outline-none">
          <select v-model="newUserAvatar" class="bg-white border border-slate-300 rounded-xl px-2 py-1 text-xs font-bold">
            <option v-for="av in avatarList" :key="av" :value="av">{{ av }}</option>
          </select>
          <button @click="addNewUser" type="button" 
                  class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1 rounded-xl text-xs shadow">
            + 新增勇者
          </button>
        </div>

        <div class="mt-5 flex gap-2">
          <button @click="saveCurrent" type="button" 
                  class="flex-1 bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-black py-2.5 rounded-2xl text-sm shadow-md active:scale-95 transition">
            儲存學習設定 ➔
          </button>
          <button v-if="users.length > 1" @click="$emit('delete-user', currentUser.id)" type="button"
                  class="bg-red-100 text-red-600 font-bold px-3 py-2.5 rounded-2xl text-xs hover:bg-red-200 transition">
            刪除
          </button>
        </div>
      </div>
    </div>
  `
};

// ==================== 新增：單字重複默寫練習彈窗 (5~10次) ====================
const WordPracticeModal = {
  name: 'WordPracticeModal',
  props: ['show', 'word'],
  emits: ['close', 'speak', 'practice-complete'],
  setup(props, { emit }) {
    const { ref, computed, watch, nextTick } = Vue;
    const targetCount = ref(5); // 預設 5 次，可切換 5, 8, 10 次
    const currentRep = ref(1);
    const typedWord = ref('');
    const isRecognizing = ref(false);
    const isShaking = ref(false);
    const statusMsg = ref('');
    const statusColor = ref('text-green-600');
    const isFinished = ref(false);

    // 裝置判定
    const isTouchDevice = ref(false);
    const hwCanvas = ref(null);
    const pcInputRef = ref(null);
    let hwCtx = null;
    let isDrawing = false;
    let currentStroke = [];
    let strokes = [];
    let recognizeTimer = null;

    const checkDevice = () => {
      isTouchDevice.value = window.matchMedia('(pointer: coarse)').matches || 
                            ('ontouchstart' in window) || 
                            (navigator.maxTouchPoints > 0);
    };

    // 即時逐字紅字對比
    const analyzedLetters = computed(() => {
      if (!props.word || !typedWord.value) return [];
      const target = props.word.word.trim().toLowerCase();
      const input = typedWord.value.toLowerCase();
      const result = [];

      for (let i = 0; i < input.length; i++) {
        const char = typedWord.value[i];
        const isCorrect = (i < target.length && input[i] === target[i]);
        result.push({
          char: char,
          isSpace: char === ' ',
          isError: !isCorrect
        });
      }
      return result;
    });

    const getPointPos = (canvas, clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: Math.round(clientX - rect.left),
        y: Math.round(clientY - rect.top)
      };
    };

    const initCanvas = () => {
      if (!isTouchDevice.value || !hwCanvas.value) return;
      const canvas = hwCanvas.value;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width);
      canvas.height = 135;

      hwCtx = canvas.getContext('2d');
      hwCtx.lineWidth = 4;
      hwCtx.lineCap = 'round';
      hwCtx.lineJoin = 'round';
      hwCtx.strokeStyle = '#047857';
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
            isRecognizing.value = true;
            const letter = await recognizeInk(strokes, canvas.width, canvas.height);
            isRecognizing.value = false;
            if (letter) {
              typedWord.value += letter;
            }
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
    };

    const resetPracticeState = (count = 5) => {
      targetCount.value = count;
      currentRep.value = 1;
      typedWord.value = '';
      statusMsg.value = '';
      isFinished.value = false;
      checkDevice();
      nextTick(() => {
        if (isTouchDevice.value) {
          initCanvas();
        } else if (pcInputRef.value) {
          pcInputRef.value.focus();
        }
      });
    };

    const setTargetCount = (c) => {
      resetPracticeState(c);
    };

    watch(() => props.show, (val) => {
      if (val) {
        resetPracticeState(5);
        if (props.word) emit('speak', props.word.word);
      }
    });

    const addSpace = () => {
      if (typedWord.value.length > 0 && !typedWord.value.endsWith(' ')) {
        typedWord.value += ' ';
        playClickBeep(520);
      }
    };

    const backspace = () => {
      typedWord.value = typedWord.value.slice(0, -1);
    };

    const clearWord = () => {
      typedWord.value = '';
      clearCanvas();
    };

    const checkCurrentRep = () => {
      if (!props.word || isFinished.value) return;
      const input = typedWord.value.trim().toLowerCase().replace(/\s+/g, ' ');
      const target = props.word.word.trim().toLowerCase().replace(/\s+/g, ' ');

      if (input === target) {
        statusMsg.value = `✨ 第 ${currentRep.value} 次寫對了！太棒了！`;
        statusColor.value = 'text-emerald-600';
        emit('speak', props.word.word);

        setTimeout(() => {
          typedWord.value = '';
          statusMsg.value = '';
          clearCanvas();

          if (currentRep.value < targetCount.value) {
            currentRep.value++;
            if (!isTouchDevice.value && pcInputRef.value) {
              pcInputRef.value.focus();
            }
          } else {
            isFinished.value = true;
            emit('practice-complete', { word: props.word.word, count: targetCount.value });
            if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          }
        }, 750);
      } else {
        isShaking.value = true;
        setTimeout(() => { isShaking.value = false; }, 400);
        statusMsg.value = '❌ 有些字母寫錯囉，看上面的紅色標記修正吧！';
        statusColor.value = 'text-red-500';
      }
    };

    return {
      targetCount,
      currentRep,
      typedWord,
      isRecognizing,
      isShaking,
      statusMsg,
      statusColor,
      isFinished,
      isTouchDevice,
      hwCanvas,
      pcInputRef,
      analyzedLetters,
      setTargetCount,
      resetPracticeState,
      addSpace,
      backspace,
      clearWord,
      checkCurrentRep
    };
  },
  template: `
    <div v-if="show && word" class="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-2.5 sm:p-4">
      <div class="bg-white w-full max-w-lg rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-emerald-400 max-h-[95vh] overflow-y-auto"
           :class="{ 'shake-anim': isShaking }">
        
        <!-- 頂部標題與關閉 -->
        <div class="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <span class="text-xl">✍️</span>
            <h2 class="text-lg sm:text-xl font-black text-emerald-950">單字背誦默寫特訓</h2>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl font-bold p-1">✕</button>
        </div>

        <!-- 次數選擇與進度條 -->
        <div class="mt-3 flex flex-wrap items-center justify-between gap-2 bg-emerald-50/80 p-2.5 rounded-2xl border border-emerald-200">
          <div class="flex items-center gap-1">
            <span class="text-xs font-black text-emerald-900">練習次數:</span>
            <button v-for="c in [5, 8, 10]" :key="c"
                    @click="setTargetCount(c)"
                    :class="targetCount === c ? 'bg-emerald-600 text-white font-black shadow' : 'bg-white text-emerald-800 border border-emerald-200'"
                    class="px-2.5 py-1 rounded-xl text-xs font-bold transition">
              {{ c }} 次
            </button>
          </div>
          <div class="text-xs font-black text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-emerald-200">
            進度：{{ isFinished ? targetCount : currentRep }} / {{ targetCount }} 次
          </div>
        </div>

        <!-- 進度百分比長條 -->
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
          <div class="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
               :style="{ width: ((isFinished ? targetCount : currentRep - 1) / targetCount) * 100 + '%' }"></div>
        </div>

        <!-- 默寫目標單字提示卡 (前 2 次顯示單字供描摹記憶，第 3 次起遮蔽考驗真正默寫！) -->
        <div class="mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
          <div class="flex items-center justify-center gap-2">
            <span class="text-2xl font-black text-slate-800">{{ word.meaning }}</span>
            <button @click="$emit('speak', word.word)" class="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-xl text-xs shadow">
              🔊 聽發音
            </button>
          </div>

          <div class="mt-1.5">
            <span v-if="currentRep <= 2 && !isFinished" class="inline-block bg-white border border-amber-300 px-3 py-0.5 rounded-xl font-mono font-black text-lg text-blue-900 tracking-wider">
              👀 參考拼字：{{ word.word }}
            </span>
            <span v-else-if="!isFinished" class="inline-block bg-amber-200/70 text-amber-950 px-3 py-0.5 rounded-full text-xs font-black">
              🧠 進入盲寫考驗！請靠記憶默寫出單字（共 {{ word.word.length }} 字元）
            </span>
          </div>
        </div>

        <!-- 練習進行中區塊 -->
        <div v-if="!isFinished" class="mt-3 space-y-3">
          <!-- 即時對比與自動換行呈現區 -->
          <div class="bg-white border-2 border-emerald-300 rounded-2xl p-2.5 shadow-sm space-y-2">
            <div class="flex items-center justify-between pb-1 border-b border-emerald-100">
              <div class="flex items-center gap-1">
                <span class="text-xs font-bold text-emerald-700">目前拼字：</span>
                <span v-if="isRecognizing" class="text-xs text-emerald-500 animate-pulse font-bold">（辨識中...）</span>
              </div>
              <div class="flex gap-1.5 shrink-0">
                <button v-if="isTouchDevice" @click="addSpace" type="button" 
                        class="bg-emerald-100 hover:bg-emerald-200 active:scale-90 text-emerald-900 font-bold px-2.5 py-1 rounded-xl text-xs border border-emerald-300">
                  ␣ 空白
                </button>
                <button @click="backspace" type="button" 
                        class="bg-amber-100 hover:bg-amber-200 active:scale-90 text-amber-900 font-bold px-2.5 py-1 rounded-xl text-xs">
                  ⌫ 倒退
                </button>
                <button @click="clearWord" type="button" 
                        class="bg-gray-100 hover:bg-gray-200 active:scale-90 text-gray-600 font-bold px-2.5 py-1 rounded-xl text-xs">
                  清空
                </button>
              </div>
            </div>

            <!-- 逐字呈現（錯誤直接標紅底白字，支援手機自動換行） -->
            <div class="min-h-[38px] flex flex-wrap items-center gap-1.5 pt-0.5">
              <span v-if="typedWord.length === 0" class="text-xl font-black text-gray-300 tracking-wider font-mono">_____</span>
              <template v-else v-for="(item, idx) in analyzedLetters" :key="idx">
                <span v-if="item.isSpace" 
                      :class="item.isError ? 'bg-red-500 text-white border-b-4 border-red-700' : 'bg-emerald-100 text-emerald-800 border-b-4 border-emerald-500'"
                      class="px-2 py-0.5 rounded text-xs font-black">
                  ␣ 空格
                </span>
                <span v-else 
                      :class="item.isError ? 'bg-red-500 text-white px-2 py-0.5 rounded-lg text-2xl font-black font-mono shadow-md animate-bounce' : 'text-2xl font-black text-emerald-900 font-mono px-0.5'">
                  {{ item.char }}
                </span>
              </template>
            </div>
          </div>

          <!-- 裝置自適應輸入區域 -->
          <!-- PC 端：實體鍵盤直覺輸入 -->
          <div v-if="!isTouchDevice" class="bg-slate-50 border-2 border-emerald-200 rounded-2xl p-3 text-center space-y-1">
            <label class="text-xs font-black text-emerald-900 block">💻 實體鍵盤輸入（輸入完成按 Enter 確認）：</label>
            <input ref="pcInputRef"
                   type="text"
                   v-model="typedWord"
                   @keyup.enter="checkCurrentRep"
                   placeholder="在此輸入單字..."
                   class="w-full text-center bg-white border-2 border-emerald-300 rounded-xl py-2 px-4 text-xl font-mono font-black text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-200">
          </div>

          <!-- 手持裝置：手寫畫布 -->
          <div v-else class="bg-emerald-50/70 border-2 border-dashed border-emerald-300 rounded-2xl p-2 flex flex-col items-center">
            <div class="flex justify-between w-full px-2 text-[11px] font-bold text-emerald-800 mb-1">
              <span>✍️ 在此手寫字母（寫完停筆自動辨識）：</span>
              <span>📱 手寫模式</span>
            </div>
            <canvas ref="hwCanvas" class="handwriting-canvas bg-white rounded-xl shadow-inner border border-emerald-200 cursor-crosshair" height="135"></canvas>
          </div>

          <button @click="checkCurrentRep" type="button"
                  class="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black py-3 rounded-2xl text-base shadow-md transition">
            ✅ 確認本回合拼字 ({{ currentRep }} / {{ targetCount }})
          </button>

          <div v-if="statusMsg" class="text-center text-xs sm:text-sm font-black" :class="statusColor">
            {{ statusMsg }}
          </div>
        </div>

        <!-- 練習全部完成獎勵畫面 -->
        <div v-else class="py-8 text-center space-y-3">
          <div class="text-5xl animate-bounce">🎖️ 🌟 👏</div>
          <h3 class="text-2xl font-black text-emerald-700">太厲害了！完成 {{ targetCount }} 次默寫特訓！</h3>
          <p class="text-sm text-gray-600">你已經把 <b>{{ word.word }}</b> 牢牢記在腦海裡，獲得 <b>+3 ⭐</b> 星幣獎勵！</p>
          <div class="flex gap-2 pt-2">
            <button @click="resetPracticeState(targetCount)" type="button"
                    class="flex-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-2.5 rounded-xl text-sm shadow">
              🔄 再練一輪
            </button>
            <button @click="$emit('close')" type="button"
                    class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-sm shadow">
              回到溫習 ➔
            </button>
          </div>
        </div>

      </div>
    </div>
  `
};

// 單字溫習組件 (新增「✍️ 默寫練習」按鈕)
const StudyMode = {
  name: 'StudyMode',
  props: ['word', 'currentRate', 'isListening', 'feedback', 'feedbackColor'],
  emits: ['set-rate', 'speak', 'voice-challenge', 'open-practice', 'next'],
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

        <!-- 三大功能按鈕列：聽發音 / 開口挑戰 / 默寫練習 -->
        <div class="grid grid-cols-3 gap-2 sm:gap-3">
          <button @click="$emit('speak', word.word)" class="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-3.5 rounded-xl shadow flex flex-col sm:flex-row items-center justify-center gap-1 text-xs sm:text-sm">
            <span>🔊 聽發音</span>
          </button>
          <button @click="$emit('voice-challenge')" :class="isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600 active:scale-95'" class="text-white font-bold py-3.5 rounded-xl shadow flex flex-col sm:flex-row items-center justify-center gap-1 text-xs sm:text-sm">
            <span>🎤 {{ isListening ? '傾聽中' : '開口挑戰' }}</span>
          </button>
          <button @click="$emit('open-practice')" class="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black py-3.5 rounded-xl shadow flex flex-col sm:flex-row items-center justify-center gap-1 text-xs sm:text-sm">
            <span>✍️ 練習</span>
          </button>
        </div>

        <div v-if="feedback" class="text-lg font-black" :class="feedbackColor">{{ feedback }}</div>
        <button @click="$emit('next')" class="w-full bg-amber-400 hover:bg-amber-500 active:scale-98 py-3.5 rounded-xl font-black text-lg text-amber-950 shadow">下一題 ➔</button>
      </div>
    </div>
  `
};

// 聽力試煉組件
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

// 拼字試煉組件
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

// 決戰 Boss 組件 (支援 PC 鍵盤、手持手寫、紅字標錯、手機自動換行)
const BossBattle = {
  name: 'BossBattle',
  props: [
    'gameState', 'bossHp', 'playerHp', 'timer', 'isWritingActive', 'question',
    'questionIndex', 'totalQuestions', 'maskedSentence', 'typedWord', 'isRecognizing',
    'lastRecognizedLetter', 'combatMsg', 'combatMsgColor', 'isShaking', 'isListening'
  ],
  emits: ['add-space', 'backspace', 'clear', 'submit', 'voice-attack', 'restart', 'writing-start', 'writing-end', 'update-typed-word'],
  setup(props, { emit }) {
    const { ref, computed, onMounted, nextTick, watch } = Vue;
    const hwCanvas = ref(null);
    const pcInputRef = ref(null);
    let hwCtx = null;
    let isDrawing = false;
    let currentStroke = [];
    let strokes = [];
    let recognizeTimer = null;

    const isTouchDevice = ref(false);

    const checkDeviceType = () => {
      isTouchDevice.value = window.matchMedia('(pointer: coarse)').matches || 
                            ('ontouchstart' in window) || 
                            (navigator.maxTouchPoints > 0);
    };

    const analyzedLetters = computed(() => {
      if (!props.question || !props.typedWord) return [];
      const target = props.question.word.toLowerCase();
      const input = props.typedWord.toLowerCase();
      const result = [];

      for (let i = 0; i < input.length; i++) {
        const char = props.typedWord[i];
        const isCorrect = (i < target.length && input[i] === target[i]);
        result.push({
          char: char,
          isSpace: char === ' ',
          isError: !isCorrect
        });
      }
      return result;
    });

    const getPointPos = (canvas, clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: Math.round(clientX - rect.left),
        y: Math.round(clientY - rect.top)
      };
    };

    const initCanvas = () => {
      if (!isTouchDevice.value || !hwCanvas.value) return;
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
    };

    const onPcInput = (e) => {
      emit('update-typed-word', e.target.value);
    };

    const focusPcInput = () => {
      if (!isTouchDevice.value && pcInputRef.value) {
        pcInputRef.value.focus();
      }
    };

    watch(() => props.questionIndex, () => {
      clearCanvas();
      nextTick(() => focusPcInput());
    });

    onMounted(() => {
      checkDeviceType();
      nextTick(() => {
        if (isTouchDevice.value) initCanvas();
        else focusPcInput();
      });
      window.addEventListener('resize', () => {
        checkDeviceType();
        if (isTouchDevice.value) initCanvas();
      });
    });

    return { hwCanvas, pcInputRef, clearCanvas, isTouchDevice, analyzedLetters, onPcInput };
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
          <div class="flex justify-between items-center text-[11px] font-black text-purple-400 mb-1">
            <span>第 {{ questionIndex + 1 }} 題 / 共 {{ totalQuestions }} 題</span>
            <span class="bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded-full">
              {{ isTouchDevice ? '📱 手寫板模式' : '💻 實體鍵盤模式' }}
            </span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-purple-950 mt-1">{{ question.meaning }}</h2>
          <div class="inline-block bg-purple-200/80 text-purple-900 px-3 py-0.5 rounded-full text-xs font-bold tracking-widest mt-1">
            提示：{{ question.hint }} (共 {{ question.word.length }} 字元)
          </div>
          <p class="text-xs text-gray-500 italic mt-1 bg-white/70 p-1.5 rounded-lg border border-purple-100">“ {{ maskedSentence }} ”</p>
        </div>

        <!-- 拼字呈現區 (手機自動換行 + 紅字錯字提示) -->
        <div class="bg-white border-2 border-purple-300 rounded-2xl p-3 shadow-sm space-y-2">
          <div class="flex items-center justify-between pb-1.5 border-b border-purple-100">
            <div class="flex items-center gap-1">
              <span class="text-xs font-bold text-purple-700">拼字內容：</span>
              <span v-if="isRecognizing" class="text-xs text-emerald-500 animate-pulse font-bold">（辨識中...）</span>
            </div>

            <div class="flex gap-1.5 shrink-0">
              <button v-if="isTouchDevice" @click="$emit('add-space')" type="button" 
                      class="bg-purple-100 hover:bg-purple-200 active:scale-90 text-purple-900 font-bold px-2.5 py-1 rounded-xl text-xs transition border border-purple-300 shadow-sm">
                ␣ 空白
              </button>
              <button @click="$emit('backspace')" type="button" 
                      class="bg-amber-100 hover:bg-amber-200 active:scale-90 text-amber-900 font-bold px-2.5 py-1 rounded-xl text-xs transition">
                ⌫ 倒退
              </button>
              <button @click="$emit('clear')" type="button" 
                      class="bg-gray-100 hover:bg-gray-200 active:scale-90 text-gray-600 font-bold px-2.5 py-1 rounded-xl text-xs transition">
                清空
              </button>
            </div>
          </div>

          <div class="min-h-[38px] flex flex-wrap items-center gap-1.5 pt-0.5">
            <span v-if="typedWord.length === 0" class="text-xl font-black text-gray-300 tracking-wider font-mono">_____</span>
            
            <template v-else v-for="(item, idx) in analyzedLetters" :key="idx">
              <span v-if="item.isSpace" 
                    :class="item.isError ? 'bg-red-500 text-white border-b-4 border-red-700' : 'bg-purple-100 text-purple-700 border-b-4 border-purple-500'"
                    class="px-2 py-0.5 rounded text-xs font-black shadow-inner">
                ␣ 空格
              </span>

              <span v-else 
                    :class="item.isError ? 'bg-red-500 text-white px-2 py-0.5 rounded-lg text-2xl font-black font-mono shadow-md animate-bounce' : 'text-2xl font-black text-purple-900 font-mono px-0.5'">
                {{ item.char }}
              </span>
            </template>
          </div>
        </div>

        <!-- PC 端實體鍵盤輸入框 -->
        <div v-if="!isTouchDevice" class="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-3 text-center space-y-1">
          <label class="text-xs font-black text-indigo-900 block">⌨️ 請使用實體鍵盤直接打字（按 Enter 鍵可直接攻擊）：</label>
          <input ref="pcInputRef"
                 type="text" 
                 :value="typedWord" 
                 @input="onPcInput"
                 @keyup.enter="$emit('submit')"
                 placeholder="在此輸入單字..."
                 class="w-full text-center bg-white border-2 border-indigo-300 rounded-xl py-2 px-4 text-xl font-mono font-black text-indigo-950 outline-none focus:ring-4 focus:ring-indigo-300 shadow-inner">
        </div>

        <!-- 手持端手寫畫布 -->
        <div v-else class="bg-purple-100/50 border-2 border-dashed border-purple-300 rounded-2xl p-2 flex flex-col items-center relative">
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
