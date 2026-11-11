// ==================== UI 組件模組 ====================

// 頂部勇者資訊列 (切換小孩、星幣、歷程按鈕)
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
        <!-- 使用者切換下拉 -->
        <select :value="currentUser.id" 
                @change="$emit('switch-user', $event.target.value)"
                class="bg-white/20 hover:bg-white/30 text-white font-bold py-1 px-2 rounded-xl text-xs outline-none cursor-pointer border border-white/30">
          <option v-for="u in users" :key="u.id" :value="u.id" class="text-slate-800">
            {{ u.avatar }} {{ u.name }}
          </option>
        </select>

        <!-- 歷程與課本設定按鈕 -->
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

// 書本與課次選單組件 (依使用者指定權限過濾課本)
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

// 學習歷程與小孩課本指定彈跳視窗 (Modal)
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
        
        <!-- 標題列 -->
        <div class="flex items-center justify-between pb-3 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📜</span>
            <h2 class="text-xl font-black text-slate-800">勇者冒險日誌 & 學習狀態</h2>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl font-bold p-1">✕</button>
        </div>

        <!-- 1. 學習歷程數據卡片 -->
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

        <!-- 2. 小孩基本資料修改 -->
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

        <!-- 3. 指定該使用者學習的課本 (多課本綁定) -->
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

        <!-- 4. 新增另一位小孩/勇者 -->
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

        <!-- 底部儲存確認 -->
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

// 單字溫習組件
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


