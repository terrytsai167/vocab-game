// ==================== 8-Bit 像素風 UI 組件模組 ====================

// 1. 頂部勇者 RPG 狀態列
const ProfileBar = {
  name: 'ProfileBar',
  props: ['currentUser', 'users', 'todayWordCount', 'equippedGear', 'streakTitle', 'treasureStatus', 'doubleStarRemainingSec'],
  emits: ['switch-user', 'open-profile-modal', 'open-shop-modal', 'open-treasure-chest'],
  template: `
    <div class="pixel-box bg-[#1e293b] text-white px-3 sm:px-4 py-2.5 mb-3 flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2.5">
        <div class="pixel-box-sm bg-amber-300 text-slate-900 w-10 h-10 flex items-center justify-center text-2xl overflow-hidden shrink-0">
          <img v-if="currentUser.avatar && currentUser.avatar.startsWith('data:image')" 
               :src="currentUser.avatar" 
               class="w-full h-full object-cover" style="image-rendering: auto;">
          <span v-else>{{ currentUser.avatar || '🧙‍♂️' }}</span>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="font-bold text-sm sm:text-base tracking-wider text-amber-300">勇者 {{ currentUser.name }}</span>
            <span v-if="streakTitle"
                  :class="streakTitle.badgeClass"
                  class="border px-1.5 py-0.2 text-[10px] sm:text-xs font-extrabold shadow-[1px_1px_0px_#0f172a]">
              {{ streakTitle.icon }} {{ streakTitle.title }}
            </span>
            <span v-if="equippedGear && equippedGear.weapon" :title="equippedGear.weapon.name"
                  class="bg-slate-800 border border-amber-400/70 px-1.5 py-0.2 text-xs">
              {{ equippedGear.weapon.icon }}
            </span>
            <span v-if="equippedGear && equippedGear.shield && equippedGear.shield.id !== 'sh_none'" :title="equippedGear.shield.name"
                  class="bg-slate-800 border border-sky-400/70 px-1.5 py-0.2 text-xs">
              {{ equippedGear.shield.icon }}
            </span>
            <span v-if="equippedGear && equippedGear.pet" :title="'夥伴：' + equippedGear.pet.name"
                  class="bg-purple-900/90 border border-purple-300 px-1.5 py-0.2 text-xs flex items-center gap-1 animate-bounce">
              <span>{{ equippedGear.pet.icon }}</span>
              <span class="text-[10px] text-purple-200 hidden sm:inline">{{ equippedGear.pet.name }}</span>
            </span>
          </div>
          <div class="text-[11px] text-emerald-300 flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
            <span>📅 今日: <b class="text-amber-200">{{ todayWordCount }}/10</b> 字</span>
            <span>🔥 連勝: <b class="text-rose-300">{{ currentUser.streakDays || 0 }}</b> 天</span>
            <span v-if="doubleStarRemainingSec > 0"
                  class="bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 animate-pulse border border-white">
              ⚡ 雙倍星幣中 ({{ Math.floor(doubleStarRemainingSec / 60) }}:{{ String(doubleStarRemainingSec % 60).padStart(2, '0') }})
            </span>
            <button v-if="treasureStatus && treasureStatus.canClaim"
                    @click="$emit('open-treasure-chest')" type="button"
                    class="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-2 py-0.5 border border-white animate-bounce cursor-pointer">
              🎁 開啟今日勇者寶箱！
            </button>
            <span v-else-if="treasureStatus && treasureStatus.claimedToday"
                  class="text-amber-200/90 font-bold">
              🎁 今日寶箱已領
            </span>
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

        <button @click="$emit('open-shop-modal')" 
                type="button"
                class="pixel-btn bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-2.5 py-1.5 text-xs flex items-center gap-1">
          <span>🏪 裝備屋</span>
        </button>

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
        <button @click="$emit('set-mode', 'translate')" 
                :class="currentMode === 'translate' ? 'bg-purple-400 text-slate-950 -translate-y-0.5' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'"
                class="pixel-btn px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold">🌐 即時翻譯</button>
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
  props: ['bookList', 'selectedBookId', 'unitList', 'selectedUnit', 'totalWords', 'wrongWordsCount', 'savedWordsCount', 'currentMode', 'currentIndex', 'currentWordCount'],
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
            <option v-if="savedWordsCount > 0" value="SAVED_ONLY" class="text-amber-700 font-bold">⭐ 我的收藏本 (共 {{ savedWordsCount }} 字)</option>
            <option v-if="wrongWordsCount > 0" value="WRONG_ONLY" class="text-rose-600 font-bold">🔥 弱點特訓 (本冊錯題 {{ wrongWordsCount }} 字)</option>
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
  emits: ['close', 'save-user-settings', 'add-user', 'delete-user', 'start-weakness-training', 'clear-wrong-words', 'start-saved-training', 'add-saved-word', 'update-saved-word', 'remove-saved-word'],
  data() {
    return {
      editName: '',
      editAvatar: '🧙‍♂️',
      selectedBooks: [],
      newUserName: '',
      newUserAvatar: '🧝‍♀️',
      avatarList: ['🧙‍♂️', '🧝‍♀️', '🦸‍♂️', '🦸‍♀️', '🥷', '🧑‍🚀', '👸', '🤴', '🦁', '🦖'],
      // 收藏單字新增與編輯狀態
      showAddSavedForm: false,
      newSavedWord: '',
      newSavedPos: '',
      newSavedMeaning: '',
      newSavedGrammar: '',
      newSavedSentence: '',
      newSavedSentenceCn: '',
      editingSavedKey: null,
      editSavedDraft: {}
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
    },
    topWrongWords() {
      if (!this.currentUser || !this.currentUser.wrongWords) return [];
      return Object.entries(this.currentUser.wrongWords)
        .filter(([_, info]) => info && (info.count || 0) > 0)
        .map(([word, info]) => ({
          word,
          meaning: info.meaning || '',
          count: info.count || 1
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
    },
    totalWrongCount() {
      if (!this.currentUser || !this.currentUser.wrongWords) return 0;
      return Object.values(this.currentUser.wrongWords).filter(info => info && (info.count || 0) > 0).length;
    },
    savedWordList() {
      if (!this.currentUser || !Array.isArray(this.currentUser.savedWords)) return [];
      return this.currentUser.savedWords;
    },
    recentLogs() {
      if (!this.currentUser || !Array.isArray(this.currentUser.activityLogs)) return [];
      return this.currentUser.activityLogs.slice(0, 20);
    },
    last7DaysSummary() {
      const stats = (this.currentUser && this.currentUser.dailyStats) || {};
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;
        const label = `${Number(mm)}/${Number(dd)}`;
        const count = stats[key] ? (stats[key].count || 0) : 0;
        days.push({ key, label, count, isToday: i === 0 });
      }
      return days;
    },
    bossCatalogList() {
      const defeated = (this.currentUser && Array.isArray(this.currentUser.defeatedBosses))
        ? this.currentUser.defeatedBosses
        : [];
      return BOSS_CATALOG.map(b => ({
        ...b,
        isDefeated: defeated.includes(b.id)
      }));
    },
    streakMilestones() {
      const cur = (this.currentUser && this.currentUser.streakDays) || 0;
      return [
        { days: 3, title: '見習劍士', icon: '⚔️', unlocked: cur >= 3 },
        { days: 7, title: '單字騎士', icon: '🛡️', unlocked: cur >= 7 },
        { days: 14, title: '字島大賢者', icon: '👑', unlocked: cur >= 14 }
      ];
    }
  },
  methods: {
    async handleAvatarUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      try {
        if (typeof play8BitSfx === 'function') play8BitSfx('click');
        if (typeof compressAvatarImage === 'function') {
          this.editAvatar = await compressAvatarImage(file, 128);
        } else {
          this.editAvatar = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const img = new Image();
              img.onload = () => {
                const minSide = Math.min(img.width, img.height);
                const sx = (img.width - minSide) / 2;
                const sy = (img.height - minSide) / 2;
                const out = document.createElement('canvas');
                out.width = 128; out.height = 128;
                const ctx = out.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, 128, 128);
                resolve(out.toDataURL('image/jpeg', 0.82));
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
        alert('頭像上傳失敗：' + err.message);
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
    },
    submitNewSavedWord() {
      const w = this.newSavedWord.trim();
      const m = this.newSavedMeaning.trim();
      if (!w || !m) {
        alert('請至少填寫「英文單字」與「中文意思」喔！');
        return;
      }
      this.$emit('add-saved-word', {
        word: w,
        pos: this.newSavedPos.trim(),
        meaning: m,
        grammar_note: this.newSavedGrammar.trim(),
        sentence: this.newSavedSentence.trim() || `I can spell "${w}".`,
        sentence_cn: this.newSavedSentenceCn.trim() || `我會拼寫 ${w}。`
      });
      this.newSavedWord = '';
      this.newSavedPos = '';
      this.newSavedMeaning = '';
      this.newSavedGrammar = '';
      this.newSavedSentence = '';
      this.newSavedSentenceCn = '';
      this.showAddSavedForm = false;
    },
    startEditSaved(item) {
      this.editingSavedKey = item.word.toLowerCase();
      this.editSavedDraft = { ...item };
    },
    cancelEditSaved() {
      this.editingSavedKey = null;
      this.editSavedDraft = {};
    },
    saveEditedWord() {
      if (!this.editSavedDraft.word || !this.editSavedDraft.meaning) {
        alert('英文單字與中文意思不可空白！');
        return;
      }
      this.$emit('update-saved-word', {
        originalKey: this.editingSavedKey,
        updated: {
          ...this.editSavedDraft,
          word: this.editSavedDraft.word.trim(),
          meaning: this.editSavedDraft.meaning.trim(),
          pos: (this.editSavedDraft.pos || '').trim(),
          grammar_note: (this.editSavedDraft.grammar_note || '').trim(),
          sentence: (this.editSavedDraft.sentence || '').trim(),
          sentence_cn: (this.editSavedDraft.sentence_cn || '').trim()
        }
      });
      this.editingSavedKey = null;
      this.editSavedDraft = {};
    }
  },
  template: `
    <div v-if="show" class="fixed inset-0 bg-black/75 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-3">
      <div class="pixel-box bg-[#fffbeb] w-full max-w-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto text-slate-900 my-auto">
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
            <div class="text-xs font-bold text-slate-800">🔥 連續天數</div>
            <div class="text-lg font-bold text-slate-950 mt-1">{{ currentUser.streakDays || 0 }} 天</div>
          </div>
        </div>

        <!-- 📅 近 7 日練習字數一覽 -->
        <div class="pixel-box-sm mt-4 bg-sky-50/90 p-3 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs sm:text-sm font-bold text-slate-900">📅 近 7 日練習量（字數）</span>
            <span class="text-[11px] font-bold text-sky-800">斬龍戰績：{{ currentUser.bossVictories || 0 }} 勝</span>
          </div>
          <div class="grid grid-cols-7 gap-1.5 text-center">
            <div v-for="day in last7DaysSummary" :key="day.key"
                 :class="day.isToday ? 'bg-amber-200 border-slate-900' : 'bg-white border-slate-300'"
                 class="border-2 p-1.5">
              <div class="text-[10px] font-bold text-slate-600">{{ day.label }}</div>
              <div class="pixel-en text-xs sm:text-sm font-bold mt-1"
                   :class="day.count > 0 ? 'text-emerald-700' : 'text-slate-300'">
                {{ day.count }}
              </div>
            </div>
          </div>
        </div>

        <!-- 👾 怪物討伐圖鑑 & 🔥 連勝稱號里程碑 -->
        <div class="pixel-box-sm mt-4 bg-slate-900 text-white p-3.5 space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xs sm:text-sm font-bold text-amber-300">👾 怪物討伐圖鑑（依單元題數進化）</span>
            <span class="text-[11px] font-bold text-emerald-300">
              已討伐 {{ bossCatalogList.filter(b => b.isDefeated).length }}/{{ bossCatalogList.length }} 種
            </span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div v-for="b in bossCatalogList" :key="b.id"
                 :class="b.isDefeated ? 'bg-slate-800 border-amber-400' : 'bg-slate-800/50 border-slate-600 opacity-60'"
                 class="border-2 p-2 space-y-1">
              <div class="text-2xl">{{ b.isDefeated ? b.icon : '❓' }}</div>
              <div class="text-xs font-bold" :class="b.isDefeated ? 'text-amber-300' : 'text-slate-400'">
                {{ b.isDefeated ? b.name : '未討伐魔王' }}
              </div>
              <div class="text-[10px] text-slate-300 leading-tight">{{ b.tier }}</div>
              <div class="text-[10px] font-bold" :class="b.isDefeated ? 'text-emerald-400' : 'text-slate-500'">
                {{ b.isDefeated ? '✔️ 已收錄 (+' + b.reward + '★)' : '賞金 +' + b.reward + '★' }}
              </div>
            </div>
          </div>

          <!-- 連勝稱號進度 -->
          <div class="pt-2 border-t border-slate-700 flex flex-wrap items-center justify-between gap-2">
            <span class="text-[11px] font-bold text-rose-300">🔥 連勝稱號里程碑：</span>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="m in streakMilestones" :key="m.days"
                    :class="m.unlocked ? 'bg-amber-300 text-slate-950 border-white' : 'bg-slate-800 text-slate-400 border-slate-600'"
                    class="border px-2 py-0.5 text-[11px] font-bold">
                {{ m.icon }} {{ m.title }} ({{ m.days }}天){{ m.unlocked ? ' ✔️' : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 📋 近期練習狀況紀錄 (家長檢視小孩每次練習明細) -->
        <div class="pixel-box-sm mt-4 bg-white p-3.5 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs sm:text-sm font-bold text-slate-900">📋 近期練習狀況紀錄</span>
            <span class="text-[11px] font-bold text-slate-500">顯示最新 {{ recentLogs.length }} 筆</span>
          </div>

          <div v-if="recentLogs.length === 0" class="text-xs text-slate-500 font-bold py-3 text-center bg-slate-50 border-2 border-slate-200">
            尚無練習紀錄，開始溫習或挑戰後會自動記錄在這裡！
          </div>

          <div v-else class="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            <div v-for="(log, idx) in recentLogs" :key="idx"
                 class="flex items-center justify-between gap-2 bg-slate-50 border-2 border-slate-200 px-2.5 py-1.5 text-xs">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-slate-900 shrink-0">{{ log.mode }}</span>
                  <span class="text-slate-700 truncate font-bold">{{ log.detail }}</span>
                </div>
                <div class="text-[10px] text-slate-500 mt-0.5">{{ log.time }}<span v-if="log.bookName"> · {{ log.bookName }}</span></div>
              </div>
              <span :class="log.isSuccess ? 'bg-emerald-100 text-emerald-800 border-emerald-600' : 'bg-rose-100 text-rose-800 border-rose-500'"
                    class="border px-1.5 py-0.5 text-[11px] font-bold shrink-0">
                {{ log.result }}
              </span>
            </div>
          </div>
        </div>

        <!-- ⭐ 我的收藏單字本 (支援自訂新增、隨時編修與一鍵練習) -->
        <div class="pixel-box-sm mt-4 bg-amber-50 p-3.5 space-y-2.5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-1.5">
              <span class="text-base">⭐</span>
              <span class="text-xs sm:text-sm font-bold text-amber-950">我的收藏單字本 (共 {{ savedWordList.length }} 字)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button @click="showAddSavedForm = !showAddSavedForm" type="button"
                      class="pixel-btn bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold px-2.5 py-1 text-xs">
                {{ showAddSavedForm ? '收合表單' : '+ 自訂新單字' }}
              </button>
              <button v-if="savedWordList.length > 0"
                      @click="$emit('start-saved-training'); $emit('close')" type="button"
                      class="pixel-btn bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 text-xs">
                📖 練習收藏本
              </button>
            </div>
          </div>

          <!-- 手動新增自訂收藏單字表單 -->
          <div v-if="showAddSavedForm" class="bg-white border-2 border-slate-800 p-3 space-y-2 text-xs">
            <div class="font-bold text-slate-800">✍️ 新增自訂收藏單字：</div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input v-model="newSavedWord" type="text" placeholder="英文單字 * (如: library)"
                     class="pixel-input bg-amber-50/60 px-2.5 py-1.5 font-bold text-slate-900">
              <input v-model="newSavedPos" type="text" placeholder="詞性 (如: 名詞 (n.))"
                     class="pixel-input bg-amber-50/60 px-2.5 py-1.5 font-bold text-slate-900">
              <input v-model="newSavedMeaning" type="text" placeholder="中文意思 * (如: 圖書館)"
                     class="pixel-input bg-amber-50/60 px-2.5 py-1.5 font-bold text-slate-900">
            </div>
            <input v-model="newSavedGrammar" type="text" placeholder="補充筆記 / 動詞三態 (選填)"
                   class="pixel-input w-full bg-amber-50/60 px-2.5 py-1.5 font-bold text-slate-900">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input v-model="newSavedSentence" type="text" placeholder="英文例句 (選填，留空自動產生)"
                     class="pixel-input bg-amber-50/60 px-2.5 py-1.5 font-bold text-slate-900">
              <input v-model="newSavedSentenceCn" type="text" placeholder="例句中文翻譯 (選填)"
                     class="pixel-input bg-amber-50/60 px-2.5 py-1.5 font-bold text-slate-900">
            </div>
            <button @click="submitNewSavedWord" type="button"
                    class="pixel-btn w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-2 text-xs">
              ✅ 加入收藏單字本
            </button>
          </div>

          <div v-if="savedWordList.length === 0 && !showAddSavedForm" class="text-xs text-slate-600 font-bold py-2 text-center bg-white/80 border-2 border-slate-200">
            點擊單字卡右上角「☆ 收藏」或上方「+ 自訂新單字」，即可建立專屬收藏本並隨時編修！
          </div>

          <!-- 收藏單字清單（支援逐筆展開編修釋義、詞性、三態筆記與例句） -->
          <div v-else-if="savedWordList.length > 0" class="space-y-2 max-h-56 overflow-y-auto pr-1">
            <div v-for="item in savedWordList" :key="item.word"
                 class="bg-white border-2 border-slate-800 p-2.5 text-xs">
              
              <!-- 檢視模式 -->
              <div v-if="editingSavedKey !== item.word.toLowerCase()" class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1 space-y-0.5">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span class="font-extrabold text-slate-950 clear-word-font text-sm sm:text-base">{{ item.word }}</span>
                    <span v-if="item.pos" class="bg-amber-200 border border-slate-700 px-1.5 py-0.2 text-[10px] font-bold">{{ item.pos }}</span>
                    <span class="font-bold text-emerald-700">{{ item.meaning }}</span>
                  </div>
                  <div v-if="item.grammar_note && item.grammar_note !== '-'" class="text-[11px] text-amber-800 font-bold">
                    📘 {{ item.grammar_note }}
                  </div>
                  <div v-if="item.sentence" class="text-[11px] text-slate-600 truncate">
                    “ {{ item.sentence }} ”
                  </div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <button @click="startEditSaved(item)" type="button"
                          class="pixel-btn bg-sky-200 hover:bg-sky-300 text-slate-900 font-bold px-2 py-1 text-[11px]">
                    ✏️ 編修
                  </button>
                  <button @click="$emit('remove-saved-word', item.word)" type="button"
                          class="pixel-btn bg-rose-200 hover:bg-rose-300 text-rose-900 font-bold px-2 py-1 text-[11px]">
                    🗑️
                  </button>
                </div>
              </div>

              <!-- 編修模式 -->
              <div v-else class="space-y-2 bg-sky-50/70 p-2 border border-sky-300">
                <div class="font-bold text-sky-900">✏️ 編修單字內容：</div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  <input v-model="editSavedDraft.word" type="text" placeholder="英文單字"
                         class="pixel-input bg-white px-2 py-1 font-bold text-slate-900">
                  <input v-model="editSavedDraft.pos" type="text" placeholder="詞性 (如: 動詞 (v.))"
                         class="pixel-input bg-white px-2 py-1 font-bold text-slate-900">
                  <input v-model="editSavedDraft.meaning" type="text" placeholder="中文意思"
                         class="pixel-input bg-white px-2 py-1 font-bold text-slate-900">
                </div>
                <input v-model="editSavedDraft.grammar_note" type="text" placeholder="補充筆記 / 動詞三態"
                       class="pixel-input w-full bg-white px-2 py-1 font-bold text-slate-900">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <input v-model="editSavedDraft.sentence" type="text" placeholder="英文例句"
                         class="pixel-input bg-white px-2 py-1 font-bold text-slate-900">
                  <input v-model="editSavedDraft.sentence_cn" type="text" placeholder="例句中文翻譯"
                         class="pixel-input bg-white px-2 py-1 font-bold text-slate-900">
                </div>
                <div class="flex justify-end gap-1.5 pt-1">
                  <button @click="cancelEditSaved" type="button"
                          class="pixel-btn bg-slate-200 text-slate-800 font-bold px-2.5 py-1 text-[11px]">
                    取消
                  </button>
                  <button @click="saveEditedWord" type="button"
                          class="pixel-btn bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-3 py-1 text-[11px]">
                    💾 儲存修改
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- 🔥 魔王級錯題排行榜 (家長弱點追蹤面板) -->
        <div class="pixel-box-sm mt-4 bg-rose-50 p-3.5 space-y-2.5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-1.5">
              <span class="text-base">🔥</span>
              <span class="text-xs sm:text-sm font-bold text-rose-900">弱點單字排行榜 (共 {{ totalWrongCount }} 字待加強)</span>
            </div>
            <div class="flex items-center gap-1.5" v-if="totalWrongCount > 0">
              <button @click="$emit('start-weakness-training'); $emit('close')" type="button"
                      class="pixel-btn bg-rose-500 hover:bg-rose-400 text-white font-bold px-2.5 py-1 text-xs">
                ⚔️ 立即弱點特訓
              </button>
              <button @click="$emit('clear-wrong-words')" type="button"
                      class="pixel-btn bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-2 py-1 text-xs">
                清空
              </button>
            </div>
          </div>

          <div v-if="topWrongWords.length === 0" class="text-xs text-slate-600 font-bold py-2 text-center bg-white/80 border-2 border-slate-200">
            ✨ 太棒了！目前沒有累積錯題，繼續保持！
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
            <div v-for="(item, idx) in topWrongWords" :key="item.word"
                 class="flex items-center justify-between bg-white border-2 border-slate-800 px-2.5 py-1.5 text-xs">
              <div class="truncate pr-2">
                <span class="font-extrabold text-slate-950 clear-word-font text-sm">{{ idx + 1 }}. {{ item.word }}</span>
                <span v-if="item.meaning" class="text-slate-600 font-bold ml-1.5">({{ item.meaning }})</span>
              </div>
              <span class="bg-rose-500 text-white font-bold px-1.5 py-0.5 text-[11px] shrink-0">
                錯 {{ item.count }} 次
              </span>
            </div>
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
              <img v-if="editAvatar && editAvatar.startsWith('data:image')" :src="editAvatar" class="w-full h-full object-cover" style="image-rendering: auto;">
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
  props: ['show', 'word', 'currentIndex', 'totalWords'],
  emits: ['close', 'speak', 'practice-complete', 'practice-error', 'next-word'],
  setup(props, { emit }) {
    const { ref, computed, watch, nextTick } = Vue;
    const targetCount = ref(3);
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
      const isLandscape = window.innerWidth > window.innerHeight;
      canvas.height = isLandscape ? 145 : 230;

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

    const resetPracticeState = (count = 3) => {
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
        resetPracticeState(targetCount.value || 3);
        if (props.word) emit('speak', props.word.word);
      }
    });

    watch(() => props.word, (newVal, oldVal) => {
      if (props.show && newVal && (!oldVal || newVal.word !== oldVal.word)) {
        resetPracticeState(targetCount.value || 3);
        emit('speak', newVal.word);
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
        emit('practice-error', props.word);
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
    <div v-if="show && word" class="fixed inset-0 bg-black/75 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-2 sm:p-4">
      <div class="pixel-box bg-[#fffbeb] w-full max-w-3xl p-4 sm:p-6 max-h-[94vh] overflow-y-auto text-slate-900 my-auto"
           :class="{ 'shake-anim': isShaking }">
        
        <div class="flex items-center justify-between pb-2.5 border-b-4 border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-xl">✍️</span>
            <h2 class="text-lg font-bold">勇者道場：默寫特訓</h2>
            <span v-if="totalWords > 0" class="pixel-en text-[11px] bg-slate-800 text-amber-300 px-2 py-0.5">
              {{ (currentIndex || 0) + 1 }}/{{ totalWords }}
            </span>
          </div>
          <button @click="$emit('close')" class="pixel-btn bg-rose-500 text-white px-2.5 py-1 text-xs font-bold">✕</button>
        </div>

        <div class="pixel-box-sm mt-3 flex flex-wrap items-center justify-between gap-2 bg-[#f3e5ab] p-2.5">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold">次數:</span>
            <button v-for="c in [3, 5]" :key="c"
                    @click="setTargetCount(c)"
                    :class="targetCount === c ? 'bg-emerald-500 text-white -translate-y-0.5' : 'bg-white text-slate-800'"
                    class="pixel-btn px-3.5 py-1.5 text-xs sm:text-sm font-bold">
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
            <span v-if="currentRep <= (targetCount === 3 ? 1 : 2) && !isFinished" class="clear-word-font inline-block bg-amber-100 border-2 border-slate-800 px-4 py-1 font-extrabold text-xl sm:text-2xl text-blue-900">
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
                      class="clear-word-font text-2xl sm:text-3xl font-extrabold">
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
            <canvas ref="hwCanvas" class="handwriting-canvas bg-white border-2 border-slate-800 cursor-crosshair" height="240"></canvas>
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
          <div class="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button @click="$emit('next-word')" type="button"
                    class="pixel-btn flex-[1.5] bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 text-sm sm:text-base">
              ⏭️ 練習下一個單字
            </button>
            <button @click="resetPracticeState(targetCount)" type="button"
                    class="pixel-btn flex-1 bg-sky-200 hover:bg-sky-300 text-slate-950 font-bold py-2.5 text-xs sm:text-sm">
              🔄 再練一輪
            </button>
            <button @click="$emit('close')" type="button"
                    class="pixel-btn flex-1 bg-slate-200 hover:bg-slate-300 text-slate-950 font-bold py-2.5 text-xs sm:text-sm">
              回到溫習
            </button>
          </div>
        </div>

      </div>
    </div>
  `
};

// 6. 單字溫習組件 (8-Bit 羊皮紙主視窗，含詞性徽章與動詞三態/形態變化補充)
const StudyMode = {
  name: 'StudyMode',
  props: ['word', 'currentRate', 'isListening', 'feedback', 'feedbackColor', 'wrongCount', 'isFavorited'],
  emits: ['set-rate', 'speak', 'voice-challenge', 'open-practice', 'toggle-favorite', 'prev', 'next'],
  methods: {
    getPosBadgeStyle(pos) {
      if (!pos) return 'bg-slate-200 text-slate-900';
      const p = String(pos).toLowerCase();
      if (p.includes('動詞') || p.includes('v.')) return 'bg-rose-300 text-slate-950';
      if (p.includes('形容詞') || p.includes('adj')) return 'bg-sky-300 text-slate-950';
      if (p.includes('副詞') || p.includes('adv')) return 'bg-purple-300 text-slate-950';
      if (p.includes('名詞') || p.includes('n.')) return 'bg-amber-300 text-slate-950';
      return 'bg-emerald-300 text-slate-950';
    }
  },
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
        <div class="pixel-box-sm bg-white p-4 sm:p-6 landscape-compact-card relative">
          <!-- 右上角收藏按鈕 -->
          <button @click="$emit('toggle-favorite', word)" 
                  type="button"
                  :title="isFavorited ? '取消收藏' : '加入單字收藏本'"
                  :class="isFavorited ? 'bg-amber-300 text-rose-600' : 'bg-slate-100 text-slate-500 hover:bg-amber-100'"
                  class="pixel-btn absolute top-2.5 right-2.5 px-2.5 py-1 text-xs sm:text-sm font-bold flex items-center gap-1">
            <span>{{ isFavorited ? '⭐ 已收藏' : '☆ 收藏' }}</span>
          </button>

          <!-- 詞性徽章 & 弱點警告標籤 -->
          <div v-if="word.pos || word.part_of_speech || word['詞性'] || wrongCount > 0" class="mb-2 flex flex-wrap items-center justify-center gap-2">
            <span v-if="word.pos || word.part_of_speech || word['詞性']"
                  :class="getPosBadgeStyle(word.pos || word.part_of_speech || word['詞性'])" 
                  class="inline-block border-2 border-slate-900 px-2.5 py-0.5 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_#0f172a]">
              🏷️ {{ word.pos || word.part_of_speech || word['詞性'] }}
            </span>
            <span v-if="wrongCount > 0"
                  class="inline-block bg-rose-500 text-white border-2 border-slate-900 px-2.5 py-0.5 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_#0f172a]">
              🔥 弱點字 (曾錯 {{ wrongCount }} 次)
            </span>
          </div>

          <div class="flex items-center justify-center gap-3 px-2">
            <h1 :class="word.word.length > 14 ? 'text-3xl sm:text-5xl' : 'text-4xl sm:text-6xl'"
                class="clear-word-font font-extrabold text-slate-950 break-words leading-tight">
              {{ word.word }}
            </h1>
            <button @click="$emit('speak', word.word)" class="pixel-btn bg-sky-400 hover:bg-sky-300 text-slate-950 p-2.5 text-lg shrink-0">🔊</button>
          </div>

          <p class="text-xl sm:text-2xl font-bold text-emerald-700 mt-3">{{ word.meaning }}</p>

          <!-- 動詞三態 / 形容詞比較級 / 複數 補充資訊卡 -->
          <div v-if="word.grammar_note || word.tense || word['變化補充'] || word['三態']" 
               class="mt-3 inline-block bg-amber-100/95 border-2 border-slate-800 px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-900">
            <span>📘 變化補充：{{ word.grammar_note || word.tense || word['變化補充'] || word['三態'] }}</span>
          </div>
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

        <div class="grid grid-cols-2 gap-2.5 sm:gap-3">
          <button @click="$emit('prev')" class="pixel-btn bg-slate-200 hover:bg-slate-300 py-3.5 font-bold text-base sm:text-lg text-slate-900">
            ⬅️ 上一題
          </button>
          <button @click="$emit('next')" class="pixel-btn bg-amber-400 hover:bg-amber-300 py-3.5 font-bold text-base sm:text-lg text-slate-950">
            下一題 ➔
          </button>
        </div>
      </div>
    </div>
  `
};

// 7. 聽力試煉組件
const ListenTrial = {
  name: 'ListenTrial',
  props: ['word', 'trialIndex', 'totalTrials', 'combo', 'feedback', 'feedbackColor'],
  emits: ['speak', 'check'],
  template: `
    <div>
      <div class="text-center mb-4">
        <span class="bg-sky-400 text-slate-950 border-2 border-slate-900 text-xs font-bold px-3 py-1">關卡：聽力盲測</span>
        <h2 class="text-lg sm:text-xl font-bold text-slate-900 mt-2">選出發音對應的中文意思！</h2>
        <div class="flex items-center justify-center gap-2 mt-1">
          <p class="pixel-en text-xs text-slate-600">{{ trialIndex + 1 }}/{{ totalTrials }}</p>
          <span v-if="combo >= 2" :key="combo"
                class="combo-pop-anim pixel-en bg-amber-400 text-slate-950 border-2 border-slate-900 px-2.5 py-0.5 text-xs font-bold shadow-[2px_2px_0px_#0f172a]">
            🔥 {{ combo }} COMBO!
          </span>
        </div>
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
  props: ['word', 'trialIndex', 'totalTrials', 'combo', 'spelledLetters', 'scrambledPool', 'feedback', 'feedbackColor'],
  emits: ['speak', 'pick-letter', 'remove-letter', 'reset', 'check'],
  template: `
    <div>
      <div class="text-center mb-4">
        <span class="bg-emerald-400 text-slate-950 border-2 border-slate-900 text-xs font-bold px-3 py-1">關卡：拼字積木</span>
        <h2 class="text-lg sm:text-xl font-bold text-slate-900 mt-2">拼出正確英文單字！</h2>
        <div class="flex items-center justify-center gap-2 mt-1">
          <p class="pixel-en text-xs text-slate-600">{{ trialIndex + 1 }}/{{ totalTrials }}</p>
          <span v-if="combo >= 2" :key="combo"
                class="combo-pop-anim pixel-en bg-amber-400 text-slate-950 border-2 border-slate-900 px-2.5 py-0.5 text-xs font-bold shadow-[2px_2px_0px_#0f172a]">
            ⚡ {{ combo }} COMBO!
          </span>
        </div>
      </div>
      <div v-if="word" class="space-y-4 text-center">
        <div class="pixel-box-sm bg-emerald-100 p-3.5 flex justify-between items-center px-4">
          <span class="text-lg sm:text-xl font-bold text-slate-950">{{ word.meaning }}</span>
          <button @click="$emit('speak', word.word)" class="pixel-btn bg-emerald-500 text-slate-950 px-2.5 py-1.5 text-xs font-bold">🔊 提示</button>
        </div>
        <div class="pixel-box-sm flex flex-wrap justify-center gap-1.5 min-h-[50px] p-2 bg-slate-200">
          <span v-for="(letter, i) in spelledLetters" :key="i" @click="$emit('remove-letter', i)"
                class="clear-word-font w-11 h-11 bg-white text-slate-950 border-2 border-slate-900 font-extrabold text-xl flex items-center justify-center cursor-pointer">
            {{ letter === ' ' ? '␣' : letter }}
          </span>
        </div>
        <div class="flex flex-wrap justify-center gap-1.5 pt-1">
          <button v-for="(item, idx) in scrambledPool" :key="idx" :disabled="item.used" @click="$emit('pick-letter', item)"
                  :class="item.used ? 'opacity-25 cursor-not-allowed bg-slate-300' : 'pixel-btn bg-amber-300 hover:bg-amber-200 text-slate-950'"
                  class="clear-word-font w-11 h-11 font-extrabold text-xl flex items-center justify-center">
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
    'gameState', 'bossInfo', 'bossHp', 'playerHp', 'timer', 'maxTimer', 'equippedGear', 'combo', 'isCritHit', 'isWritingActive', 'question',
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
      <!-- 8-Bit 戰鬥血條面板 (含殘血 <30% 狂暴紅色閃爍狀態) -->
      <div class="pixel-box-sm space-y-2 mb-3 bg-slate-900 text-white p-3 transition-all"
           :class="bossHp > 0 && bossHp < 30 && gameState === 'playing' ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.85)]' : ''">
        <div>
          <div class="flex flex-wrap justify-between items-center gap-1 text-xs font-bold mb-1"
               :class="bossHp > 0 && bossHp < 30 ? 'text-rose-300' : 'text-rose-400'">
            <div class="flex items-center gap-1.5">
              <span class="text-base">{{ bossInfo ? bossInfo.icon : '🐉' }}</span>
              <span>{{ bossInfo ? bossInfo.name : '暗黑單字巨龍' }}</span>
              <span v-if="bossInfo" class="bg-slate-800 border border-slate-600 text-amber-300 px-1.5 py-0.2 text-[10px]">
                {{ bossInfo.tier }} · 賞金 +{{ bossInfo.reward }}★
              </span>
            </div>
            <span class="pixel-en">{{ bossHp }}/100</span>
          </div>
          <div class="w-full bg-slate-700 h-4 p-0.5 border-2 transition-all"
               :class="bossHp > 0 && bossHp < 30 && gameState === 'playing' ? 'border-rose-500 animate-pulse bg-rose-950' : 'border-white'">
            <div :class="[bossInfo ? bossInfo.hpColor : 'bg-rose-500', bossHp > 0 && bossHp < 30 ? 'bg-rose-500 animate-pulse' : '']"
                 class="h-full transition-all duration-300"
                 :style="{ width: bossHp + '%' }"></div>
          </div>
          <!-- 殘血狂暴警告演出 -->
          <div v-if="bossHp > 0 && bossHp < 30 && gameState === 'playing'"
               class="mt-1.5 bg-rose-600/90 border border-rose-300 text-white text-[11px] sm:text-xs font-extrabold px-2.5 py-1 text-center animate-pulse">
            ⚠️ {{ bossInfo ? bossInfo.name : '巨龍' }}進入狂暴狀態！攻擊力提升，快給予最後一擊！
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
                 :style="{ width: Math.min(100, (timer / (maxTimer || 45)) * 100) + '%' }"></div>
          </div>
          <!-- 目前出戰裝備與夥伴加成提示 -->
          <div v-if="equippedGear" class="flex flex-wrap items-center gap-2 pt-1.5 text-[11px] text-sky-200 font-bold">
            <span class="bg-slate-800 border border-slate-600 px-2 py-0.5">
              {{ equippedGear.weapon.icon }} {{ equippedGear.weapon.name }} (攻擊 {{ equippedGear.weapon.atkMultiplier }}x)
            </span>
            <span v-if="equippedGear.shield.id !== 'sh_none'" class="bg-slate-800 border border-slate-600 px-2 py-0.5">
              {{ equippedGear.shield.icon }} {{ equippedGear.shield.name }} (減傷 {{ Math.round(equippedGear.shield.dmgReduction * 100) }}%)
            </span>
            <span v-if="equippedGear.pet" class="bg-purple-950 border border-purple-400 px-2 py-0.5 text-purple-200">
              {{ equippedGear.pet.icon }} {{ equippedGear.pet.name }} (勝利 +{{ equippedGear.pet.bonusStar }}★)
            </span>
          </div>
        </div>
      </div>

      <!-- 戰鬥進行中 -->
      <div v-if="gameState === 'playing' && question"
           class="space-y-3 transition-all"
           :class="[{ 'shake-anim': isShaking }, { 'crit-flash-anim': isCritHit }]">
        <div class="pixel-box-sm p-3.5 text-center relative"
             :class="isCritHit ? 'bg-amber-50 border-amber-500' : 'bg-white'">
          <div class="flex flex-wrap justify-between items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1">
            <div class="flex items-center gap-2">
              <span class="pixel-en">STAGE {{ questionIndex + 1 }}/{{ totalQuestions }}</span>
              <span v-if="combo >= 2" :key="combo"
                    class="combo-pop-anim pixel-en bg-amber-400 text-slate-950 border-2 border-slate-900 px-2 py-0.5 text-[11px] font-bold">
                🔥 {{ combo }} COMBO!
              </span>
            </div>
            <span class="bg-slate-800 text-amber-300 px-2 py-0.5">
              {{ isTouchDevice ? '📱 手寫板' : '💻 鍵盤' }}
            </span>
          </div>

          <!-- 會心一擊特效橫幅 -->
          <div v-if="isCritHit"
               class="combo-pop-anim my-1.5 inline-block bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-2 border-slate-950 px-3.5 py-1 text-xs sm:text-sm font-extrabold text-rose-700 shadow-[3px_3px_0px_#0f172a]">
            💥 CRITICAL HIT! 會心一擊 1.5x 暴擊傷害！
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
                    class="clear-word-font text-2xl sm:text-3xl font-extrabold">
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
        <div class="text-5xl animate-bounce">👑 {{ bossInfo ? bossInfo.icon : '🐉' }} 🏆</div>
        <h2 class="text-xl sm:text-2xl font-bold text-amber-700">VICTORY! 「{{ bossInfo ? bossInfo.name : '暗黑單字巨龍' }}」被擊敗了！</h2>
        <p class="text-slate-800 text-xs sm:text-sm font-bold">成功斬殺魔王並收錄進怪物圖鑑，獲得基礎賞金 +{{ bossInfo ? bossInfo.reward : 10 }} ★ 星幣！</p>
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


// 10. 即時翻譯與 AI 文法/例句生成器組件 (支援一鍵收藏至我的收藏本)
const TranslateTool = {
  name: 'TranslateTool',
  props: ['savedWords', 'treasureTask'],
  emits: ['speak', 'toggle-favorite', 'set-treasure-task', 'complete-treasure-task', 'clear-treasure-task'],
  setup(props, { emit }) {
    const { ref, computed } = Vue;
    const inputText = ref('');
    const isLoading = ref(false);
    const errorMsg = ref('');
    const result = ref(null);
    const recentHistory = ref([]);
    const showTaskForm = ref(false);
    const taskClueInput = ref('');
    const taskRewardInput = ref(10);
    const taskJustCompleted = ref(false);

    const presetClues = [
      { clue: '會隨著環境變色的爬蟲類「變色龍」', reward: 10 },
      { clue: '遊樂園裡最刺激的「雲霄飛車」', reward: 10 },
      { clue: '太空人搭乘前往宇宙的「太空梭」', reward: 12 },
      { clue: '保護地球免受紫外線傷害的「臭氧層」', reward: 15 }
    ];

    const createTreasureTask = () => {
      const c = taskClueInput.value.trim();
      if (!c) return;
      if (typeof play8BitSfx === 'function') play8BitSfx('coin');
      emit('set-treasure-task', {
        clue: c,
        reward: Number(taskRewardInput.value) || 10,
        createdAt: Date.now()
      });
      taskClueInput.value = '';
      showTaskForm.value = false;
      taskJustCompleted.value = false;
    };

    const pickPresetClue = (item) => {
      taskClueInput.value = item.clue;
      taskRewardInput.value = item.reward;
    };

    const isFavorited = computed(() => {
      if (!result.value || !result.value.word || !Array.isArray(props.savedWords)) return false;
      const key = String(result.value.word).trim().toLowerCase();
      return props.savedWords.some(item => String(item.word || '').trim().toLowerCase() === key);
    });

    const handleTranslate = async () => {
      const q = inputText.value.trim();
      if (!q || isLoading.value) return;
      if (typeof play8BitSfx === 'function') play8BitSfx('click');

      isLoading.value = true;
      errorMsg.value = '';

      try {
        const data = await translateAndAnalyzeText(q);
        result.value = data;
        if (typeof play8BitSfx === 'function') play8BitSfx('coin');

        // 保留最近 6 筆查詢紀錄方便快速回點
        const existsIdx = recentHistory.value.findIndex(
          h => h.word && data.word && h.word.toLowerCase() === data.word.toLowerCase()
        );
        if (existsIdx > -1) recentHistory.value.splice(existsIdx, 1);
        recentHistory.value.unshift(data);
        if (recentHistory.value.length > 6) recentHistory.value.pop();
      } catch (err) {
        if (typeof play8BitSfx === 'function') play8BitSfx('hit');
        errorMsg.value = err.message || '翻譯失敗，請確認 Apps Script 已更新並重新部署！';
      } finally {
        isLoading.value = false;
      }
    };

    const clearInput = () => {
      if (typeof play8BitSfx === 'function') play8BitSfx('click');
      inputText.value = '';
      errorMsg.value = '';
    };

    const handleSaveToggle = () => {
      if (!result.value) return;
      const wasFavorited = isFavorited.value;
      emit('toggle-favorite', {
        word: result.value.word,
        pos: result.value.pos || '',
        meaning: result.value.meaning || '',
        grammar_note: result.value.grammar_note || '',
        sentence: result.value.sentence || '',
        sentence_cn: result.value.sentence_cn || ''
      });
      // 若目前有進行中的「單字尋寶任務」，且剛完成查詢＋加入收藏，自動完成尋寶並領取懸賞星幣！
      if (!wasFavorited && props.treasureTask && !props.treasureTask.completed) {
        taskJustCompleted.value = true;
        emit('complete-treasure-task', result.value.word);
      }
    };

    const selectHistoryItem = (item) => {
      if (typeof play8BitSfx === 'function') play8BitSfx('click');
      result.value = item;
      inputText.value = item.word || '';
      errorMsg.value = '';
    };

    const getPosBadgeStyle = (pos) => {
      if (!pos) return 'bg-slate-200 text-slate-900';
      const p = String(pos).toLowerCase();
      if (p.includes('動詞') || p.includes('v.')) return 'bg-rose-300 text-slate-950';
      if (p.includes('形容詞') || p.includes('adj')) return 'bg-sky-300 text-slate-950';
      if (p.includes('副詞') || p.includes('adv')) return 'bg-purple-300 text-slate-950';
      if (p.includes('名詞') || p.includes('n.')) return 'bg-amber-300 text-slate-950';
      return 'bg-emerald-300 text-slate-950';
    };

    return {
      inputText, isLoading, errorMsg, result, recentHistory,
      showTaskForm, taskClueInput, taskRewardInput, taskJustCompleted,
      presetClues, createTreasureTask, pickPresetClue,
      isFavorited, handleTranslate, clearInput, handleSaveToggle,
      selectHistoryItem, getPosBadgeStyle
    };
  },
  template: `
    <div class="space-y-4">
      <!-- 頂部說明橫幅與家長出題按鈕 -->
      <div class="pixel-box-sm bg-purple-100 p-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="text-xl">🌐</span>
          <div>
            <h2 class="text-sm sm:text-base font-bold text-purple-950">AI 即時翻譯與文法魔法書</h2>
            <p class="text-xs text-purple-800 font-bold">輸入英文或中文自動產生翻譯、例句與文法解析，查完一鍵收進收藏本！</p>
          </div>
        </div>
        <button @click="showTaskForm = !showTaskForm" type="button"
                class="pixel-btn bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 text-xs flex items-center gap-1">
          <span>🗺️ {{ showTaskForm ? '收合出題' : '家長出尋寶謎題' }}</span>
        </button>
      </div>

      <!-- 🗺️ 單字尋寶任務面板 -->
      <div v-if="showTaskForm" class="pixel-box-sm bg-amber-50 p-3.5 space-y-2.5 text-xs">
        <div class="font-bold text-amber-950">🧭 設定今日單字尋寶謎題（孩子查出英文並點擊「☆ 收藏單字」即可領獎）：</div>
        <div class="flex flex-wrap gap-1.5">
          <button v-for="(p, i) in presetClues" :key="i" @click="pickPresetClue(p)" type="button"
                  class="bg-white hover:bg-amber-200 border border-slate-700 px-2 py-1 font-bold text-slate-800">
            💡 {{ p.clue }} (+{{ p.reward }}★)
          </button>
        </div>
        <div class="flex flex-col sm:flex-row gap-2">
          <input v-model="taskClueInput" type="text" placeholder="輸入尋寶謎題線索，如：去查查看『變色龍』的英文！"
                 class="pixel-input flex-1 bg-white px-3 py-1.5 font-bold text-slate-900">
          <select v-model="taskRewardInput" class="pixel-select bg-white px-2.5 py-1.5 font-bold text-slate-900">
            <option :value="5">賞金 +5 ★</option>
            <option :value="10">賞金 +10 ★</option>
            <option :value="15">賞金 +15 ★</option>
            <option :value="20">賞金 +20 ★</option>
          </select>
          <button @click="createTreasureTask" type="button"
                  class="pixel-btn bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-4 py-1.5">
            發布任務
          </button>
        </div>
      </div>

      <!-- 目前進行中的尋寶任務懸賞令 -->
      <div v-if="treasureTask" class="pixel-box-sm bg-gradient-to-r from-amber-200 to-yellow-100 p-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-start gap-2.5">
          <span class="text-2xl">{{ treasureTask.completed ? '🏆' : '🗺️' }}</span>
          <div>
            <div class="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
              <span>{{ treasureTask.completed ? '🎉 尋寶任務達成！' : '🔥 單字尋寶懸賞令進行中：' }}</span>
              <span class="bg-rose-500 text-white px-1.5 py-0.2 text-[10px]">賞金 +{{ treasureTask.reward }} ★</span>
            </div>
            <p class="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
              謎題：「{{ treasureTask.clue }}」
              <span v-if="!treasureTask.completed" class="text-purple-800">（查出單字後點擊右上角「☆ 收藏單字」完成任務！）</span>
              <span v-else class="text-emerald-700">（已成功尋獲寶藏單字：{{ treasureTask.foundWord }}！）</span>
            </p>
          </div>
        </div>
        <button @click="$emit('clear-treasure-task')" type="button"
                class="pixel-btn bg-white hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 text-xs">
          清除
        </button>
      </div>

      <!-- 輸入與查詢區 -->
      <div class="pixel-box-sm bg-white p-3.5 sm:p-4 space-y-2.5">
        <div class="flex flex-col sm:flex-row gap-2">
          <input v-model="inputText"
                 @keyup.enter="handleTranslate"
                 type="text"
                 placeholder="輸入英文或中文，例如：encourage、library 或 堅持不懈..."
                 class="pixel-input clear-word-font flex-1 bg-amber-50/60 px-3.5 py-2.5 text-base sm:text-lg font-bold text-slate-950">
          <div class="flex gap-2 shrink-0">
            <button v-if="inputText" @click="clearInput" type="button"
                    class="pixel-btn bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-2 text-xs sm:text-sm">
              清空
            </button>
            <button @click="handleTranslate" :disabled="isLoading || !inputText.trim()" type="button"
                    :class="isLoading ? 'bg-purple-300 cursor-wait' : 'bg-purple-400 hover:bg-purple-300'"
                    class="pixel-btn flex-1 sm:flex-none text-slate-950 font-bold px-5 py-2.5 text-sm sm:text-base flex items-center justify-center gap-1.5">
              <span>{{ isLoading ? '⏳ 解析中...' : '✨ 翻譯與解析' }}</span>
            </button>
          </div>
        </div>

        <!-- 最近查詢快速標籤 -->
        <div v-if="recentHistory.length > 0" class="flex flex-wrap items-center gap-1.5 pt-1">
          <span class="text-[11px] font-bold text-slate-500">最近查詢：</span>
          <button v-for="(h, idx) in recentHistory" :key="idx"
                  @click="selectHistoryItem(h)" type="button"
                  class="bg-slate-100 hover:bg-purple-100 border border-slate-400 px-2 py-0.5 text-xs font-bold text-slate-800 clear-word-font">
            {{ h.word }}
          </button>
        </div>

        <div v-if="errorMsg" class="bg-rose-100 border-2 border-rose-600 text-rose-800 px-3 py-2 text-xs sm:text-sm font-bold">
          ⚠️ {{ errorMsg }}
        </div>
      </div>

      <!-- AI 生成結果卡片 -->
      <div v-if="result" class="space-y-3">
        <!-- 主單字 / 翻譯結果與收藏按鈕 -->
        <div class="pixel-box-sm bg-white p-4 sm:p-6 relative text-center">
          <button @click="handleSaveToggle"
                  type="button"
                  :class="isFavorited ? 'bg-amber-300 text-rose-600' : 'bg-slate-100 text-slate-700 hover:bg-amber-200'"
                  class="pixel-btn absolute top-3 right-3 px-3 py-1.5 text-xs sm:text-sm font-bold flex items-center gap-1">
            <span>{{ isFavorited ? '⭐ 已收藏' : '☆ 收藏單字' }}</span>
          </button>

          <div v-if="result.pos" class="mb-2 mt-4 sm:mt-0">
            <span :class="getPosBadgeStyle(result.pos)"
                  class="inline-block border-2 border-slate-900 px-2.5 py-0.5 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_#0f172a]">
              🏷️ {{ result.pos }}
            </span>
          </div>

          <div class="flex items-center justify-center gap-3 px-2 mt-1">
            <h2 :class="result.word.length > 18 ? 'text-2xl sm:text-4xl' : 'text-3xl sm:text-5xl'"
                class="clear-word-font font-extrabold text-slate-950 break-words leading-tight">
              {{ result.word }}
            </h2>
            <button @click="$emit('speak', result.word)" type="button"
                    class="pixel-btn bg-sky-400 hover:bg-sky-300 text-slate-950 p-2.5 text-lg shrink-0">
              🔊
            </button>
          </div>

          <p class="text-xl sm:text-2xl font-bold text-emerald-700 mt-3">{{ result.meaning }}</p>

          <div v-if="result.grammar_note && result.grammar_note !== '-'"
               class="mt-3 inline-block bg-amber-100 border-2 border-slate-800 px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-900">
            <span>📘 詞形變化：{{ result.grammar_note }}</span>
          </div>
        </div>

        <!-- 實用生活例句卡 -->
        <div v-if="result.sentence"
             @click="$emit('speak', result.sentence)"
             class="pixel-box-sm bg-[#f8fafc] hover:bg-sky-50 p-3.5 sm:p-4 text-left cursor-pointer transition">
          <div class="flex justify-between items-start gap-2">
            <div>
              <span class="text-[11px] font-bold text-sky-700 block mb-1">💬 實用生活例句（點擊發音）：</span>
              <p class="clear-word-font text-base sm:text-lg font-extrabold text-slate-900">“ {{ result.sentence }} ”</p>
            </div>
            <span class="text-sky-600 text-lg shrink-0">🔊</span>
          </div>
          <p v-if="result.sentence_cn" class="text-xs sm:text-sm text-slate-600 mt-1.5 font-bold">{{ result.sentence_cn }}</p>
        </div>

        <!-- 重點文法與用法解析卡 -->
        <div v-if="result.grammar_analysis"
             class="pixel-box-sm bg-purple-50/90 p-3.5 sm:p-4 text-left space-y-1.5">
          <div class="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-950">
            <span>🧙‍♂️</span>
            <span>文法與用法小教室：</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed whitespace-pre-line">{{ result.grammar_analysis }}</p>
        </div>
      </div>
    </div>
  `
};


// 11. 勇者裝備屋與像素寵物扭蛋機彈窗
const HeroShopModal = {
  name: 'HeroShopModal',
  props: ['show', 'currentUser'],
  emits: ['close', 'buy-item', 'equip-item', 'roll-gacha'],
  setup(props, { emit }) {
    const { ref, computed } = Vue;
    const activeTab = ref('weapons'); // 'weapons' | 'shields' | 'pets'
    const isRolling = ref(false);
    const gachaResult = ref(null);
    const shopNotice = ref('');

    const catalog = RPG_CATALOG;

    const inventory = computed(() => {
      return (props.currentUser && Array.isArray(props.currentUser.inventory))
        ? props.currentUser.inventory
        : ['wp_wood', 'sh_none'];
    });

    const equipped = computed(() => {
      return (props.currentUser && props.currentUser.equipped)
        ? props.currentUser.equipped
        : { weapon: 'wp_wood', shield: 'sh_none', pet: '' };
    });

    const userStars = computed(() => (props.currentUser ? (props.currentUser.stars || 0) : 0));

    const ownedPetsCount = computed(() => {
      return catalog.pets.filter(p => inventory.value.includes(p.id)).length;
    });

    const isOwned = (id) => inventory.value.includes(id);

    const handleBuyOrEquip = (category, item) => {
      if (isOwned(item.id)) {
        if (typeof play8BitSfx === 'function') play8BitSfx('click');
        emit('equip-item', { category, itemId: item.id });
        shopNotice.value = `✅ 已裝備「${item.icon} ${item.name}」！`;
      } else {
        if (userStars.value < item.price) {
          if (typeof play8BitSfx === 'function') play8BitSfx('hit');
          shopNotice.value = `❌ 星幣不足！還差 ${item.price - userStars.value} ★，快去背單字賺星幣吧！`;
          return;
        }
        if (typeof play8BitSfx === 'function') play8BitSfx('victory');
        emit('buy-item', { category, item });
        shopNotice.value = `🎉 購買並裝備了「${item.icon} ${item.name}」！`;
        if (window.confetti) confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      }
    };

    const triggerPetGacha = () => {
      if (isRolling.value) return;
      if (userStars.value < catalog.gachaCost) {
        if (typeof play8BitSfx === 'function') play8BitSfx('hit');
        shopNotice.value = `❌ 轉扭蛋需要 ${catalog.gachaCost} ★（目前僅有 ${userStars.value} ★）！`;
        return;
      }

      if (typeof play8BitSfx === 'function') play8BitSfx('click');
      isRolling.value = true;
      gachaResult.value = null;
      shopNotice.value = '';

      setTimeout(() => {
        // 權重抽獎：未擁有的寵物權重較高，增加收集成就感
        const pool = [];
        catalog.pets.forEach(pet => {
          const owned = isOwned(pet.id);
          let weight = pet.rarity === 'SSR' ? 1 : (pet.rarity === 'SR' ? 3 : 5);
          if (!owned) weight *= 2;
          for (let i = 0; i < weight; i++) pool.push(pet);
        });
        const picked = pool[Math.floor(Math.random() * pool.length)];
        const isNew = !isOwned(picked.id);

        isRolling.value = false;
        gachaResult.value = { pet: picked, isNew };

        if (typeof play8BitSfx === 'function') play8BitSfx('victory');
        emit('roll-gacha', { pet: picked, isNew, cost: catalog.gachaCost });
        if (window.confetti) confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }, 900);
    };

    return {
      activeTab, isRolling, gachaResult, shopNotice, catalog,
      inventory, equipped, userStars, ownedPetsCount,
      isOwned, handleBuyOrEquip, triggerPetGacha
    };
  },
  template: `
    <div v-if="show && currentUser" class="fixed inset-0 bg-black/75 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-3">
      <div class="pixel-box bg-[#fffbeb] w-full max-w-3xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto text-slate-900 my-auto">
        
        <!-- 頂部標題與目前持有星幣 -->
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-4 border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🏪</span>
            <div>
              <h2 class="text-lg sm:text-xl font-bold">勇者裝備屋 & 寵物扭蛋機</h2>
              <p class="text-[11px] sm:text-xs font-bold text-slate-600">用背單字賺來的星幣強化神兵防具、收集夥伴！</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="pixel-box-sm bg-slate-900 px-3 py-1 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-1">
              <span>★ 持有星幣:</span><span class="pixel-en text-base">{{ userStars }}</span>
            </div>
            <button @click="$emit('close')" class="pixel-btn bg-rose-500 text-white px-2.5 py-1 text-sm font-bold">✕</button>
          </div>
        </div>

        <!-- 分頁切換鍵 -->
        <div class="grid grid-cols-3 gap-2 mt-4">
          <button @click="activeTab = 'weapons'; shopNotice = ''" type="button"
                  :class="activeTab === 'weapons' ? 'bg-rose-400 text-slate-950 -translate-y-0.5' : 'bg-white text-slate-700 hover:bg-slate-100'"
                  class="pixel-btn py-2.5 text-xs sm:text-sm font-bold">
            ⚔️ 神兵武器
          </button>
          <button @click="activeTab = 'shields'; shopNotice = ''" type="button"
                  :class="activeTab === 'shields' ? 'bg-sky-400 text-slate-950 -translate-y-0.5' : 'bg-white text-slate-700 hover:bg-slate-100'"
                  class="pixel-btn py-2.5 text-xs sm:text-sm font-bold">
            🛡️ 守護防具
          </button>
          <button @click="activeTab = 'pets'; shopNotice = ''" type="button"
                  :class="activeTab === 'pets' ? 'bg-purple-400 text-slate-950 -translate-y-0.5' : 'bg-white text-slate-700 hover:bg-slate-100'"
                  class="pixel-btn py-2.5 text-xs sm:text-sm font-bold">
            🥚 寵物扭蛋 ({{ ownedPetsCount }}/{{ catalog.pets.length }})
          </button>
        </div>

        <div v-if="shopNotice" class="mt-3 bg-amber-100 border-2 border-slate-900 px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 text-center">
          {{ shopNotice }}
        </div>

        <!-- 分頁 1：神兵武器 -->
        <div v-if="activeTab === 'weapons'" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div v-for="wp in catalog.weapons" :key="wp.id"
               :class="equipped.weapon === wp.id ? 'bg-amber-100 border-amber-600' : 'bg-white'"
               class="pixel-box-sm p-3.5 flex flex-col justify-between gap-2.5">
            <div class="flex items-start gap-3">
              <div class="pixel-box-sm w-12 h-12 bg-rose-100 flex items-center justify-center text-2xl shrink-0">
                {{ wp.icon }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1">
                  <span class="font-bold text-sm sm:text-base text-slate-950">{{ wp.name }}</span>
                  <span v-if="equipped.weapon === wp.id" class="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5">
                    裝備中
                  </span>
                </div>
                <p class="text-xs text-slate-700 font-bold mt-1">{{ wp.desc }}</p>
              </div>
            </div>

            <button @click="handleBuyOrEquip('weapon', wp)" type="button"
                    :disabled="equipped.weapon === wp.id"
                    :class="equipped.weapon === wp.id 
                      ? 'bg-slate-300 text-slate-600 cursor-default' 
                      : (isOwned(wp.id) ? 'bg-sky-300 hover:bg-sky-200 text-slate-950' : 'bg-amber-400 hover:bg-amber-300 text-slate-950')"
                    class="pixel-btn w-full py-2 text-xs sm:text-sm font-bold">
              <span v-if="equipped.weapon === wp.id">✔️ 目前使用中</span>
              <span v-else-if="isOwned(wp.id)">🔄 換上此武器</span>
              <span v-else>💰 {{ wp.price }} ★ 購買</span>
            </button>
          </div>
        </div>

        <!-- 分頁 2：守護防具 -->
        <div v-if="activeTab === 'shields'" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div v-for="sh in catalog.shields" :key="sh.id"
               :class="equipped.shield === sh.id ? 'bg-amber-100 border-amber-600' : 'bg-white'"
               class="pixel-box-sm p-3.5 flex flex-col justify-between gap-2.5">
            <div class="flex items-start gap-3">
              <div class="pixel-box-sm w-12 h-12 bg-sky-100 flex items-center justify-center text-2xl shrink-0">
                {{ sh.icon }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1">
                  <span class="font-bold text-sm sm:text-base text-slate-950">{{ sh.name }}</span>
                  <span v-if="equipped.shield === sh.id" class="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5">
                    裝備中
                  </span>
                </div>
                <p class="text-xs text-slate-700 font-bold mt-1">{{ sh.desc }}</p>
              </div>
            </div>

            <button @click="handleBuyOrEquip('shield', sh)" type="button"
                    :disabled="equipped.shield === sh.id"
                    :class="equipped.shield === sh.id 
                      ? 'bg-slate-300 text-slate-600 cursor-default' 
                      : (isOwned(sh.id) ? 'bg-sky-300 hover:bg-sky-200 text-slate-950' : 'bg-amber-400 hover:bg-amber-300 text-slate-950')"
                    class="pixel-btn w-full py-2 text-xs sm:text-sm font-bold">
              <span v-if="equipped.shield === sh.id">✔️ 目前穿戴中</span>
              <span v-else-if="isOwned(sh.id)">🔄 換上此防具</span>
              <span v-else>💰 {{ sh.price }} ★ 購買</span>
            </button>
          </div>
        </div>

        <!-- 分頁 3：寵物扭蛋機與夥伴圖鑑 -->
        <div v-if="activeTab === 'pets'" class="mt-4 space-y-4">
          <!-- 扭蛋召喚台 -->
          <div class="pixel-box-sm bg-purple-100 p-4 text-center space-y-2.5">
            <div class="text-4xl" :class="isRolling ? 'animate-spin' : 'animate-bounce'">
              {{ isRolling ? '🔮' : (gachaResult ? gachaResult.pet.icon : '🥚') }}
            </div>

            <div v-if="isRolling" class="text-sm sm:text-base font-bold text-purple-900 animate-pulse">
              ✨ 魔法扭蛋旋轉中... 看看會召喚出哪隻神獸！
            </div>

            <div v-else-if="gachaResult" class="space-y-1">
              <div class="inline-block bg-amber-300 border-2 border-slate-900 px-2.5 py-0.5 text-xs font-bold">
                {{ gachaResult.isNew ? '🆕 獲得全新夥伴！' : '✨ 夥伴親密度提升 (+10 ★回饋)！' }}
                [{{ gachaResult.pet.rarity }}]
              </div>
              <h3 class="text-lg font-bold text-purple-950">{{ gachaResult.pet.icon }} {{ gachaResult.pet.name }}</h3>
              <p class="text-xs font-bold text-slate-700">{{ gachaResult.pet.desc }}</p>
            </div>

            <div v-else class="space-y-1">
              <h3 class="text-base font-bold text-purple-950">神秘像素寵物扭蛋機</h3>
              <p class="text-xs font-bold text-purple-800">召喚夥伴一起出戰，每次通關試煉或擊敗巨龍都能獲得額外星幣加成！</p>
            </div>

            <button @click="triggerPetGacha" :disabled="isRolling" type="button"
                    class="pixel-btn bg-purple-500 hover:bg-purple-400 text-white font-bold px-6 py-2.5 text-sm sm:text-base">
              🎰 轉一次扭蛋 ({{ catalog.gachaCost }} ★)
            </button>
          </div>

          <!-- 寵物圖鑑一覽 -->
          <div class="space-y-2">
            <div class="text-xs font-bold text-slate-800">🐾 我的夥伴圖鑑（點擊已解鎖夥伴可切換出戰）：</div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div v-for="pet in catalog.pets" :key="pet.id"
                   @click="isOwned(pet.id) && handleBuyOrEquip('pet', pet)"
                   :class="[
                     equipped.pet === pet.id ? 'bg-amber-200 border-slate-950' : (isOwned(pet.id) ? 'bg-white cursor-pointer hover:bg-purple-50' : 'bg-slate-200 opacity-60')
                   ]"
                   class="pixel-box-sm p-2.5 text-center space-y-1 transition">
                <div class="flex justify-between items-center text-[10px] font-bold">
                  <span :class="pet.rarity === 'SSR' ? 'bg-rose-500 text-white' : (pet.rarity === 'SR' ? 'bg-purple-500 text-white' : 'bg-sky-500 text-white')"
                        class="px-1.5 py-0.2">
                    {{ pet.rarity }}
                  </span>
                  <span v-if="equipped.pet === pet.id" class="text-emerald-700 font-bold">出戰中</span>
                  <span v-else-if="!isOwned(pet.id)" class="text-slate-500">未解鎖</span>
                </div>
                <div class="text-3xl py-1">{{ isOwned(pet.id) ? pet.icon : '❓' }}</div>
                <div class="text-xs font-bold text-slate-950">{{ isOwned(pet.id) ? pet.name : '神秘夥伴' }}</div>
                <div class="text-[10px] text-slate-600 font-bold leading-tight">
                  {{ isOwned(pet.id) ? pet.desc : '透過扭蛋機解鎖' }}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
};
