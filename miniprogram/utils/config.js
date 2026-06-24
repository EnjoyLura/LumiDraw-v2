// 全局常量配置
module.exports = {
  // 云环境 ID
  CLOUD_ENV_ID: 'cloud1-d9g2e4d5cedc3365',

  // AI 模型配置
  MODELS: [
    {
      id: 'nano-banana-2',
      name: 'Nano Banana 2',
      desc: '速度极快·性价比高',
      tags: ['快速', '全能'],
      cost: 8,
      badge: '性价比',
      badgeColor: '#6FD4B0'
    },
    {
      id: 'gpt-image-2',
      name: 'GPT Image 2',
      desc: '画质细腻·理解力强',
      tags: ['写实', '高清'],
      cost: 15,
      badge: '推荐',
      badgeColor: '#5B9FE8'
    },
    {
      id: 'nano-banana-pro',
      name: 'Nano Banana Pro',
      desc: '进阶版本·质量更高',
      tags: ['高质量', '进阶'],
      cost: 12,
      badge: 'NEW',
      badgeColor: '#FFA8B8'
    },
    {
      id: 'seedream-4.5',
      name: 'Seedream 4.5',
      desc: '高保真·4K支持',
      tags: ['高保真', '4K'],
      cost: 10,
      badge: '',
      badgeColor: ''
    }
  ],

  // 精度配置
  QUALITIES: [
    { label: '全高清1K', desc: '1024px' },
    { label: '超清2K', desc: '2048px' },
    { label: '超高清4K', desc: '4096px' }
  ],

  // 画面比例
  RATIOS: [
    { label: '1:1', w: 1, h: 1 },
    { label: '3:4', w: 3, h: 4 },
    { label: '4:3', w: 4, h: 3 },
    { label: '16:9', w: 16, h: 9 },
    { label: '9:16', w: 9, h: 16 }
  ],

  // 生成数量
  COUNTS: [1, 2, 3, 4],

  // 充值档位
  RECHARGE_TIERS: [
    { price: 6, credits: 60, bonus: 0 },
    { price: 18, credits: 180, bonus: 10 },
    { price: 30, credits: 300, bonus: 30 },
    { price: 68, credits: 680, bonus: 100, popular: true },
    { price: 128, credits: 1280, bonus: 280 }
  ],

  // 会员套餐
  MEMBER_PLANS: [
    { name: '月卡', price: 18, days: 30, dailyCredits: 50 },
    { name: '季卡', price: 48, days: 90, dailyCredits: 50, recommend: true },
    { name: '年卡', price: 168, days: 365, dailyCredits: 50 }
  ],

  // 积分规则
  CREDITS_RULES: {
    newUser: 100,
    dailyCheckin: 10,
    inviteFriend: 50,
    shareWork: 3,
    reversePrompt: 5
  },

  // 签到里程碑
  CHECKIN_MILESTONES: [
    { days: 3, reward: 20 },
    { days: 7, reward: 50 },
    { days: 14, reward: 100 },
    { days: 30, reward: 300 }
  ],

  // 风格类型
  STYLES: ['赛博朋克', '赛璐碌', '黑白', '国风', '油画', '水彩', '二次元', '写实', '3D', '像素', '蒸汽波', '极简', '梦幻', '暗黑', '复古'],

  // 分类
  CATEGORIES: ['全部', '二次元', '风景', '建筑', '表情包', '写实', '国风', '人像', '动物', '抽象']
};
