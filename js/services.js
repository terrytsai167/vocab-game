// ==================== 語音與 8-Bit 晶片音效 ====================
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

// 8-Bit 紅白機方波晶片音效
function play8BitSfx(type = 'click') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'coin' || type === 'correct') {
      // 經典吃金幣雙音 (B5 -> E6)
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'hit' || type === 'error') {
      // 受擊低頻鋸齒波
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(65, now + 0.22);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'victory') {
      // 勝利凱旋三連音
      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.50, now + 0.3);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else {
      // 預設方波按鍵聲
      osc.type = 'square';
      osc.frequency.setValueAtTime(620, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (e) {}
}

// 向下相容舊呼叫
function playClickBeep(freq = 520) {
  play8BitSfx('click');
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
        name: 'Terry',
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