// 決戰 Boss 組件 (支援 PC 鍵盤輸入、手持手寫板、逐字錯誤紅字提示)
const BossBattle = {
  name: 'BossBattle',
  props: [
    'gameState', 'bossHp', 'playerHp', 'timer', 'isWritingActive', 'question',
    'questionIndex', 'totalQuestions', 'maskedSentence', 'typedWord', 'isRecognizing',
    'lastRecognizedLetter', 'combatMsg', 'combatMsgColor', 'isShaking', 'isListening'
  ],
  emits: ['add-space', 'backspace', 'clear', 'submit', 'voice-attack', 'restart', 'writing-start', 'writing-end', 'update-typed-word'],
  setup(props, { emit }) {
    const { ref, computed, onMounted, onUnmounted, nextTick, watch } = Vue;
    const hwCanvas = ref(null);
    const pcInputRef = ref(null);
    let hwCtx = null;
    let isDrawing = false;
    let currentStroke = [];
    let strokes = [];
    let recognizeTimer = null;

    // 判斷是否為觸控手持裝置 (iPad, 平板, 手機)
    const isTouchDevice = ref(false);

    const checkDeviceType = () => {
      // 偵測裝置是否以觸控為主要輸入
      isTouchDevice.value = window.matchMedia('(pointer: coarse)').matches || 
                            ('ontouchstart' in window) || 
                            (navigator.maxTouchPoints > 0);
    };

    // 逐字元即時對比比對結果 (產生綠/紫正確，紅字錯誤標記)
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
          isError: !isCorrect // 輸入位置與正確單字不符即為錯誤
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

    // PC 鍵盤輸入同步至 typedWord
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

    return { 
      hwCanvas, 
      pcInputRef, 
      clearCanvas, 
      isTouchDevice, 
      analyzedLetters, 
      onPcInput 
    };
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

        <!-- 拼字呈現區 (含即時逐字紅字錯誤標記) -->
        <div class="bg-white border-2 border-purple-300 rounded-2xl p-2.5 flex items-center justify-between shadow-sm">
          <div class="flex items-center gap-1.5 pl-2 overflow-x-auto min-h-[38px]">
            <span class="text-xs font-bold text-gray-400 shrink-0">拼字：</span>
            
            <span v-if="typedWord.length === 0" class="text-xl font-black text-gray-300 tracking-wider font-mono">_____</span>
            
            <!-- 逐字元比對呈現：錯誤直接標紅底白字，空格清楚呈現 -->
            <div v-else class="flex items-center gap-1">
              <template v-for="(item, idx) in analyzedLetters" :key="idx">
                <!-- 空白字符 -->
                <span v-if="item.isSpace" 
                      :class="item.isError 
                        ? 'bg-red-500 text-white border-b-4 border-red-700' 
                        : 'bg-purple-100 text-purple-700 border-b-4 border-purple-500'"
                      class="px-2 py-0.5 rounded text-xs font-black shadow-inner">
                  ␣ 空格
                </span>

                <!-- 字母字符 (答對紫色，寫錯立即紅字高亮警示) -->
                <span v-else 
                      :class="item.isError 
                        ? 'bg-red-500 text-white px-2 py-0.5 rounded-lg text-2xl font-black font-mono shadow-md animate-bounce' 
                        : 'text-2xl font-black text-purple-900 font-mono px-0.5'">
                  {{ item.char }}
                </span>
              </template>
            </div>

            <span v-if="isRecognizing" class="text-xs text-purple-500 animate-pulse font-bold shrink-0 ml-1">（辨識中...）</span>
          </div>

          <div class="flex gap-1.5 shrink-0 ml-2">
            <button v-if="isTouchDevice" @click="$emit('add-space')" type="button" 
                    class="bg-purple-100 hover:bg-purple-200 active:scale-90 text-purple-900 font-bold px-3 py-1.5 rounded-xl text-xs transition border border-purple-300 shadow-sm">
              ␣ 空白
            </button>
            <button @click="$emit('backspace')" type="button" 
                    class="bg-amber-100 hover:bg-amber-200 active:scale-90 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-xs transition">
              ⌫ 倒退
            </button>
            <button @click="$emit('clear')" type="button" 
                    class="bg-gray-100 hover:bg-gray-200 active:scale-90 text-gray-600 font-bold px-3 py-1.5 rounded-xl text-xs transition">
              清空
            </button>
          </div>
        </div>

        <!-- 依裝置動態切換：PC 鍵盤輸入框 vs 手持專用手寫板 -->
        <!-- PC 模式：實體鍵盤直覺輸入框 -->
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

        <!-- 手持模式：保留 iPad/手機 手寫畫布 (零虛擬鍵盤推擠干擾) -->
        <div v-else class="bg-purple-100/50 border-2 border-dashed border-purple-300 rounded-2xl p-2 flex flex-col items-center relative">
          <div class="flex justify-between w-full px-2 text-[11px] font-bold text-purple-700 mb-1">
            <span>✍️ 在此手寫字母（寫完停筆自動辨識）：</span>
            <span v-if="lastRecognizedLetter" class="text-purple-900 font-black">剛填入: {{ lastRecognizedLetter }}</span>
          </div>
          <canvas ref="hwCanvas" class="handwriting-canvas bg-white rounded-xl shadow-inner border border-purple-200 cursor-crosshair" height="140"></canvas>
        </div>

        <!-- 攻擊操作按鈕 -->
        <div class="grid grid-cols-2 gap-2">
          <button @click="$emit('submit')" class="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black py-3 rounded-2xl text-base shadow-md transition flex items-center justify-center gap-1">
            發動攻擊 ⚔️
          </button>
          <button @click="$emit('voice-attack')" :class="isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95'" class="text-white font-black py-3 rounded-2xl text-sm sm:text-base shadow-md transition flex items-center justify-center gap-1">
            🎤 {{ isListening ? '傾聽中...' : '開口唸單字' }}
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
        <p class="text-gray-600 text-sm">你成功看著中文完整背出所有單字與片語，獲得 10 顆星幣！</p>
        <button @click="$emit('restart')" class="bg-green-500 hover:bg-green-600 text-white font-black px-6 py-3 rounded-2xl text-lg shadow-lg active:scale-95 transition">再次挑戰魔王 ➔</button>
      </div>

      <!-- 失敗畫面 -->
      <div v-else-if="gameState === 'gameover'" class="text-center py-10 space-y-3">
        <div class="text-6xl">👻 💥</div>
        <h2 class="text-2xl sm:text-3xl font-black text-red-500">體力耗盡... 挑戰失敗！</h2>
        <p class="text-gray-600 text-sm">單字片語還不夠熟練，先回到前面溫習並利用拼字練習記熟吧！</p>
        <button @click="$emit('restart')" class="bg-red-500 hover:bg-red-600 text-white font-black px-6 py-3 rounded-2xl text-lg shadow-lg active:scale-95 transition">重新挑戰 ➔</button>
      </div>
    </div>
  `
};
