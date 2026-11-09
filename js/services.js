// 語音朗讀與音效服務
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

// Google 免費手寫辨識 API 呼叫
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
    console.warn('手寫辨識微延遲', e);
  }
  return '';
}
