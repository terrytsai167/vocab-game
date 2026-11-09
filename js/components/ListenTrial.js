export default {
  name: 'ListenTrial',
  props: {
    word: Object,
    trialIndex: Number,
    totalTrials: Number,
    feedback: String,
    feedbackColor: String
  },
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
          <button @click="$emit('speak', word.word)" class="bg-blue-600 hover:bg-blue-700 active:scale-90 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-xl transition">
            🔊
          </button>
          <span class="text-xs font-bold text-blue-600 mt-2">點擊播放發音</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button v-for="(opt, idx) in word.options" :key="idx"
                  @click="$emit('check', opt)"
                  class="bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400 active:scale-95 p-3.5 rounded-2xl text-base sm:text-lg font-bold text-slate-700 shadow-sm transition">
            {{ opt }}
          </button>
        </div>

        <div v-if="feedback" class="text-lg font-black" :class="feedbackColor">{{ feedback }}</div>
      </div>
    </div>
  `
};
