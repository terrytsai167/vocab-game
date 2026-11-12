// ==================== 8-Bit 像素風 UI 組件模組 ====================

// 1. 頂部勇者 RPG 狀態列
const ProfileBar = {
  name: 'ProfileBar',
  props: ['currentUser', 'users'],
  emits: ['switch-user', 'open-profile-modal'],
  template: `
    <div class="pixel-box bg-[#1e293b] text-white px-3 sm:px-4 py-2.5 mb-3 flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2.5">
        <div class="pixel-box-sm bg-amber-300 text-slate-900 w-10 h-10 flex items-center justify-center text-2xl overflow-hidden shrink-0">
          <img v-if="currentUser.avatar && currentUser.avatar.startsWith('data:image')" 
               :src="currentUser.avatar" 
               class="w-full h-full object-cover">
          <span v-else>{{ currentUser.avatar || '🧙‍♂️' }}</span>
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-sm sm:text-base tracking-wider text-amber-300">勇者 {{ currentUser.name }}</span>
          </div>
          <div class="text-[11px] text-emerald-300 flex items-center gap-1 mt-0.5">
            <span>❤️ 斬龍戰績: {{ currentUser.bossVictories }} 勝</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <select :value="currentUser.id" 
                @change="$emit('switch-user', $event.target.value)"
                class="pixel-select bg-slate-800 text-amber-200 py-1 px-2 text-xs font-bold cursor-pointer">
          <option v-for="u in users" :key="u.id" :value="u.id" class="bg-slate-800 text-white">
            {{ (u.avatar && u.avatar.startsWith('data:image')) ? '🖼️' : u.avatar }} {{ u.name }}
          </option>
        </select>

        <button @click="$emit('open-profile-modal')" 
                type="button"
                class="pixel-btn bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1.5 text-xs flex items-center gap-1">
          <span>📜 歷程/課本</span>
        </button>
      </div>
    </div>
  `
};

// 2. 頂部四大模式分頁 (8-Bit 街機按鍵)
const NavBar = {
  name: 'NavBar',
  props: ['currentMode', 'stars'],
  emits: ['set-mode'],
  template: `
    <div class="flex flex-wrap justify-between items-center mb-3 pb-3 border-b-4 border-slate-800 gap-2">
      <div class="flex flex-wrap gap-1.5 sm:gap-2">
        <button @click="$emit('set-mode', 'study')" 
                :class="currentMode === 'study' ? 'bg-amber-400 text-slate-950 -translate-y-0.5' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'"
                class="pixel-btn px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold">📖 單字溫習</button>
        <button @click="$emit('set-mode', 'trial_listen')" 
                :class="currentMode === 'trial_listen' ? 'bg-sky-400 text-slate-950 -translate-y-0.5' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'"
                class="pixel-btn px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold">👂 聽力試煉</button>
        <button @click="$emit('set-mode', 'trial_spell')" 
                :class="currentMode === 'trial_spell' ? 'bg-emerald-400 text-slate-950 -translate-y-0.5' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'"
                class="pixel-btn px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold">🧩 拼字試煉</button>
        <button @click="$emit('set-mode', 'boss')" 
                :class="currentMode === 'boss' ? 'bg-rose-500 text-white -translate-y-0.5 animate-pulse' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'"
                class="pixel-btn px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold">⚔️ 決戰 Boss</button>
      </div>
      <div class="pixel-box-sm bg-slate-900 px-3 py-1 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-1">
        <span>★ 星幣:</span><span class="pixel-en text-base">{{ stars }}</span>
      </div>
    </div>
  `
};

// 3. 書本與課次選單組件 (復古羊皮紙工具列)
const BookUnitSelector = {
  name: 'BookUnitSelector',
  props: ['bookList', 'selectedBookId', 'unitList', 'selectedUnit', 'totalWords', 'currentMode', 'currentIndex', 'currentWordCount'],
  emits: ['change-book', 'change-unit'],
  template: `
    <div class="pixel-box-sm flex flex-col sm:flex-row sm:items-center justify-between mb-4 bg-[#f3e5ab] p-2.5 gap-2">
      <div class="flex flex-wrap items-center gap-2">
        <div v-if="bookList && bookList.length > 0" class="flex items-center gap-1.5">
          <span class="text-xs font-bold text-slate-900">📘 本冊:</span>
          <select :value="selectedBookId" @change="$emit('change-book', $event.target.value)"
                  class="pixel-select bg-white text-slate-950 font-bold py-1 px-2 text-xs cursor-pointer">
            <option v-for="b in bookList" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-xs font-bold text-slate-900">📚 課次:</span>
          <select :value="selectedUnit" @change="$emit('change-unit', $event.target.value)"
                  class="pixel-select bg-white text-slate-950 font-bold py-1 px-2 text-xs cursor-pointer">
            <option value="ALL">全部 (共 {{ totalWords }} 字)</option>
            <option v-for="u in unitList" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
      </div>
      <div v-if="currentMode === 'study' && currentWordCount > 0" class="pixel-en text-xs font-bold text-slate-800 self-end sm:self-auto bg-white/70 px-2 py-0.5 border-2 border-slate-800">
        {{ currentIndex + 1 }}/{{ currentWordCount }}
      </div>
    </div>
  `
};

