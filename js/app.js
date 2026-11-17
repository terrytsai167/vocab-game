const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

const app = createApp({
  components: {
    ProfileBar,
    NavBar,
    BookUnitSelector,
    UserProfileModal,
    WordPracticeModal,
    StudyMode,
    ListenTrial,
    SpellTrial,
    BossBattle
  },
  setup() {
    // 1. 初始化讀取本機快取
    const users = ref(StorageService.loadLocalUsers());
    const currentUserId = ref(StorageService.loadActiveUserId());
    const showProfileModal = ref(false);
    const showPracticeModal = ref(false);

    const currentUser = computed(() => {
      return users.value.find(u => u.id === currentUserId.value) || users.value[0];
    });

    const stars = computed({
      get: () => currentUser.value.stars || 0,
      set: (val) => {
        currentUser.value.stars = val;
        saveUserData();
      }
    });

    // 2. 儲存本機並觸發雲端背景同步
    const saveUserData = () => {
      StorageService.saveLocalUsers(users.value);
      StorageService.syncUserToCloud(currentUser.value);
    };

    const allAvailableBooks = ref([]);
    const allRawWords = ref([]);
    const wordList = ref([]);
    const selectedBookId = ref('');
    const selectedUnit = ref('ALL');
    const isLoading = ref(true);

    const visibleBookList = computed(() => {
      const assigned = currentUser.value.assignedBookIds || [];
      if (!assigned || assigned.length === 0) {
        return allAvailableBooks.value;
      }
      return allAvailableBooks.value.filter(b => assigned.includes(b.id));
    });

    const currentIndex = ref(0);
    const currentRate = ref(1.0);
    const currentMode = ref('study');

    const trialList = ref([]);
    const trialIndex = ref(0);
    const trialFeedback = ref('');
    const trialFeedbackColor = ref('text-emerald-700');

    const scrambledPool = ref([]);
    const spelledLetters = ref([]);

    const isListening = ref(false);
    const studyFeedback = ref('');
    const studyFeedbackColor = ref('text-emerald-700');

    const bossGameState = ref('playing');
    const bossHp = ref(100);
    const playerHp = ref(100);
    const timer = ref(CONFIG.MAX_BOSS_TIME);
    let timerInterval = null;
    const isShaking = ref(false);
    const combatMsg = ref('');
    const combatMsgColor = ref('text-emerald-700');
    const bossQuizList = ref([]);
    const bossQuestionIndex = ref(0);
    const bossTypedWord = ref('');
    const isWritingActive = ref(false);
    const isRecognizing = ref(false);
    const lastRecognizedLetter = ref('');

    const currentWord = computed(() => wordList.value[currentIndex.value]);
    const currentTrialWord = computed(() => trialList.value[trialIndex.value]);
    const currentBossQuestion = computed(() => bossQuizList.value[bossQuestionIndex.value]);

    const unitList = computed(() => {
      const units = allRawWords.value
        .map(w => w.unit ? String(w.unit).trim() : '未分類')
        .filter(u => u !== '');
      return Array.from(new Set(units));
    });

    const getUnitWordCount = (u) => {
      return allRawWords.value.filter(w => (w.unit ? String(w.unit).trim() : '未分類') === u).length;
    };

    // 安全無正規表達式轉義錯誤的句子遮罩
    const maskedSentence = computed(() => {
      if (!currentBossQuestion.value) return '';
      const s = currentBossQuestion.value.sentence || '';
      const w = currentBossQuestion.value.word || '';
      if (!w) return s;
      return s.split(w).join('______').split(w.toLowerCase()).join('______');
    });

    const borderTheme = computed(() => {
      switch (currentMode.value) {
        case 'trial_listen': return 'bg-[#e0f2fe]';
        case 'trial_spell': return 'bg-[#dcfce7]';
        case 'boss': return 'bg-[#ffe4e6]';
        default: return 'bg-[#fef3c7]';
      }
    });

    // 3. 切換小孩勇者時，自動載入該小孩上次停留的課本與課次
    const switchUser = async (userId) => {
      play8BitSfx('click');
      currentUserId.value = userId;
      StorageService.saveActiveUserId(userId);

      const user = currentUser.value;
      let targetBookId = user.lastBookId || '';

      if (visibleBookList.value.length > 0) {
        const isValid = visibleBookList.value.some(b => b.id === targetBookId);
        if (!isValid) {
          targetBookId = visibleBookList.value[0].id;
        }
      }

      if (targetBookId && targetBookId !== selectedBookId.value) {
        selectedBookId.value = targetBookId;
        await loadWords(targetBookId === 'default' ? '' : targetBookId, user.lastUnit || 'ALL');
      } else {
        selectedUnit.value = user.lastUnit || 'ALL';
        applyUnitFilter();
      }
    };

    const onSaveUserSettings = (updated) => {
      play8BitSfx('coin');
      const target = users.value.find(u => u.id === updated.id);
      if (target) {
        target.name = updated.name;
        target.avatar = updated.avatar;
        target.assignedBookIds = updated.assignedBookIds;
        saveUserData();

        if (visibleBookList.value.length > 0) {
          const match = visibleBookList.value.find(b => b.id === selectedBookId.value);
          if (!match) {
            selectedBookId.value = visibleBookList.value[0].id;
            loadWords(selectedBookId.value === 'default' ? '' : selectedBookId.value, target.lastUnit || 'ALL');
          }
        }
      }
    };

    const onAddUser = (newU) => {
      play8BitSfx('coin');
      const newId = 'user_' + Date.now();
      users.value.push({
        id: newId,
        name: newU.name,
        avatar: newU.avatar,
        assignedBookIds: [],
        lastBookId: '',
        lastUnit: 'ALL',
        stars: 0,
        studiedWords: {},
        wrongWords: {},
        streakDays: 0,
        lastStudyDate: '',
        dailyStats: {},
        activityLogs: [],
        listenAttempts: 0,
        listenCorrect: 0,
        spellAttempts: 0,
        spellCorrect: 0,
        bossVictories: 0
      });
      saveUserData();
      switchUser(newId);
    };

    const onDeleteUser = (userId) => {
      if (users.value.length <= 1) return;
      if (confirm('確定要刪除這位小勇者的學習紀錄嗎？')) {
        users.value = users.value.filter(u => u.id !== userId);
        currentUserId.value = users.value[0].id;
        StorageService.saveLocalUsers(users.value);
        StorageService.deleteUserFromCloud(userId);
        switchUser(currentUserId.value);
        showProfileModal.value = false;
      }
    };

    const getTodayDateKey = () => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const getFormattedTimestamp = () => {
      const d = new Date();
      return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    const currentBookName = computed(() => {
      const found = allAvailableBooks.value.find(b => b.id === selectedBookId.value);
      return found ? found.name : '';
    });

    const todayWordCount = computed(() => {
      const todayKey = getTodayDateKey();
      const stats = currentUser.value.dailyStats || {};
      return stats[todayKey] ? (stats[todayKey].count || 0) : 0;
    });

    // 記錄練習狀況明細 + 更新每日練習字數與連勝天數
    const recordActivityLog = ({ mode, detail, result, isSuccess = true, wordDelta = 0 }) => {
      const user = currentUser.value;
      const todayKey = getTodayDateKey();

      // 1. 更新連勝天數
      if (user.lastStudyDate !== todayKey) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
        if (user.lastStudyDate === yKey) {
          user.streakDays = (user.streakDays || 0) + 1;
        } else {
          user.streakDays = 1;
        }
        user.lastStudyDate = todayKey;
      }

      // 2. 更新今日累計練習字數
      if (wordDelta > 0) {
        if (!user.dailyStats) user.dailyStats = {};
        if (!user.dailyStats[todayKey]) user.dailyStats[todayKey] = { count: 0 };
        user.dailyStats[todayKey].count += wordDelta;
      }

      // 3. 寫入近期練習狀況時間軸 (保留最新 30 筆)
      if (!Array.isArray(user.activityLogs)) user.activityLogs = [];
      const logEntry = {
        time: getFormattedTimestamp(),
        mode: mode,
        detail: detail,
        result: result,
        isSuccess: isSuccess,
        bookName: currentBookName.value
      };
      user.activityLogs.unshift(logEntry);
      if (user.activityLogs.length > 30) {
        user.activityLogs = user.activityLogs.slice(0, 30);
      }

      saveUserData();
      StorageService.appendActivityLogToCloud(user, logEntry);
    };

    const recordWordStudied = (word) => {
      if (!word) return;
      if (!currentUser.value.studiedWords) currentUser.value.studiedWords = {};
      currentUser.value.studiedWords[word] = (currentUser.value.studiedWords[word] || 0) + 1;
      saveUserData();
    };

    // 記錄錯題與累計錯誤次數
    const recordWrongWord = (wordObjOrText, meaningText = '') => {
      const rawWord = typeof wordObjOrText === 'object' && wordObjOrText !== null
        ? wordObjOrText.word
        : wordObjOrText;
      const wKey = String(rawWord || '').trim().toLowerCase();
      if (!wKey) return;

      const meaning = (typeof wordObjOrText === 'object' && wordObjOrText !== null)
        ? (wordObjOrText.meaning || wordObjOrText.correctMeaning || meaningText)
        : meaningText;

      if (!currentUser.value.wrongWords) currentUser.value.wrongWords = {};
      const existing = currentUser.value.wrongWords[wKey];
      if (existing) {
        existing.count = (existing.count || 1) + 1;
        if (meaning && !existing.meaning) existing.meaning = meaning;
        existing.lastWrongAt = Date.now();
      } else {
        currentUser.value.wrongWords[wKey] = {
          word: String(rawWord).trim(),
          meaning: meaning || '',
          count: 1,
          lastWrongAt: Date.now()
        };
      }
      saveUserData();
    };

    // 當在默寫特訓或決戰 Boss 成功寫對時，減輕錯題權重（降為 0 即從弱點畢業）
    const reduceWrongWord = (wordText) => {
      const wKey = String(wordText || '').trim().toLowerCase();
      if (!wKey || !currentUser.value.wrongWords || !currentUser.value.wrongWords[wKey]) return;
      const nextCount = (currentUser.value.wrongWords[wKey].count || 1) - 1;
      if (nextCount <= 0) {
        delete currentUser.value.wrongWords[wKey];
      } else {
        currentUser.value.wrongWords[wKey].count = nextCount;
      }
      saveUserData();
    };

    const currentBookWrongWordsCount = computed(() => {
      const wMap = currentUser.value.wrongWords || {};
      return allRawWords.value.filter(w => {
        const key = String(w.word || '').trim().toLowerCase();
        return wMap[key] && (wMap[key].count || 0) > 0;
      }).length;
    });

    const currentWordWrongCount = computed(() => {
      if (!currentWord.value || !currentUser.value.wrongWords) return 0;
      const key = String(currentWord.value.word || '').trim().toLowerCase();
      return currentUser.value.wrongWords[key] ? (currentUser.value.wrongWords[key].count || 0) : 0;
    });

    const startWeaknessTraining = () => {
      play8BitSfx('click');
      if (currentBookWrongWordsCount.value === 0) {
        alert('目前這本課本沒有累積錯題喔！如果錯題在其他課本，請先切換到該課本。');
        return;
      }
      selectedUnit.value = 'WRONG_ONLY';
      currentUser.value.lastBookId = selectedBookId.value;
      currentUser.value.lastUnit = 'WRONG_ONLY';
      saveUserData();
      applyUnitFilter();
    };

    const clearWrongWords = () => {
      if (confirm('確定要清空所有弱點錯題紀錄嗎？')) {
        play8BitSfx('click');
        currentUser.value.wrongWords = {};
        saveUserData();
        if (selectedUnit.value === 'WRONG_ONLY') {
          selectedUnit.value = 'ALL';
          applyUnitFilter();
        }
      }
    };

    const onPracticeError = (wordObj) => {
      recordWrongWord(wordObj);
    };

    const onPracticeComplete = (payload) => {
      if (payload && payload.word) {
        recordWordStudied(payload.word);
        reduceWrongWord(payload.word);
        recordActivityLog({
          mode: '✍️ 默寫特訓',
          detail: `${payload.word} (完成 ${payload.count || 3} 次)`,
          result: '通過 +3★',
          isSuccess: true,
          wordDelta: 1
        });
      }
      stars.value += 3;
      saveUserData();
    };

    const recordListenResult = (isCorrect) => {
      currentUser.value.listenAttempts = (currentUser.value.listenAttempts || 0) + 1;
      if (isCorrect) {
        currentUser.value.listenCorrect = (currentUser.value.listenCorrect || 0) + 1;
        stars.value += 1;
      }
      saveUserData();
    };

    const recordSpellResult = (isCorrect) => {
      currentUser.value.spellAttempts = (currentUser.value.spellAttempts || 0) + 1;
      if (isCorrect) {
        currentUser.value.spellCorrect = (currentUser.value.spellCorrect || 0) + 1;
        stars.value += 2;
      }
      saveUserData();
    };

    const recordBossVictory = () => {
      currentUser.value.bossVictories = (currentUser.value.bossVictories || 0) + 1;
      stars.value += 10;
      recordActivityLog({
        mode: '⚔️ 決戰 Boss',
        detail: `擊敗暗黑巨龍 (${selectedUnit.value}，共 ${bossQuizList.value.length} 題)`,
        result: '勝利 +10★',
        isSuccess: true,
        wordDelta: bossQuizList.value.length
      });
      saveUserData();
    };

    // 4. 網頁開啟時：同步雲端書本 + 雲端使用者紀錄 + 自動還原上次進度
    const initData = async () => {
      isLoading.value = true;
      try {
        const [resBooks, cloudUsers] = await Promise.all([
          fetch(`${CONFIG.GAS_URL}?action=getBooks`).then(r => r.json()).catch(() => null),
          StorageService.fetchCloudUsers()
        ]);

        if (cloudUsers && cloudUsers.length > 0) {
          users.value = cloudUsers;
        }

        if (Array.isArray(resBooks) && resBooks.length > 0) {
          if (resBooks[0] && typeof resBooks[0] === 'object' && 'word' in resBooks[0]) {
            allAvailableBooks.value = [{ name: '預設單字本', id: 'default' }];
          } else {
            allAvailableBooks.value = resBooks.map((b, idx) => {
              if (Array.isArray(b)) {
                return { name: String(b[0] || `課本 ${idx + 1}`).trim(), id: String(b[1] || '').trim() };
              }
              if (typeof b === 'object' && b !== null) {
                const entries = Object.entries(b);
                const idEntry = entries.find(([k]) => ['id', 'book_id', 'bookid', 'spreadsheet_id', 'sheet_id'].includes(k.toLowerCase()));
                const bookId = idEntry ? String(idEntry[1]).trim() : '';
                const nameEntry = entries.find(([k, v]) => 
                  k !== (idEntry && idEntry[0]) && String(v).trim() !== '' &&
                  ['name', 'book_name', 'bookname', 'book', 'title', 'label', '書名', '課本', '課本名稱', '名稱'].includes(k.toLowerCase())
                ) || entries.find(([k, v]) => k !== (idEntry && idEntry[0]) && String(v).trim() !== '');
                return { name: nameEntry ? String(nameEntry[1]).trim() : `課本 ${idx + 1}`, id: bookId };
              }
              return { name: String(b), id: String(b) };
            }).filter(b => b.id !== '');
          }
        } else {
          allAvailableBooks.value = [{ name: '預設單字本', id: 'default' }];
        }

        const activeUser = currentUser.value;
        let targetBookId = activeUser.lastBookId || '';

        if (visibleBookList.value.length > 0) {
          const isValid = visibleBookList.value.some(b => b.id === targetBookId);
          if (!isValid) {
            targetBookId = visibleBookList.value[0].id;
          }
        }

        selectedBookId.value = targetBookId;
        const targetUnit = activeUser.lastUnit || 'ALL';

        await loadWords(targetBookId === 'default' ? '' : targetBookId, targetUnit);

        if (!cloudUsers) {
          StorageService.syncUserToCloud(activeUser);
        }
      } catch (e) {
        console.error('初始化錯誤：', e);
        await loadWords();
      }
    };

    // 5. 載入指定書本並套用目標課次
    const loadWords = async (bookId = '', targetUnit = 'ALL') => {
      isLoading.value = true;
      try {
        const targetUrl = (bookId && bookId !== 'default') 
          ? `${CONFIG.GAS_URL}?action=getWords&bookId=${bookId}` 
          : CONFIG.GAS_URL;
        const res = await fetch(targetUrl);
        const data = await res.json();
        allRawWords.value = Array.isArray(data) ? data.filter(item => item.word && String(item.word).trim() !== '') : [];

        const availableUnits = Array.from(new Set(
          allRawWords.value.map(w => w.unit ? String(w.unit).trim() : '未分類').filter(u => u !== '')
        ));
        selectedUnit.value = (targetUnit === 'ALL' || targetUnit === 'WRONG_ONLY' || availableUnits.includes(targetUnit)) ? targetUnit : 'ALL';
        
        applyUnitFilter();
      } catch (e) {
        console.error('載入失敗：', e);
        if (allRawWords.value.length === 0) {
          alert('無法載入單字，請檢查網路連線或 Apps Script 部署網址！');
        }
      } finally {
        isLoading.value = false;
      }
    };

    // 套用課次過濾 (含弱點特訓錯題本)
    const applyUnitFilter = () => {
      if (selectedUnit.value === 'WRONG_ONLY') {
        const wMap = currentUser.value.wrongWords || {};
        const wrongFiltered = allRawWords.value.filter(w => {
          const key = String(w.word || '').trim().toLowerCase();
          return wMap[key] && (wMap[key].count || 0) > 0;
        });
        if (wrongFiltered.length > 0) {
          wordList.value = wrongFiltered;
        } else {
          selectedUnit.value = 'ALL';
          wordList.value = [...allRawWords.value];
        }
      } else if (selectedUnit.value === 'ALL') {
        wordList.value = [...allRawWords.value];
      } else {
        wordList.value = allRawWords.value.filter(w => 
          (w.unit ? String(w.unit).trim() : '未分類') === selectedUnit.value
        );
      }
      currentIndex.value = 0;
      if (currentMode.value === 'trial_listen') initListenTrial();
      else if (currentMode.value === 'trial_spell') initSpellTrial();
      else if (currentMode.value === 'boss') startBossBattle();
    };

    // 6. 使用者手動切換課本時：記錄 lastBookId 並重置 lastUnit 為 ALL
    const onBookChange = (event) => {
      play8BitSfx('click');
      const bookId = event && event.target ? event.target.value : event;
      selectedBookId.value = bookId;
      currentUser.value.lastBookId = bookId;
      currentUser.value.lastUnit = 'ALL';
      saveUserData();
      loadWords(bookId === 'default' ? '' : bookId, 'ALL');
    };

    // 7. 使用者手動切換課次時：記錄 lastUnit 至雲端
    const onUnitChange = (event) => {
      play8BitSfx('click');
      const unit = event && event.target ? event.target.value : event;
      if (unit) selectedUnit.value = unit;
      currentUser.value.lastBookId = selectedBookId.value;
      currentUser.value.lastUnit = selectedUnit.value;
      saveUserData();
      applyUnitFilter();
    };

    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    const speak = (text) => playSpeech(text, currentRate.value);

    const setRate = (r) => {
      play8BitSfx('click');
      currentRate.value = r;
      if (currentWord.value) speak(currentWord.value.word);
    };

    const setMode = (mode) => {
      play8BitSfx('click');
      currentMode.value = mode;
      clearInterval(timerInterval);
      trialFeedback.value = '';

      if (mode === 'trial_listen') initListenTrial();
      else if (mode === 'trial_spell') initSpellTrial();
      else if (mode === 'boss') startBossBattle();
    };

    const initListenTrial = () => {
      if (wordList.value.length === 0) return;
      trialIndex.value = 0;
      trialList.value = shuffle([...wordList.value]).map(w => {
        const distractors = wordList.value.filter(o => o.word !== w.word).map(o => o.meaning);
        return {
          word: w.word,
          correctMeaning: w.meaning,
          options: shuffle([w.meaning, ...shuffle(distractors).slice(0, 3)])
        };
      });
      setTimeout(() => { if (currentTrialWord.value) speak(currentTrialWord.value.word); }, 300);
    };

    const checkListenAnswer = (selected) => {
      const isCorrect = (selected === currentTrialWord.value.correctMeaning);
      recordListenResult(isCorrect);

      if (isCorrect) {
        play8BitSfx('coin');
        trialFeedback.value = '🎉 聽得真準！ (+1 ★)';
        trialFeedbackColor.value = 'text-emerald-700';
        setTimeout(() => {
          trialFeedback.value = '';
          if (trialIndex.value < trialList.value.length - 1) {
            trialIndex.value++;
            speak(currentTrialWord.value.word);
          } else {
            play8BitSfx('victory');
            trialFeedback.value = '🏆 恭喜通過聽力試煉！';
            recordActivityLog({
              mode: '👂 聽力試煉',
              detail: `完成 ${trialList.value.length} 題聽力測驗 (${selectedUnit.value})`,
              result: '全數過關',
              isSuccess: true,
              wordDelta: trialList.value.length
            });
            if (window.confetti) confetti();
          }
        }, CONFIG.FEEDBACK_DELAY);
      } else {
        play8BitSfx('hit');
        recordWrongWord(currentTrialWord.value.word, currentTrialWord.value.correctMeaning);
        trialFeedback.value = '再仔細聽一次發音看看～（已加入弱點本）';
        trialFeedbackColor.value = 'text-rose-600';
        speak(currentTrialWord.value.word);
      }
    };

    const initSpellTrial = () => {
      if (wordList.value.length === 0) return;
      trialIndex.value = 0;
      trialList.value = shuffle([...wordList.value]);
      setupSpellingLetters();
    };

    const setupSpellingLetters = () => {
      if (!currentTrialWord.value) return;
      const target = currentTrialWord.value.word.trim();
      spelledLetters.value = [];
      const letters = target.split('');
      scrambledPool.value = shuffle(letters).map((l, i) => ({ id: i, letter: l, used: false }));
      speak(target);
    };

    const pickLetter = (item) => {
      play8BitSfx('click');
      item.used = true;
      spelledLetters.value.push(item.letter);
    };

    const removeLetter = (idx) => {
      play8BitSfx('click');
      const removed = spelledLetters.value.splice(idx, 1)[0];
      const found = scrambledPool.value.find(p => p.letter === removed && p.used);
      if (found) found.used = false;
    };

    const resetSpelling = () => {
      play8BitSfx('click');
      spelledLetters.value = [];
      scrambledPool.value.forEach(p => p.used = false);
    };

    const checkSpelling = () => {
      const spelled = spelledLetters.value.join('');
      const target = currentTrialWord.value.word.trim();
      const isCorrect = (spelled.toLowerCase() === target.toLowerCase());
      recordSpellResult(isCorrect);

      if (isCorrect) {
        play8BitSfx('coin');
        trialFeedback.value = '🎯 拼字完全正確！ (+2 ★)';
        trialFeedbackColor.value = 'text-emerald-700';
        setTimeout(() => {
          trialFeedback.value = '';
          if (trialIndex.value < trialList.value.length - 1) {
            trialIndex.value++;
            setupSpellingLetters();
          } else {
            play8BitSfx('victory');
            trialFeedback.value = '🏆 恭喜通過拼字試煉！';
            recordActivityLog({
              mode: '🧩 拼字試煉',
              detail: `完成 ${trialList.value.length} 題拼字測驗 (${selectedUnit.value})`,
              result: '全數過關',
              isSuccess: true,
              wordDelta: trialList.value.length
            });
            if (window.confetti) confetti();
          }
        }, CONFIG.FEEDBACK_DELAY);
      } else {
        play8BitSfx('hit');
        recordWrongWord(currentTrialWord.value);
        trialFeedback.value = '拼法不太對，再試一次看看～（已加入弱點本）';
        trialFeedbackColor.value = 'text-rose-600';
      }
    };

    const startListeningStudy = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return alert('此瀏覽器不支援語音辨識');

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      isListening.value = true;
      studyFeedback.value = '';

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
        const target = currentWord.value.word.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');

        if (spoken === target || spoken.includes(target)) {
          play8BitSfx('coin');
          studyFeedback.value = '🌟 太棒了！發音非常標準！';
          studyFeedbackColor.value = 'text-emerald-700';
          speak('Awesome!');
          recordWordStudied(currentWord.value.word);
        } else {
          play8BitSfx('hit');
          studyFeedback.value = `聽到的是 "${spoken}"，再試一次！`;
          studyFeedbackColor.value = 'text-rose-600';
        }
      };
      recognition.onend = () => { isListening.value = false; };
      recognition.start();
    };

    const nextWord = () => {
      play8BitSfx('click');
      if (currentWord.value) {
        recordWordStudied(currentWord.value.word);
        recordActivityLog({
          mode: '📖 單字溫習',
          detail: `${currentWord.value.word} (${currentWord.value.meaning || ''})`,
          result: '已溫習',
          isSuccess: true,
          wordDelta: 1
        });
      }
      studyFeedback.value = '';
      if (currentIndex.value < wordList.value.length - 1) {
        currentIndex.value++;
      } else {
        currentIndex.value = 0;
      }
    };

    const startBossBattle = () => {
      if (wordList.value.length === 0) return;
      bossHp.value = 100;
      playerHp.value = 100;
      bossQuestionIndex.value = 0;
      bossGameState.value = 'playing';
      combatMsg.value = '';
      bossTypedWord.value = '';
      lastRecognizedLetter.value = '';

      bossQuizList.value = shuffle([...wordList.value]).map(w => {
        const target = w.word.trim();
        const hintChars = target.split('').map((char, index) => {
          if (char === ' ') return '  ';
          if (index === 0) return char;
          return '_ ';
        }).join('');

        return {
          word: target,
          meaning: w.meaning,
          sentence: w.sentence,
          hint: hintChars
        };
      });

      startBossTimer();
    };

    const onWritingStart = () => {
      isWritingActive.value = true;
    };

    const onWritingEnd = (letter) => {
      isWritingActive.value = false;
      if (letter) {
        bossTypedWord.value += letter;
        lastRecognizedLetter.value = letter;
      }
    };

    const onUpdateTypedWord = (val) => {
      bossTypedWord.value = val;
    };

    const addSpaceToBossWord = () => {
      if (bossTypedWord.value.length > 0 && !bossTypedWord.value.endsWith(' ')) {
        bossTypedWord.value += ' ';
        play8BitSfx('click');
      }
    };

    const backspaceBossWord = () => {
      bossTypedWord.value = bossTypedWord.value.slice(0, -1);
      play8BitSfx('click');
    };

    const clearBossWord = () => {
      bossTypedWord.value = '';
      play8BitSfx('click');
    };

    const startBossTimer = () => {
      clearInterval(timerInterval);
      timer.value = CONFIG.MAX_BOSS_TIME;
      timerInterval = setInterval(() => {
        if (!isWritingActive.value && !isRecognizing.value) {
          timer.value--;
          if (timer.value <= 0) {
            handleBossTimeout();
          }
        }
      }, 1000);
    };

    const triggerShake = () => {
      isShaking.value = true;
      setTimeout(() => { isShaking.value = false; }, 400);
    };

    const handleBossTimeout = () => {
      play8BitSfx('hit');
      triggerShake();
      recordWrongWord(currentBossQuestion.value);
      playerHp.value = Math.max(0, playerHp.value - 20);
      combatMsg.value = `⏰ 時間到！正確單字是 "${currentBossQuestion.value.word}" (-20 HP)`;
      combatMsgColor.value = 'text-rose-600';
      speak(currentBossQuestion.value.word);
      checkBattleStatus(false);
    };

    const submitBossAnswer = () => {
      if (bossGameState.value !== 'playing') return;
      const input = bossTypedWord.value.trim().toLowerCase().replace(/\s+/g, ' ');
      const target = currentBossQuestion.value.word.trim().toLowerCase().replace(/\s+/g, ' ');

      if (input === target) {
        play8BitSfx('coin');
        const damage = Math.ceil(100 / bossQuizList.value.length);
        bossHp.value = Math.max(0, bossHp.value - damage);
        combatMsg.value = `🎯 爆擊！對巨龍造成 ${damage} 點傷害！`;
        combatMsgColor.value = 'text-emerald-700';
        speak('Great!');
        recordWordStudied(currentBossQuestion.value.word);
        reduceWrongWord(currentBossQuestion.value.word);
        checkBattleStatus(true);
      } else {
        play8BitSfx('hit');
        triggerShake();
        recordWrongWord(currentBossQuestion.value);
        playerHp.value = Math.max(0, playerHp.value - 15);
        combatMsg.value = `💥 拼寫錯誤（請修正上方紅字）！受到衝擊 -15 HP！`;
        combatMsgColor.value = 'text-rose-600';
        if (playerHp.value <= 0) checkBattleStatus(false);
      }
    };

    const startBossVoiceAttack = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      isListening.value = true;

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
        const target = currentBossQuestion.value.word.toLowerCase().replace(/[^a-z0-9 ]/g, '');

        if (spoken === target || spoken.includes(target)) {
          play8BitSfx('coin');
          const damage = Math.ceil(100 / bossQuizList.value.length);
          bossHp.value = Math.max(0, bossHp.value - damage);
          combatMsg.value = `🎤 音波斬擊成功！造成 ${damage} 點傷害！`;
          combatMsgColor.value = 'text-purple-700';
          speak('Awesome!');
          recordWordStudied(currentBossQuestion.value.word);
          checkBattleStatus(true);
        } else {
          play8BitSfx('hit');
          combatMsg.value = `聽到的是 "${spoken}"，不太對喔！`;
          combatMsgColor.value = 'text-rose-600';
        }
      };
      recognition.onend = () => { isListening.value = false; };
      recognition.start();
    };

    const checkBattleStatus = (isCorrect) => {
      if (bossHp.value <= 0) {
        clearInterval(timerInterval);
        bossGameState.value = 'victory';
        play8BitSfx('victory');
        recordBossVictory();
        if (window.confetti) {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        }
        speak('Victory! You are a master!');
        return;
      }

      if (playerHp.value <= 0) {
        clearInterval(timerInterval);
        bossGameState.value = 'gameover';
        recordActivityLog({
          mode: '⚔️ 決戰 Boss',
          detail: `挑戰巨龍失敗 (${selectedUnit.value}，第 ${bossQuestionIndex.value + 1} 題)`,
          result: '挑戰失敗',
          isSuccess: false,
          wordDelta: 0
        });
        speak('Game over! Try again!');
        return;
      }

      if (isCorrect) {
        setTimeout(() => {
          bossTypedWord.value = '';
          combatMsg.value = '';
          if (bossQuestionIndex.value < bossQuizList.value.length - 1) {
            bossQuestionIndex.value++;
            startBossTimer();
          } else {
            clearInterval(timerInterval);
            if (bossHp.value <= 25) {
              bossGameState.value = 'victory';
              play8BitSfx('victory');
              recordBossVictory();
              if (window.confetti) confetti();
            } else {
              bossGameState.value = 'gameover';
            }
          }
        }, 1000);
      }
    };

    onMounted(() => {
      initData();
    });

    onUnmounted(() => {
      clearInterval(timerInterval);
    });

    return {
      users, currentUser, currentUserId, todayWordCount, showProfileModal, showPracticeModal,
      switchUser, onSaveUserSettings, onAddUser, onDeleteUser, onPracticeComplete, onPracticeError,
      currentBookWrongWordsCount, currentWordWrongCount, startWeaknessTraining, clearWrongWords,
      allAvailableBooks, visibleBookList, isLoading, allRawWords, wordList,
      selectedUnit, unitList, selectedBookId, currentIndex, currentRate,
      stars, currentMode, borderTheme, trialList, trialIndex, trialFeedback,
      trialFeedbackColor, scrambledPool, spelledLetters, isListening,
      studyFeedback, studyFeedbackColor, bossGameState, bossHp, playerHp,
      timer, isShaking, combatMsg, combatMsgColor, bossQuizList,
      bossQuestionIndex, bossTypedWord, currentWord, currentTrialWord,
      currentBossQuestion, maskedSentence, isRecognizing, isWritingActive,
      lastRecognizedLetter, loadWords, onBookChange, onUnitChange, setRate,
      speak, setMode, nextWord, checkListenAnswer, pickLetter, removeLetter,
      resetSpelling, checkSpelling, startListeningStudy, startBossBattle,
      onWritingStart, onWritingEnd, onUpdateTypedWord, addSpaceToBossWord,
      backspaceBossWord, clearBossWord, submitBossAnswer, startBossVoiceAttack
    };
  }
});

app.mount('#app');
