export default {
  name: 'BookUnitSelector',
  props: {
    bookList: Array,
    selectedBookId: String,
    unitList: Array,
    selectedUnit: String,
    totalWords: Number,
    currentMode: String,
    currentIndex: Number,
    currentWordCount: Number
  },
  emits: ['change-book', 'change-unit'],
  template: `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 bg-amber-50/90 p-2.5 rounded-2xl border border-amber-200 gap-2">
      <div class="flex flex-wrap items-center gap-2">
        <div v-if="bookList.length > 1" class="flex items-center gap-1">
          <span class="text-xs font-black text-amber-900">📘 本冊:</span>
          <select :value="selectedBookId" 
                  @change="$emit('change-book', $event.target.value)"
                  class="bg-white border border-amber-300 text-amber-950 font-bold py-1 px-2 rounded-xl shadow-sm text-xs outline-none focus:ring-2 focus:ring-amber-400">
            <option v-for="b in bookList" :key="b.id" :value="b.id">
              {{ b.name }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-1">
          <span class="text-xs font-black text-amber-900">📚 課次:</span>
          <select :value="selectedUnit" 
                  @change="$emit('change-unit', $event.target.value)"
                  class="bg-white border border-amber-300 text-amber-950 font-bold py-1 px-2.5 rounded-xl shadow-sm text-xs outline-none focus:ring-2 focus:ring-amber-400">
            <option value="ALL">全部 (共 {{ totalWords }} 字)</option>
            <option v-for="u in unitList" :key="u" :value="u">
              {{ u }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="currentMode === 'study' && currentWordCount > 0" class="text-xs font-bold text-amber-800 self-end sm:self-auto">
        {{ currentIndex + 1 }} / {{ currentWordCount }}
      </div>
    </div>
  `
};
