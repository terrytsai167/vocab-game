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
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'hit' || type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(65, now + 0.22);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'victory') {
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
      osc.type = 'square';
      osc.frequency.setValueAtTime(620, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (e) {}
}

function playClickBeep(freq = 520) {
  play8BitSfx('click');
}

// ==================== 頭像圖片自動裁切壓縮 (清晰原圖風格) ====================
function compressAvatarImage(file, outputSize = 128) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('未選擇檔案'));
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;

        const outCanvas = document.createElement('canvas');
        outCanvas.width = outputSize;
        outCanvas.height = outputSize;
        const outCtx = outCanvas.getContext('2d');
        outCtx.imageSmoothingEnabled = true;
        outCtx.imageSmoothingQuality = 'high';
        outCtx.drawImage(img, sx, sy, minSide, minSide, 0, 0, outputSize, outputSize);

        resolve(outCanvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error('圖片讀取失敗'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('檔案讀取失敗'));
    reader.readAsDataURL(file);
  });
}

// ==================== Google 手寫辨識 API ====================
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

// ==================== 雲端 + 本機雙軌歷程管理服務 ====================
let syncDebounceTimer = null;

const StorageService = {
  getDefaultUsers() {
    return [
      {
        id: 'user_1',
        name: 'Terry',
        avatar: '🧙‍♂️',
        assignedBookIds: [],
        lastBookId: '',
        lastUnit: 'ALL',
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

  loadLocalUsers() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY_USERS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return this.getDefaultUsers();
  },

  saveLocalUsers(users) {
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
  },

  async fetchCloudUsers() {
    try {
      const res = await fetch(`${CONFIG.GAS_URL}?action=getUsers`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        this.saveLocalUsers(data);
        return data;
      }
    } catch (e) {
      console.warn('雲端歷程讀取略過，使用本機快取', e);
    }
    return null;
  },

  syncUserToCloud(userObj) {
    if (!userObj) return;
    clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(async () => {
      try {
        await fetch(CONFIG.GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'saveUser',
            user: userObj
          })
        });
      } catch (e) {
        console.warn('雲端歷程背景同步延遲', e);
      }
    }, 1200);
  },

  async deleteUserFromCloud(userId) {
    try {
      await fetch(CONFIG.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'deleteUser',
          userId: userId
        })
      });
    } catch (e) {}
  }
};
