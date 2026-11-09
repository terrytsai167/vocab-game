export default {
  name: 'NavBar',
  props: {
    currentMode: String,
    stars: Number
  },
  emits: ['set-mode'],
  template: `
    <div class="flex flex-wrap justify-between items-center mb-3 pb-3 border-b border-gray-100 gap-2">
      <div class="flex flex-wrap gap-1.5 sm:gap-2">
        <button @click="$emit('set-mode', 'study')" 
                :class="currentMode === 'study' ? 'bg-amber-400 text-amber-950 font-black shadow' : 'bg-gray-100 text-gray-500'"
                class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition">
          📖 單字溫習
        </button>
        <button @click="$emit('set-mode', 'trial_listen')" 
                :class="currentMode === 'trial_listen' ? 'bg-blue-500 text-white font-black shadow' : 'bg-gray-100 text-gray-500'"
                class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition">
          👂 聽力試煉
        </button>
        <button @click="$emit('set-mode', 'trial_spell')" 
                :class="currentMode === 'trial_spell' ? 'bg-emerald-500 text-white font-black shadow' : 'bg-gray-100 text-gray-500'"
                class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition">
          🧩 拼字試煉
        </button>
        <button @click="$emit('set-mode', 'boss')" 
                :class="currentMode === 'boss' ? 'bg-red-500 text-white font-black shadow animate-pulse' : 'bg-gray-100 text-gray-500'"
                class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition">
          ⚔️ 決戰 Boss
        </button>
      </div>

      <div class="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full text-amber-900 font-black text-sm">
        <span>⭐ 星幣:</span>
        <span>{{ stars }}</span>
      </div>
    </div>
  `
};
