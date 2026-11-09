export default {
  name: 'StudyMode',
  props: {
    word: Object,
    currentRate: Number,
    isListening: Boolean,
    feedback: String,
    feedbackColor: String
  },
  emits: ['set-rate', 'speak', 'voice-challenge', 'next'],
  template: `
    <div>
      <div class="flex justify-end mb-3">
        <div class="flex gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 text-xs font-bold">
          <button @click="$emit('set-rate', 0.5)" :class="currentRate === 0.5 ? 'bg-amber-500 text-white' : 'text-gray-600'" class="px-2 py-1 rounded-lg">🐢 0.5x</button>
          <button @click="$emit('set-rate', 1.0)" :class="currentRate === 1.0 ? 'bg-amber-500 text-white' : 'text-gray-600'" class="px-2 py-1 rounded-lg">🚶 1.0x</button>
          <button @click="$emit('set-rate', 1.25)" :class="currentRate === 1.25 ? 'bg-amber-500 text-white' : 'text-gray-600'" class="px-2 py-1 rounded-lg">🐰 1.25x</button>
        </div>
      </div>

      <div v-if="word" class="space-y-4 text-center">
        <div class="bg-amber-50 border border-amber-200 rounded-3xl p-5 shadow-inner">
          <div class="flex items-center justify-center gap-3">
            <h1 class="text-4xl sm:text-5xl font-black text-blue-900 tracking-wide">{{ word.word }}</h1>
            <button @click="$emit('speak', word.word)" class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-2.5 rounded-2xl shadow transition">
              🔊
            </button>
          </div>
          <p class="text-2xl font-bold text-gray-800 mt-2">{{ word.meaning }}</p>
        </div>

        <div @click="$emit('speak', word.sentence)" class="bg-blue-50 hover:bg-blue-100/70 border border-blue-200 rounded-2xl p-4 text-left cursor-pointer transition">
          <div class="flex justify-between items-start">
            <p class="text-lg font-medium text-blue-950 pr-6">“ {{ word.sentence }} ”</p>
            <span class="text-blue-500 text-sm">🔊</span>
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ word.sentence_cn }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button @click="$emit('speak', word.word)" class="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-3.5 rounded-xl shadow flex items-center justify-center gap-1">
            <span>🔊 聽發音</span>
            <span class="hidden sm:inline text-xs opacity-75">(Space)</span>
          </button>
          <button @click="$emit('voice-challenge')" :class="isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600 active:scale-95'" class="text-white font-bold py-3.5 rounded-xl shadow flex items-center justify-center gap-1">
            <span>🎤 {{ isListening ? '傾聽中...' : '開口挑戰' }}</span>
            <span class="hidden sm:inline text-xs opacity-75">(R)</span>
          </button>
        </div>

        <div v-if="feedback" class="text-lg font-black" :class="feedbackColor">{{ feedback }}</div>

        <button @click="$emit('next')" class="w-full bg-amber-400 hover:bg-amber-500 active:scale-98 py-3.5 rounded-xl font-black text-lg text-amber-950 shadow">
          下一題 ➔
        </button>
      </div>
    </div>
  `
};