// 4. 學習歷程與課本指定視窗 (RPG 冒險日誌)
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
    async handleAvatarUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      try {
        if (typeof play8BitSfx === 'function') play8BitSfx('click');
        if (typeof convertImageToPixelAvatar === 'function') {
          this.editAvatar = await convertImageToPixelAvatar(file, 96, 32);
        } else {
          // 內建備援：直接裁切並像素化為 96x96
          this.editAvatar = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const img = new Image();
              img.onload = () => {
                const minSide = Math.min(img.width, img.height);
                const sx = (img.width - minSide) / 2;
                const sy = (img.height - minSide) / 2;
                const tiny = document.createElement('canvas');
                tiny.width = 32; tiny.height = 32;
                tiny.getContext('2d').drawImage(img, sx, sy, minSide, minSide, 0, 0, 32, 32);
                const out = document.createElement('canvas');
                out.width = 96; out.height = 96;
                const ctx = out.getContext('2d');
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(tiny, 0, 0, 32, 32, 0, 0, 96, 96);
                resolve(out.toDataURL('image/jpeg', 0.85));
              };
              img.onerror = reject;
              img.src = ev.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }
        if (typeof play8BitSfx === 'function') play8BitSfx('coin');
      } catch (err) {
        alert('頭像轉換失敗：' + err.message);
      }
      e.target.value = '';
    },
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
    <div v-if="show" class="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3">
      <div class="pixel-box bg-[#fffbeb] w-full max-w-lg p-5 sm:p-6 max-h-[90vh] overflow-y-auto text-slate-900">
        <div class="flex items-center justify-between pb-3 border-b-4 border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📜</span>
            <h2 class="text-lg sm:text-xl font-bold">勇者冒險日誌 & 學習狀態</h2>
          </div>
          <button @click="$emit('close')" class="pixel-btn bg-rose-500 text-white px-2.5 py-1 text-sm font-bold">✕</button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-center">
          <div class="pixel-box-sm bg-amber-200 p-2.5">
            <div class="text-xs font-bold text-slate-800">★ 累積星幣</div>
            <div class="pixel-en text-lg font-bold text-slate-950 mt-1">{{ currentUser.stars }}</div>
          </div>
          <div class="pixel-box-sm bg-sky-200 p-2.5">
            <div class="text-xs font-bold text-slate-800">📖 已學單字</div>
            <div class="text-lg font-bold text-slate-950 mt-1">{{ studiedCount }} 字</div>
          </div>
          <div class="pixel-box-sm bg-emerald-200 p-2.5">
            <div class="text-xs font-bold text-slate-800">👂 聽力命中</div>
            <div class="pixel-en text-lg font-bold text-slate-950 mt-1">{{ listenRate }}%</div>
          </div>
          <div class="pixel-box-sm bg-purple-200 p-2.5">
            <div class="text-xs font-bold text-slate-800">🐉 巨龍斬擊</div>
            <div class="text-lg font-bold text-slate-950 mt-1">{{ currentUser.bossVictories }} 勝</div>
          </div>
        </div>

        <div class="pixel-box-sm mt-5 space-y-3 bg-white p-3.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800">✏️ 目前勇者設定：</span>
            <label class="pixel-btn bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold px-2.5 py-1 text-xs cursor-pointer flex items-center gap-1">
              <span>📷 上傳照片頭像</span>
              <input type="file" accept="image/*" @change="handleAvatarUpload" class="hidden">
            </label>
          </div>

          <div class="flex items-center gap-2.5">
            <div class="pixel-box-sm w-12 h-12 bg-amber-200 flex items-center justify-center text-2xl overflow-hidden shrink-0">
              <img v-if="editAvatar && editAvatar.startsWith('data:image')" :src="editAvatar" class="w-full h-full object-cover">
              <span v-else>{{ editAvatar }}</span>
            </div>
            <input v-model="editName" type="text" placeholder="小孩姓名"
                   class="pixel-input bg-amber-50 px-3 py-2 text-sm font-bold flex-1 text-slate-900">
          </div>

          <div class="flex gap-1.5 overflow-x-auto py-1">
            <span v-for="av in avatarList" :key="av" @click="editAvatar = av"
                  :class="editAvatar === av ? 'bg-amber-300 border-2 border-slate-900 scale-110' : 'bg-slate-100 border-2 border-slate-300'"
                  class="cursor-pointer text-lg p-1 transition shrink-0">
              {{ av }}
            </span>
          </div>
        </div>

        <div class="mt-4 space-y-2">
          <div class="flex justify-between items-center">
            <div class="text-xs font-bold text-slate-900">📚 指定學習課本：</div>
            <span class="text-[11px] text-slate-600 font-bold">（不勾選代表全部開放）</span>
          </div>
          <div class="pixel-box-sm space-y-1.5 max-h-36 overflow-y-auto bg-white p-2.5">
            <label v-for="b in allAvailableBooks" :key="b.id" 
                   class="flex items-center gap-2 p-2 bg-amber-50/70 border-2 border-slate-300 cursor-pointer hover:bg-amber-100 text-slate-900">
              <input type="checkbox" 
                     :checked="selectedBooks.includes(b.id)"
                     @change="toggleBook(b.id)"
                     class="w-4 h-4 accent-slate-900 shrink-0">
              <span class="text-xs sm:text-sm font-bold text-slate-900">{{ b.name }}</span>
            </label>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t-2 border-slate-300 flex items-center gap-2">
          <input v-model="newUserName" type="text" placeholder="新增勇者 (如: 二寶)"
                 class="pixel-input bg-white px-3 py-1.5 text-xs font-bold flex-1 text-slate-900">
          <select v-model="newUserAvatar" class="pixel-select bg-white px-2 py-1.5 text-xs font-bold text-slate-900">
            <option v-for="av in avatarList" :key="av" :value="av">{{ av }}</option>
          </select>
          <button @click="addNewUser" type="button" 
                  class="pixel-btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 text-xs">
            + 新增
          </button>
        </div>

        <div class="mt-5 flex gap-2">
          <button @click="saveCurrent" type="button" 
                  class="pixel-btn flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 text-sm">
            💾 儲存設定 ➔
          </button>
          <button v-if="users.length > 1" @click="$emit('delete-user', currentUser.id)" type="button"
                  class="pixel-btn bg-rose-500 text-white font-bold px-3 py-2.5 text-xs">
            刪除
          </button>
        </div>
      </div>
    </div>
  `
};

// 5. 單字重複默寫特訓彈窗 (8-Bit 訓練道場)
const WordPracticeModal = {
  name: 'WordPracticeModal',
  props: ['show', 'word'],
  emits: ['close', 'speak', 'practice-complete'],
  setup(props, { emit }) {
    const { ref, computed, watch, nextTick } = Vue;
    const targetCount = ref(5);
    const currentRep = ref(1);
    const typedWord = ref('');
    const isRecognizing = ref(false);
    const isShaking = ref(false);
    const statusMsg = ref('');
    const statusColor = ref('text-emerald-700');
    const isFinished = ref(false);

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
      hwCtx.lineWidth = 5;
      hwCtx.lineCap = 'square';
      hwCtx.lineJoin = 'miter';
      hwCtx.strokeStyle = '#0f172a';
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
      play8BitSfx('click');
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
        play8BitSfx('click');
      }
    };

    const backspace = () => {
      typedWord.value = typedWord.value.slice(0, -1);
      play8BitSfx('click');
    };

    const clearWord = () => {
      typedWord.value = '';
      clearCanvas();
      play8BitSfx('click');
    };

    const checkCurrentRep = () => {
      if (!props.word || isFinished.value) return;
      const input = typedWord.value.trim().toLowerCase().replace(/\s+/g, ' ');
      const target = props.word.word.trim().toLowerCase().replace(/\s+/g, ' ');

      if (input === target) {
        play8BitSfx('coin');
        statusMsg.value = `✨ 第 ${currentRep.value} 次寫對了！`;
        statusColor.value = 'text-emerald-700';
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
            play8BitSfx('victory');
            emit('practice-complete', { word: props.word.word, count: targetCount.value });
            if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          }
        }, 750);
      } else {
        play8BitSfx('hit');
        isShaking.value = true;
        setTimeout(() => { isShaking.value = false; }, 400);
        statusMsg.value = '❌ 有些字母拼錯囉，看上方紅字修正！';
        statusColor.value = 'text-rose-600';
      }
    };

    return {
      targetCount, currentRep, typedWord, isRecognizing, isShaking,
      statusMsg, statusColor, isFinished, isTouchDevice, hwCanvas,
      pcInputRef, analyzedLetters, setTargetCount, resetPracticeState,
      addSpace, backspace, clearWord, checkCurrentRep
    };
  },
  template: `
    <div v-if="show && word" class="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-2.5 sm:p-4">
      <div class="pixel-box bg-[#fffbeb] w-full max-w-lg p-4 sm:p-6 max-h-[95vh] overflow-y-auto text-slate-900"
           :class="{ 'shake-anim': isShaking }">
        
        <div class="flex items-center justify-between pb-2.5 border-b-4 border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-xl">✍️</span>
            <h2 class="text-lg font-bold">勇者道場：默寫特訓</h2>
          </div>
          <button @click="$emit('close')" class="pixel-btn bg-rose-500 text-white px-2.5 py-1 text-xs font-bold">✕</button>
        </div>

        <div class="pixel-box-sm mt-3 flex flex-wrap items-center justify-between gap-2 bg-[#f3e5ab] p-2.5">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold">次數:</span>
            <button v-for="c in [5, 8, 10]" :key="c"
                    @click="setTargetCount(c)"
                    :class="targetCount === c ? 'bg-emerald-500 text-white -translate-y-0.5' : 'bg-white text-slate-800'"
                    class="pixel-btn px-2.5 py-1 text-xs font-bold">
              {{ c }}次
            </button>
          </div>
          <div class="pixel-en text-xs font-bold bg-white px-2.5 py-1 border-2 border-slate-800">
            {{ isFinished ? targetCount : currentRep }}/{{ targetCount }}
          </div>
        </div>

        <div class="w-full bg-slate-800 h-4 mt-2.5 p-0.5 border-2 border-slate-900">
          <div class="bg-emerald-400 h-full transition-all duration-300" 
               :style="{ width: ((isFinished ? targetCount : currentRep - 1) / targetCount) * 100 + '%' }"></div>
        </div>

        <div class="pixel-box-sm mt-3 bg-white p-3 text-center">
          <div class="flex items-center justify-center gap-2">
            <span class="text-2xl font-bold text-slate-900">{{ word.meaning }}</span>
            <button @click="$emit('speak', word.word)" class="pixel-btn bg-sky-400 text-slate-950 px-2 py-1 text-xs font-bold">
              🔊 發音
            </button>
          </div>

          <div class="mt-2">
            <span v-if="currentRep <= 2 && !isFinished" class="pixel-en inline-block bg-amber-100 border-2 border-slate-800 px-3 py-1 font-bold text-base sm:text-lg text-blue-900">
              👀 {{ word.word }}
            </span>
            <span v-else-if="!isFinished" class="inline-block bg-rose-100 border-2 border-rose-600 text-rose-800 px-3 py-1 text-xs font-bold">
              🧠 盲寫考驗！(共 {{ word.word.length }} 字元)
            </span>
          </div>
        </div>

        <div v-if="!isFinished" class="mt-3 space-y-3">
          <div class="pixel-box-sm bg-white p-2.5 space-y-2">
            <div class="flex items-center justify-between pb-1.5 border-b-2 border-slate-200">
              <div class="flex items-center gap-1">
                <span class="text-xs font-bold text-slate-700">目前拼字：</span>
                <span v-if="isRecognizing" class="text-xs text-emerald-600 animate-pulse font-bold">（辨識中...）</span>
              </div>
              <div class="flex gap-1.5 shrink-0">
                <button v-if="isTouchDevice" @click="addSpace" type="button" class="pixel-btn bg-purple-200 text-slate-900 font-bold px-2 py-1 text-xs">␣ 空白</button>
                <button @click="backspace" type="button" class="pixel-btn bg-amber-200 text-slate-900 font-bold px-2 py-1 text-xs">⌫ 倒退</button>
                <button @click="clearWord" type="button" class="pixel-btn bg-slate-200 text-slate-900 font-bold px-2 py-1 text-xs">清空</button>
              </div>
            </div>

            <div class="min-h-[42px] flex flex-wrap items-center gap-1.5 pt-0.5">
              <span v-if="typedWord.length === 0" class="pixel-en text-xl font-bold text-slate-300">_____</span>
              <template v-else v-for="(item, idx) in analyzedLetters" :key="idx">
                <span v-if="item.isSpace" 
                      :class="item.isError ? 'bg-rose-500 text-white' : 'bg-purple-200 text-slate-900'"
                      class="px-2 py-0.5 border-2 border-slate-800 text-xs font-bold">
                  ␣ 空格
                </span>
                <span v-else 
                      :class="item.isError ? 'bg-rose-500 text-white px-1.5 py-0.5 border-2 border-slate-900 animate-bounce' : 'text-slate-900 px-0.5'"
                      class="pixel-en text-xl sm:text-2xl font-bold">
                  {{ item.char }}
                </span>
              </template>
            </div>
          </div>

          <div v-if="!isTouchDevice" class="pixel-box-sm bg-slate-100 p-3 text-center space-y-1.5">
            <label class="text-xs font-bold text-slate-800 block">⌨️ 鍵盤輸入（按 Enter 確認）：</label>
            <input ref="pcInputRef"
                   type="text"
                   v-model="typedWord"
                   @keyup.enter="checkCurrentRep"
                   placeholder="TYPE HERE..."
                   class="pixel-input pixel-en w-full text-center bg-white py-2 px-3 text-lg font-bold text-slate-950">
          </div>

          <div v-else class="pixel-box-sm bg-emerald-50 p-2 flex flex-col items-center">
            <div class="flex justify-between w-full px-1 text-[11px] font-bold text-slate-800 mb-1">
              <span>✍️ 手寫輸入字母：</span>
              <span>📱 觸控版</span>
            </div>
            <canvas ref="hwCanvas" class="handwriting-canvas bg-white border-2 border-slate-800 cursor-crosshair" height="135"></canvas>
          </div>

          <button @click="checkCurrentRep" type="button"
                  class="pixel-btn w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 text-sm sm:text-base">
            ✅ 確認拼字 ({{ currentRep }}/{{ targetCount }})
          </button>

          <div v-if="statusMsg" class="text-center text-xs sm:text-sm font-bold" :class="statusColor">
            {{ statusMsg }}
          </div>
        </div>

        <div v-else class="py-6 text-center space-y-3">
          <div class="text-5xl animate-bounce">🏆 ⭐ 🎖️</div>
          <h3 class="text-xl font-bold text-emerald-700">特訓達成！完成 {{ targetCount }} 次默寫！</h3>
          <p class="text-xs sm:text-sm text-slate-700">獲得 <b>+3 ★</b> 星幣獎勵！</p>
          <div class="flex gap-2 pt-2">
            <button @click="resetPracticeState(targetCount)" type="button"
                    class="pixel-btn flex-1 bg-amber-300 text-slate-950 font-bold py-2.5 text-xs sm:text-sm">
              🔄 再練一輪
            </button>
            <button @click="$emit('close')" type="button"
                    class="pixel-btn flex-1 bg-emerald-500 text-slate-950 font-bold py-2.5 text-xs sm:text-sm">
              回到溫習 ➔
            </button>
          </div>
        </div>

      </div>
    </div>
  `
};

// 6. 單字溫習組件 (8-Bit 羊皮紙主視窗)
const StudyMode = {
  name: 'StudyMode',
  props: ['word', 'currentRate', 'isListening', 'feedback', 'feedbackColor'],
  emits: ['set-rate', 'speak', 'voice-challenge', 'open-practice', 'next'],
  template: `
    <div>
      <div class="flex justify-end mb-3">
        <div class="flex gap-1.5 bg-slate-800 p-1.5 border-2 border-slate-950 text-xs font-bold">
          <button @click="$emit('set-rate', 0.5)" :class="currentRate === 0.5 ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-200'" class="px-2 py-1">🐢 0.5x</button>
          <button @click="$emit('set-rate', 1.0)" :class="currentRate === 1.0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-200'" class="px-2 py-1">🚶 1.0x</button>
          <button @click="$emit('set-rate', 1.25)" :class="currentRate === 1.25 ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-200'" class="px-2 py-1">🐰 1.25x</button>
        </div>
      </div>

      <div v-if="word" class="space-y-4 text-center">
        <!-- 核心單字卡 -->
        <div class="pixel-box-sm bg-white p-5 relative">
          <div class="flex items-center justify-center gap-3">
            <h1 class="pixel-en text-2xl sm:text-4xl font-bold text-slate-950 tracking-wide break-all">{{ word.word }}</h1>
            <button @click="$emit('speak', word.word)" class="pixel-btn bg-sky-400 hover:bg-sky-300 text-slate-950 p-2.5 text-lg">🔊</button>
          </div>
          <p class="text-xl sm:text-2xl font-bold text-emerald-700 mt-3">{{ word.meaning }}</p>
        </div>

        <!-- 例句對話框 -->
        <div @click="$emit('speak', word.sentence)" class="pixel-box-sm bg-[#f8fafc] hover:bg-sky-50 p-3.5 text-left cursor-pointer transition">
          <div class="flex justify-between items-start gap-2">
            <p class="text-base sm:text-lg font-bold text-slate-900">“ {{ word.sentence }} ”</p>
            <span class="text-sky-600 text-base shrink-0">🔊</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-600 mt-1.5 font-bold">{{ word.sentence_cn }}</p>
        </div>

        <!-- 8-Bit 三大操作鍵 -->
        <div class="grid grid-cols-3 gap-2 sm:gap-3">
          <button @click="$emit('speak', word.word)" class="pixel-btn bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold py-3 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1">
            <span>🔊 聽發音</span>
          </button>
          <button @click="$emit('voice-challenge')" :class="isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'" class="pixel-btn font-bold py-3 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1">
            <span>🎤 {{ isListening ? '傾聽中' : '開口挑戰' }}</span>
          </button>
          <button @click="$emit('open-practice')" class="pixel-btn bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold py-3 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1">
            <span>✍️ 練習</span>
          </button>
        </div>

        <div v-if="feedback" class="text-sm sm:text-base font-bold" :class="feedbackColor">{{ feedback }}</div>

        <button @click="$emit('next')" class="pixel-btn w-full bg-amber-400 hover:bg-amber-300 py-3.5 font-bold text-base sm:text-lg text-slate-950">
          下一題 ➔
        </button>
      </div>
    </div>
  `
};

// 7. 聽力試煉組件
const ListenTrial = {
  name: 'ListenTrial',
  props: ['word', 'trialIndex', 'totalTrials', 'feedback', 'feedbackColor'],
  emits: ['speak', 'check'],
  template: `
    <div>
      <div class="text-center mb-4">
        <span class="bg-sky-400 text-slate-950 border-2 border-slate-900 text-xs font-bold px-3 py-1">關卡：聽力盲測</span>
        <h2 class="text-lg sm:text-xl font-bold text-slate-900 mt-2">選出發音對應的中文意思！</h2>
        <p class="pixel-en text-xs text-slate-600 mt-1">{{ trialIndex + 1 }}/{{ totalTrials }}</p>
      </div>
      <div v-if="word" class="space-y-4 text-center">
        <div class="pixel-box-sm bg-sky-100 p-5 flex flex-col items-center justify-center">
          <button @click="$emit('speak', word.word)" class="pixel-btn bg-sky-500 hover:bg-sky-400 text-white w-16 h-16 flex items-center justify-center text-3xl">🔊</button>
          <span class="text-xs font-bold text-slate-800 mt-2">點擊播放發音</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button v-for="(opt, idx) in word.options" :key="idx" @click="$emit('check', opt)"
                  class="pixel-btn bg-white hover:bg-amber-200 p-3.5 text-sm sm:text-base font-bold text-slate-900">
            {{ opt }}
          </button>
        </div>
        <div v-if="feedback" class="text-base font-bold" :class="feedbackColor">{{ feedback }}</div>
      </div>
    </div>
  `
};

// 8. 拼字試煉組件
const SpellTrial = {
  name: 'SpellTrial',
  props: ['word', 'trialIndex', 'totalTrials', 'spelledLetters', 'scrambledPool', 'feedback', 'feedbackColor'],
  emits: ['speak', 'pick-letter', 'remove-letter', 'reset', 'check'],
  template: `
    <div>
      <div class="text-center mb-4">
        <span class="bg-emerald-400 text-slate-950 border-2 border-slate-900 text-xs font-bold px-3 py-1">關卡：拼字積木</span>
        <h2 class="text-lg sm:text-xl font-bold text-slate-900 mt-2">拼出正確英文單字！</h2>
        <p class="pixel-en text-xs text-slate-600 mt-1">{{ trialIndex + 1 }}/{{ totalTrials }}</p>
      </div>
      <div v-if="word" class="space-y-4 text-center">
        <div class="pixel-box-sm bg-emerald-100 p-3.5 flex justify-between items-center px-4">
          <span class="text-lg sm:text-xl font-bold text-slate-950">{{ word.meaning }}</span>
          <button @click="$emit('speak', word.word)" class="pixel-btn bg-emerald-500 text-slate-950 px-2.5 py-1.5 text-xs font-bold">🔊 提示</button>
        </div>
        <div class="pixel-box-sm flex flex-wrap justify-center gap-1.5 min-h-[50px] p-2 bg-slate-200">
          <span v-for="(letter, i) in spelledLetters" :key="i" @click="$emit('remove-letter', i)"
                class="pixel-en w-10 h-10 bg-white text-slate-950 border-2 border-slate-900 font-bold text-base flex items-center justify-center cursor-pointer">
            {{ letter === ' ' ? '␣' : letter }}
          </span>
        </div>
        <div class="flex flex-wrap justify-center gap-1.5 pt-1">
          <button v-for="(item, idx) in scrambledPool" :key="idx" :disabled="item.used" @click="$emit('pick-letter', item)"
                  :class="item.used ? 'opacity-25 cursor-not-allowed bg-slate-300' : 'pixel-btn bg-amber-300 hover:bg-amber-200 text-slate-950'"
                  class="pixel-en w-10 h-10 font-bold text-base flex items-center justify-center">
            {{ item.letter === ' ' ? '␣' : item.letter }}
          </button>
        </div>
        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <button @click="$emit('reset')" class="pixel-btn bg-slate-300 text-slate-900 font-bold py-2.5 text-xs sm:text-sm">🔄 重新拼湊</button>
          <button @click="$emit('check')" class="pixel-btn bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-2.5 text-xs sm:text-sm">✨ 檢查拼字</button>
        </div>
        <div v-if="feedback" class="text-base font-bold" :class="feedbackColor">{{ feedback }}</div>
      </div>
    </div>
  `
};

// 9. 決戰 Boss 組件 (8-Bit 魔王城決戰介面)
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
      hwCtx.lineWidth = 5;
      hwCtx.lineCap = 'square';
      hwCtx.lineJoin = 'miter';
      hwCtx.strokeStyle = '#0f172a';
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
      <!-- 8-Bit 戰鬥血條面板 -->
      <div class="pixel-box-sm space-y-2 mb-3 bg-slate-900 text-white p-3">
        <div>
          <div class="flex justify-between items-center text-xs font-bold mb-1 text-rose-400">
            <span>👾 暗黑單字巨龍</span>
            <span class="pixel-en">{{ bossHp }}/100</span>
          </div>
          <div class="w-full bg-slate-700 h-4 p-0.5 border-2 border-white">
            <div class="bg-rose-500 h-full transition-all duration-300" :style="{ width: bossHp + '%' }"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between items-center text-xs font-bold mb-1 text-emerald-400">
            <span>🧙‍♂️ 勇者生命值</span>
            <span class="pixel-en">{{ playerHp }}/100</span>
          </div>
          <div class="w-full bg-slate-700 h-4 p-0.5 border-2 border-white">
            <div class="bg-emerald-400 h-full transition-all duration-300" :style="{ width: playerHp + '%' }"></div>
          </div>
        </div>
        <div v-if="gameState === 'playing'">
          <div class="flex justify-between text-[11px] font-bold text-amber-300 mb-1">
            <span class="flex items-center gap-1">
              <span>⏳ 時間</span>
              <span v-if="isWritingActive" class="text-sky-300 animate-pulse">（動筆暫停⏸️）</span>
            </span>
            <span class="pixel-en">{{ timer }}s</span>
          </div>
          <div class="w-full bg-slate-700 h-2.5 border border-white">
            <div class="h-full transition-all duration-1000 linear" 
                 :class="timer <= 10 ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'"
                 :style="{ width: (timer / 45) * 100 + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- 戰鬥進行中 -->
      <div v-if="gameState === 'playing' && question" class="space-y-3" :class="{ 'shake-anim': isShaking }">
        <div class="pixel-box-sm bg-white p-3.5 text-center relative">
          <div class="flex justify-between items-center text-[11px] font-bold text-slate-600 mb-1">
            <span class="pixel-en">STAGE {{ questionIndex + 1 }}/{{ totalQuestions }}</span>
            <span class="bg-slate-800 text-amber-300 px-2 py-0.5">
              {{ isTouchDevice ? '📱 手寫板' : '💻 鍵盤' }}
            </span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-950 mt-1">{{ question.meaning }}</h2>
          <div class="pixel-en inline-block bg-amber-200 border-2 border-slate-800 text-slate-950 px-3 py-1 text-xs font-bold mt-2">
            {{ question.hint }} ({{ question.word.length }})
          </div>
          <p class="text-xs text-slate-700 mt-2 bg-slate-100 p-1.5 border-2 border-slate-300 font-bold">“ {{ maskedSentence }} ”</p>
        </div>

        <!-- 拼字呈現區 (手機自動換行 + 紅字錯字提示) -->
        <div class="pixel-box-sm bg-white p-3 space-y-2">
          <div class="flex items-center justify-between pb-1.5 border-b-2 border-slate-200">
            <div class="flex items-center gap-1">
              <span class="text-xs font-bold text-slate-800">拼字：</span>
              <span v-if="isRecognizing" class="text-xs text-emerald-600 animate-pulse font-bold">（辨識中...）</span>
            </div>

            <div class="flex gap-1.5 shrink-0">
              <button v-if="isTouchDevice" @click="$emit('add-space')" type="button" 
                      class="pixel-btn bg-purple-200 text-slate-900 font-bold px-2 py-1 text-xs">
                ␣ 空白
              </button>
              <button @click="$emit('backspace')" type="button" 
                      class="pixel-btn bg-amber-200 text-slate-900 font-bold px-2 py-1 text-xs">
                ⌫ 倒退
              </button>
              <button @click="$emit('clear')" type="button" 
                      class="pixel-btn bg-slate-200 text-slate-900 font-bold px-2 py-1 text-xs">
                清空
              </button>
            </div>
          </div>

          <div class="min-h-[42px] flex flex-wrap items-center gap-1.5 pt-0.5">
            <span v-if="typedWord.length === 0" class="pixel-en text-xl font-bold text-slate-300">_____</span>
            
            <template v-else v-for="(item, idx) in analyzedLetters" :key="idx">
              <span v-if="item.isSpace" 
                    :class="item.isError ? 'bg-rose-500 text-white' : 'bg-purple-200 text-slate-900'"
                    class="px-2 py-0.5 border-2 border-slate-800 text-xs font-bold">
                ␣ 空格
              </span>

              <span v-else 
                    :class="item.isError ? 'bg-rose-500 text-white px-1.5 py-0.5 border-2 border-slate-900 animate-bounce' : 'text-slate-950 px-0.5'"
                    class="pixel-en text-xl sm:text-2xl font-bold">
                {{ item.char }}
              </span>
            </template>
          </div>
        </div>

        <!-- PC 端實體鍵盤輸入框 -->
        <div v-if="!isTouchDevice" class="pixel-box-sm bg-slate-100 p-3 text-center space-y-1.5">
          <label class="text-xs font-bold text-slate-800 block">⌨️ 鍵盤輸入（按 Enter 攻擊）：</label>
          <input ref="pcInputRef"
                 type="text" 
                 :value="typedWord" 
                 @input="onPcInput"
                 @keyup.enter="$emit('submit')"
                 placeholder="TYPE ANSWER..."
                 class="pixel-input pixel-en w-full text-center bg-white py-2 px-3 text-lg font-bold text-slate-950">
        </div>

        <!-- 手持端手寫畫布 -->
        <div v-else class="pixel-box-sm bg-amber-100/70 p-2 flex flex-col items-center relative">
          <div class="flex justify-between w-full px-1 text-[11px] font-bold text-slate-800 mb-1">
            <span>✍️ 手寫字母：</span>
            <span v-if="lastRecognizedLetter" class="text-indigo-800 font-bold">剛填入: {{ lastRecognizedLetter }}</span>
          </div>
          <canvas ref="hwCanvas" class="handwriting-canvas bg-white border-2 border-slate-900 cursor-crosshair" height="140"></canvas>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          <button @click="$emit('submit')" class="pixel-btn bg-rose-500 hover:bg-rose-400 text-white font-bold py-3 text-sm sm:text-base flex items-center justify-center gap-1">⚔️ 發動攻擊</button>
          <button @click="$emit('voice-attack')" :class="isListening ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'" class="pixel-btn font-bold py-3 text-sm sm:text-base flex items-center justify-center gap-1">🎤 {{ isListening ? '傾聽中' : '開口唸單字' }}</button>
        </div>

        <div v-if="combatMsg" class="text-center text-xs sm:text-sm font-bold" :class="combatMsgColor">{{ combatMsg }}</div>
      </div>

      <!-- 勝利畫面 -->
      <div v-else-if="gameState === 'victory'" class="pixel-box-sm bg-amber-100 text-center py-8 px-4 space-y-3">
        <div class="text-5xl animate-bounce">👑 🏆 ⚔️</div>
        <h2 class="text-xl sm:text-2xl font-bold text-amber-700">VICTORY! 巨龍被擊敗了！</h2>
        <p class="text-slate-800 text-xs sm:text-sm font-bold">成功背出所有單字，獲得 +10 ★ 星幣！</p>
        <button @click="$emit('restart')" class="pixel-btn bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-6 py-3 text-sm sm:text-base">
          再次挑戰 ➔
        </button>
      </div>

      <!-- 失敗畫面 -->
      <div v-else-if="gameState === 'gameover'" class="pixel-box-sm bg-rose-100 text-center py-8 px-4 space-y-3">
        <div class="text-5xl">👻 💥</div>
        <h2 class="text-xl sm:text-2xl font-bold text-rose-700">GAME OVER... 挑戰失敗！</h2>
        <p class="text-slate-800 text-xs sm:text-sm font-bold">先回到單字溫習進行默寫特訓再來挑戰吧！</p>
        <button @click="$emit('restart')" class="pixel-btn bg-rose-500 hover:bg-rose-400 text-white font-bold px-6 py-3 text-sm sm:text-base">
          重新挑戰 ➔
        </button>
      </div>
    </div>
  `
};
