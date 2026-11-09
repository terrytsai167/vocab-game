// Google 手寫識別 API 介接
export async function recognizeInk(strokes, width = 600, height = 140) {
  if (!strokes || strokes.length === 0) return '';
  const payload = {
    options: 'enable_pre_space',
    requests: [{
      writing_guide: {
        writing_area_width: width,
        writing_area_height: height
      },
      ink: strokes,
      language: 'en'
    }]
  };

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
  return '';
}
