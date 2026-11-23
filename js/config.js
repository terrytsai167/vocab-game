const CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/AKfycbw_61uHBQse2lOoBZxNYcgBV4QHewwArZoGfi6a4MkcXE-MfdPJXataE3F70_fb_u4B/exec',
  MAX_BOSS_TIME: 45,
  FEEDBACK_DELAY: 1200,
  STORAGE_KEY_USERS: 'vocab_island_users_v1',
  STORAGE_KEY_ACTIVE_USER: 'vocab_island_active_user_v1'
};


// ==================== 勇者裝備屋與寵物扭蛋圖鑑設定 ====================
const RPG_CATALOG = {
  weapons: [
    { id: 'wp_wood', name: '見習木劍', icon: '🗡️', price: 0, atkMultiplier: 1.0, desc: '初始武器（基礎 1.0x 攻擊力）' },
    { id: 'wp_silver', name: '白銀長劍', icon: '⚔️', price: 30, atkMultiplier: 1.25, desc: '決戰 Boss 攻擊力 +25%！' },
    { id: 'wp_flame', name: '烈焰聖劍', icon: '🔥', price: 65, atkMultiplier: 1.5, desc: '決戰 Boss 攻擊力 +50%，斬龍如切菜！' },
    { id: 'wp_dragon', name: '屠龍神兵', icon: '⚡', price: 120, atkMultiplier: 2.0, desc: '傳說神兵！Boss 戰雙倍（2.0x）爆擊傷害！' }
  ],
  shields: [
    { id: 'sh_none', name: '布衣護腕', icon: '👕', price: 0, dmgReduction: 0, extraTime: 0, desc: '初始防具（無減傷效果）' },
    { id: 'sh_iron', name: '精鋼圓盾', icon: '🛡️', price: 25, dmgReduction: 0.35, extraTime: 0, desc: 'Boss 戰答錯/超時扣血減少 35%' },
    { id: 'sh_dragon', name: '龍鱗聖盾', icon: '🔰', price: 60, dmgReduction: 0.5, extraTime: 5, desc: 'Boss 戰扣血減半，每題作答時間 +5 秒！' },
    { id: 'sh_aegis', name: '星辰神盾', icon: '💠', price: 110, dmgReduction: 0.7, extraTime: 10, desc: '減傷 70%，每題作答時間 +10 秒！' }
  ],
  gachaCost: 25,
  pets: [
    { id: 'pet_slime', name: '果凍史萊姆', icon: '🟢', rarity: 'R', bonusStar: 1, desc: '可愛夥伴，試煉通關額外 +1 ★' },
    { id: 'pet_chick', name: '黃金小雞', icon: '🐥', rarity: 'R', bonusStar: 1, desc: '勤奮小幫手，試煉通關額外 +1 ★' },
    { id: 'pet_fox', name: '赤焰小狐狸', icon: '🦊', rarity: 'SR', bonusStar: 2, desc: '稀有夥伴，試煉與斬龍額外 +2 ★' },
    { id: 'pet_owl', name: '智慧貓頭鷹', icon: '🦉', rarity: 'SR', bonusStar: 2, desc: '博學導師，試煉與斬龍額外 +2 ★' },
    { id: 'pet_dragon', name: '迷你噴火龍', icon: '🐲', rarity: 'SSR', bonusStar: 3, desc: '傳說神獸！試煉與斬龍額外 +3 ★' },
    { id: 'pet_unicorn', name: '星光獨角獸', icon: '🦄', rarity: 'SSR', bonusStar: 3, desc: '傳說神獸！試煉與斬龍額外 +3 ★' }
  ]
};


// ==================== 關卡 Boss 進化圖鑑設定 ====================
const BOSS_CATALOG = [
  {
    id: 'boss_slime',
    name: '史萊姆王',
    icon: '🟢',
    tier: '短單元守護者 (≤5 題)',
    reward: 10,
    hpColor: 'bg-emerald-500',
    desc: '彈跳果凍王，適合快速熱身短單元！'
  },
  {
    id: 'boss_gargoyle',
    name: '石像鬼守衛',
    icon: '🗿',
    tier: '中階試煉者 (6～10 題)',
    reward: 12,
    hpColor: 'bg-sky-500',
    desc: '古老神殿的石翼守衛，考驗穩定記憶力。'
  },
  {
    id: 'boss_dragon',
    name: '暗黑單字巨龍',
    icon: '🐉',
    tier: '長單元霸主 (≥11 題)',
    reward: 15,
    hpColor: 'bg-rose-500',
    desc: '盤踞字島深處的噴火巨龍，長單元最終大魔王！'
  },
  {
    id: 'boss_nightmare',
    name: '夢魘魔王',
    icon: '👿',
    tier: '弱點特訓專屬魔王',
    reward: 20,
    hpColor: 'bg-purple-600',
    desc: '專門吞噬錯題的夢魘魔王！擊敗可獲雙倍 +20 ★ 獎勵！'
  }
];

// ==================== 連勝里程碑稱號設定 ====================
const STREAK_TITLES = [
  { minDays: 14, title: '字島大賢者', icon: '👑', badgeClass: 'bg-amber-300 text-rose-800 border-amber-500' },
  { minDays: 7, title: '單字騎士', icon: '🛡️', badgeClass: 'bg-purple-300 text-purple-950 border-purple-500' },
  { minDays: 3, title: '見習劍士', icon: '⚔️', badgeClass: 'bg-sky-300 text-sky-950 border-sky-500' },
  { minDays: 0, title: '新手冒險者', icon: '🌱', badgeClass: 'bg-slate-700 text-emerald-200 border-slate-500' }
];

const DAILY_TREASURE_CONFIG = {
  targetWords: 10,
  doubleBonusDurationMs: 5 * 60 * 1000 // 5 分鐘雙倍星幣券
};
