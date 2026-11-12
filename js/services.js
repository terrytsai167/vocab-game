// ==================== 語音與手寫 API ====================
function playSpeech(text, rate = 1.0) {
  if (!text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => 
    v.lang.startsWith('en') && 
    (v.name.includes('Samantha') || v.name.includes('Siri') || v.name.includes('Natural'))
  ) || voices.find(v => v.lang === 'en-US');

  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

function playClickBeep(freq = 520) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}

async function recognizeInk(strokes, width = 600, height = 140) {
  if (!strokes || strokes.length === 0) return '';
  const payload = {
    options: 'enable_pre_space',
    requests: [{
      writing_guide: { writing_area_width: width, writing_area_height: height },
      ink: strokes,
      language: 'en'
    }]
  };

  try {
    const res = await fetch('https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data && data[1] && data[1][0] && data[1][0][1]) {
      const candidate = data[1][0][1][0];
      if (candidate) {
        return candidate.replace(/[^a-zA-Z ']/g, '').toLowerCase();
      }
    }
  } catch (e) {
    console.warn('手寫辨識延遲', e);
  }
  return '';
}

// ==================== 學習歷程 LocalStorage 管理服務 ====================
const StorageService = {
  getDefaultUsers() {
    return [
      {
        id: 'user_1',
        name: '大寶',
        avatar: '🧙‍♂️',
        assignedBookIds: [],
        stars: 0,
        studiedWords: {},
        listenAttempts: 0,
        listenCorrect: 0,
        spellAttempts: 0,
        spellCorrect: 0,
        bossVictories: 0
      }
    ];
  },

  loadUsers() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY_USERS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    const defaults = this.getDefaultUsers();
    this.saveUsers(defaults);
    return defaults;
  },

  saveUsers(users) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {}
  },

  loadActiveUserId() {
    return localStorage.getItem(CONFIG.STORAGE_KEY_ACTIVE_USER) || 'user_1';
  },

  saveActiveUserId(id) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY_ACTIVE_USER, id);
    } catch (e) {}
  }
};
