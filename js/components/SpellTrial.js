export default {
  name: 'SpellTrial',
  props: {
    word: Object,
    trialIndex: Number,
    totalTrials: Number,
    spelledLetters: Array,
    scrambledPool: Array,
    feedback: String,
    feedbackColor: String
  },
  emits: ['speak', 'pick-letter', 'remove-letter', 'reset', 'check'],
  template: `
    <div>
      <div class="text-center mb-4">
        <span class="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">關卡：拼字積木</span>
        <h2 class="text-xl sm:text-2xl font-black text-slate-800 mt-1">拼出正確英文單字！</h2>
        <p class="text-xs text-gray-400 mt-0.5">進度：{{ trialIndex + 1 }} / {{ totalTrials }}</p>
      </div>

      <div v-if="word" class="space-y-4 text-center">
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex justify-between items-center px-5">
          <span class="text-xl sm:text-2xl font-black text-emerald-950">{{ word.meaning }}</span>
          <button @click="$emit('speak', word.word)" class="bg-emerald-600 text-white p-2 rounded-xl text-xs font-bold shadow">
            🔊 發音提示
          </button>
        </div>

        <div class="flex flex-wrap justify-center gap-1.5 min-h-[46px] p-2 bg-slate-100 rounded-2xl border-2 border-slate-300">
          <span v-for="(letter, i) in spelledLetters" :key="i"
                @click="$emit('remove-letter', i)"
                class="w-10 h-10 bg-white text-emerald-700 border-2 border-emerald-400 rounded-xl font-black text-lg flex items-center justify-center cursor-pointer shadow-sm active:scale-95">
            {{ letter === ' ' ? '␣' : letter }}
          </span>
        </div>

        <div class="flex flex-wrap justify-center gap-1.5 pt-1">
          <button v-for="(item, idx) in scrambledPool" :key="idx"
                  :disabled="item.used"
                  @click="$emit('pick-letter', item)"
                  :class="item.used ? 'opacity-20 cursor-not-allowed bg-gray-200' : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-90 shadow-md'"
                  class="w-10 h-10 rounded-xl font-black text-lg flex items-center justify-center transition">
            {{ item.letter === ' ' ? '␣' : item.letter }}
          </button>
        </div>

        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <button @click="$emit('reset')" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 rounded-xl text-sm">
            🔄 重新拼湊
          </button>
          <button @click="$emit('check')" class="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl shadow text-sm">
            ✨ 檢查拼字
          </button>
        </div>

        <div v-if="feedback" class="text-lg font-black" :class="feedbackColor">{{ feedback }}</div>
      </div>
    </div>
  `
};
