const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

const app = createApp({
  components: {
    ProfileBar,
    NavBar,
    BookUnitSelector,
    UserProfileModal,
    StudyMode,
    ListenTrial,
    SpellTrial,
    BossBattle
  },
  setup() {
    // 使用者歷程與狀態
    const users = ref(StorageService.loadUsers());
    const currentUserId = ref(StorageService.loadActiveUserId());
    const showProfileModal = ref(false);

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

    const saveUserData = () => {
      StorageService.saveUsers(users.value);
    };
    
    // PC 鍵盤即時輸入綁定
    const onUpdateTypedWord = (val) => {
      bossTypedWord.value = val;
    };
    
    // 書本與單字資料
    const allAvailableBooks = ref([]);
    const allRawWords = ref([]);
    const wordList = ref([]);
    const selectedBookId = ref('');
    const selectedUnit = ref('ALL');
    const isLoading = ref(true);

    // 依據目前小孩「指定課本」過濾可見清單
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

    // 試煉關卡狀態
    const trialList = ref([]);
    const trialIndex = ref(0);
    const trialFeedback = ref('');
    const trialFeedbackColor = ref('text-green-600');

    // 拼字狀態
    const scrambledPool = ref([]);
    const spelledLetters = ref([]);

    // 語音辨識狀態
    const isListening = ref(false);
    const studyFeedback = ref('');
    const studyFeedbackColor = ref('text-green-600');

    // Boss 戰狀態
    const bossGameState = ref('playing');
    const bossHp = ref(100);
    const playerHp = ref(100);
    const timer = ref(CONFIG.MAX_BOSS_TIME);
    let timerInterval = null;
    const isShaking = ref(false);
    const combatMsg = ref('');
    const combatMsgColor = ref('text-green-600');
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

    // 已修復語法錯誤的句子遮罩
    const maskedSentence = computed(() => {
      if (!currentBossQuestion.value) return '';
      const s = currentBossQuestion.value.sentence || '';
      const w = currentBossQuestion.value.word || '';
      const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');
      return s.replace(regex, '______');
    });

    const borderTheme = computed(() => {
      switch (currentMode.value) {
        case 'trial_listen': return 'border-blue-400';
        case 'trial_spell': return 'border-emerald-400';
        case 'boss': return 'border-red-500';
        default: return 'border-amber-300';
      }
    });

    // 切換小孩勇者
    const switchUser = (userId) => {
      currentUserId.value = userId;
      StorageService.saveActiveUserId(userId);
      if (visibleBookList.value.length > 0) {
        const found = visibleBookList.value.find(b => b.id === selectedBookId.value);
        if (!found) {
          selectedBookId.value = visibleBookList.value[0].id;
          loadWords(selectedBookId.value);
        }
      }
    };

    const onSaveUserSettings = (updated) => {
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
            loadWords(selectedBookId.value);
          }
        }
      }
    };

    const onAddUser = (newU) => {
      const newId = 'user_' + Date.now();
      users.value.push({
        id: newId,
        name: newU.name,
        avatar: newU.avatar,
        assignedBookIds: [],
        stars: 0,
        studiedWords: {},
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
        saveUserData();
        switchUser(currentUserId.value);
        showProfileModal.value = false;
      }
    };

    // 歷程數據累加
    const recordWordStudied = (word) => {
      if (!word) return;
      if (!currentUser.value.studiedWords) currentUser.value.studiedWords = {};
      currentUser.value.studiedWords[word] = (currentUser.value.studiedWords[word] || 0) + 1;
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
      saveUserData();
    };

    // 資料載入
    const initData = async () => {
      isLoading.value = true;
      try {
        await loadWords();
      } catch (e) {
        console.error(e);
      }

      // 背景靜默讀取 _CONFIG_ 書本
      try {
        const resBooks = await fetch(`${CONFIG.GAS_URL}?action=getBooks`);
        const books = await resBooks.json();
        if (Array.isArray(books) && books.length > 0) {
          allAvailableBooks.value = books;
          if (visibleBookList.value.length > 0 && !selectedBookId.value) {
            selectedBookId.value = visibleBookList.value[0].id;
          }
        }
      } catch (e) {
        allAvailableBooks.value = [{ name: '預設單字本', id: 'default' }];
      }
    };

    const loadWords = async (bookId = '') => {
      isLoading.value = true;
      try {
        const targetUrl = bookId ? `${CONFIG.GAS_URL}?action=getWords&bookId=${bookId}` : CONFIG.GAS_URL;
        const res = await fetch(targetUrl);
        const data = await res.json();
        allRawWords.value = Array.isArray(data) ? data.filter(item => item.word && String(item.word).trim() !== '') : [];
        selectedUnit.value = 'ALL';
        onUnitChange();
      } catch (e) {
        console.error('載入失敗：', e);
        if (allRawWords.value.length === 0) {
          alert('無法載入單字，請檢查網路連線或 Apps Script 部署網址！');
        }
      } finally {
        isLoading.value = false;
      }
    };

    const onBookChange = (event) => {
      const bookId = event && event.target ? event.target.value : event;
      selectedBookId.value = bookId;
      loadWords(bookId);
    };

    const onUnitChange = (event) => {
      const unit = event && event.target ? event.target.value : event;
      if (unit) selectedUnit.value = unit;
      if (selectedUnit.value === 'ALL') {
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

    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    const speak = (text) => playSpeech(text, currentRate.value);

    const setRate = (r) => {
      currentRate.value = r;
      if (currentWord.value) speak(currentWord.value.word);
    };

    const setMode = (mode) => {
      currentMode.value = mode;
      clearInterval(timerInterval);
      trialFeedback.value = '';

      if (mode === 'trial_listen') initListenTrial();
      else if (mode === 'trial_spell') initSpellTrial();
      else if (mode === 'boss') startBossBattle();
    };

    // 聽力試煉
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
        trialFeedback.value = '🎉 聽得真準！太棒了！ (+1 ⭐)';
        trialFeedbackColor.value = 'text-green-600';
        speak('Great job!');
        setTimeout(() => {
          trialFeedback.value = '';
          if (trialIndex.value < trialList.value.length - 1) {
            trialIndex.value++;
            speak(currentTrialWord.value.word);
          } else {
            trialFeedback.value = '🏆 恭喜通過本單元聽力試煉！';
            if (window.confetti) confetti();
          }
        }, CONFIG.FEEDBACK_DELAY);
      } else {
        trialFeedback.value = '再仔細聽一次發音看看～';
        trialFeedbackColor.value = 'text-orange-500';
        speak(currentTrialWord.value.word);
      }
    };

    // 拼字試煉
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
      item.used = true;
      spelledLetters.value.push(item.letter);
    };

    const removeLetter = (idx) => {
      const removed = spelledLetters.value.splice(idx, 1)[0];
      const found = scrambledPool.value.find(p => p.letter === removed && p.used);
      if (found) found.used = false;
    };

    const resetSpelling = () => {
      spelledLetters.value = [];
      scrambledPool.value.forEach(p => p.used = false);
    };

    const checkSpelling = () => {
      const spelled = spelledLetters.value.join('');
      const target = currentTrialWord.value.word.trim();
      const isCorrect = (spelled.toLowerCase() === target.toLowerCase());
      recordSpellResult(isCorrect);

      if (isCorrect) {
        trialFeedback.value = '🎯 拼字完全正確！ (+2 ⭐)';
        trialFeedbackColor.value = 'text-green-600';
        speak('Awesome!');
        setTimeout(() => {
          trialFeedback.value = '';
          if (trialIndex.value < trialList.value.length - 1) {
            trialIndex.value++;
            setupSpellingLetters();
          } else {
            trialFeedback.value = '🏆 恭喜通過拼字試煉！';
            if (window.confetti) confetti();
          }
        }, CONFIG.FEEDBACK_DELAY);
      } else {
        trialFeedback.value = '拼法不太對，再試一次看看～';
        trialFeedbackColor.value = 'text-orange-500';
      }
    };

    // 溫習語音辨識
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
          studyFeedback.value = '🌟 太棒了！發音非常標準！';
          studyFeedbackColor.value = 'text-green-600';
          speak('Awesome!');
          recordWordStudied(currentWord.value.word);
        } else {
          studyFeedback.value = `聽到的是 "${spoken}"，再試一次！`;
          studyFeedbackColor.value = 'text-orange-500';
        }
      };
      recognition.onend = () => { isListening.value = false; };
      recognition.start();
    };

    const nextWord = () => {
      if (currentWord.value) {
        recordWordStudied(currentWord.value.word);
      }
      studyFeedback.value = '';
      if (currentIndex.value < wordList.value.length - 1) {
        currentIndex.value++;
      } else {
        currentIndex.value = 0;
      }
    };

    // Boss 戰邏輯
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

    const addSpaceToBossWord = () => {
      if (bossTypedWord.value.length > 0 && !bossTypedWord.value.endsWith(' ')) {
        bossTypedWord.value += ' ';
        playClickBeep(520);
      }
    };

    const backspaceBossWord = () => {
      bossTypedWord.value = bossTypedWord.value.slice(0, -1);
    };

    const clearBossWord = () => {
      bossTypedWord.value = '';
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
      triggerShake();
      playerHp.value = Math.max(0, playerHp.value - 20);
      combatMsg.value = `⏰ 時間到！正確單字是 "${currentBossQuestion.value.word}"，受到反擊 -20 HP！`;
      combatMsgColor.value = 'text-red-500';
      speak(currentBossQuestion.value.word);
      checkBattleStatus(false);
    };

    const submitBossAnswer = () => {
      if (bossGameState.value !== 'playing') return;
      const input = bossTypedWord.value.trim().toLowerCase().replace(/\s+/g, ' ');
      const target = currentBossQuestion.value.word.trim().toLowerCase().replace(/\s+/g, ' ');

      if (input === target) {
        const damage = Math.ceil(100 / bossQuizList.value.length);
        bossHp.value = Math.max(0, bossHp.value - damage);
        combatMsg.value = `🎯 完美背對單字！對 Boss 造成 ${damage} 點重傷！`;
        combatMsgColor.value = 'text-green-600';
        speak('Great!');
        recordWordStudied(currentBossQuestion.value.word);
        checkBattleStatus(true);
      } else {
        triggerShake();
        playerHp.value = Math.max(0, playerHp.value - 15);
        combatMsg.value = `💥 拼寫錯誤（"${input}"）！受到 Boss 衝擊 -15 HP！再試一次！`;
        combatMsgColor.value = 'text-red-500';
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
          const damage = Math.ceil(100 / bossQuizList.value.length);
          bossHp.value = Math.max(0, bossHp.value - damage);
          combatMsg.value = `🎤 口說背誦成功！發動音波重擊 ${damage} 點！`;
          combatMsgColor.value = 'text-purple-600';
          speak('Awesome!');
          recordWordStudied(currentBossQuestion.value.word);
          checkBattleStatus(true);
        } else {
          combatMsg.value = `聽到的是 "${spoken}"，不太對喔！`;
          combatMsgColor.value = 'text-orange-500';
        }
      };
      recognition.onend = () => { isListening.value = false; };
      recognition.start();
    };

    const checkBattleStatus = (isCorrect) => {
      if (bossHp.value <= 0) {
        clearInterval(timerInterval);
        bossGameState.value = 'victory';
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
      users,
      currentUser,
      currentUserId,
      showProfileModal,
      switchUser,
      onSaveUserSettings,
      onAddUser,
      onDeleteUser,
      allAvailableBooks,
      visibleBookList,
      isLoading,
      allRawWords,
      wordList,
      selectedUnit,
      unitList,
      selectedBookId,
      currentIndex,
      currentRate,
      stars,
      currentMode,
      borderTheme,
      trialList,
      trialIndex,
      trialFeedback,
      trialFeedbackColor,
      scrambledPool,
      spelledLetters,
      isListening,
      studyFeedback,
      studyFeedbackColor,
      bossGameState,
      bossHp,
      playerHp,
      timer,
      isShaking,
      combatMsg,
      combatMsgColor,
      bossQuizList,
      bossQuestionIndex,
      bossTypedWord,
      currentWord,
      currentTrialWord,
      currentBossQuestion,
      maskedSentence,
      isRecognizing,
      isWritingActive,
      lastRecognizedLetter,
      loadWords,
      onBookChange,
      onUnitChange,
      setRate,
      speak,
      setMode,
      nextWord,
      checkListenAnswer,
      pickLetter,
      removeLetter,
      resetSpelling,
      checkSpelling,
      startListeningStudy,
      startBossBattle,
      onWritingStart,
      onWritingEnd,
      onUpdateTypedWord,
      addSpaceToBossWord,
      backspaceBossWord,
      clearBossWord,
      submitBossAnswer,
      startBossVoiceAttack
    };
  }
});

app.mount('#app');
