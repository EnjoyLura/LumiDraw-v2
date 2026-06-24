// 积分规则
const config = require('../../utils/config');
Page({
  data: {
    earnRules: [
      { icon: '👤', label: '新用户注册', points: '+100', desc: '注册即送' },
      { icon: '✓', label: '每日签到', points: '+10', desc: '连续签到额外奖励' },
      { icon: '📤', label: '分享作品', points: '+3', desc: '每日最多30积分' },
      { icon: '👥', label: '邀请好友', points: '+50', desc: '好友注册后双方获得' },
      { icon: '♛', label: '购买会员', points: '+200', desc: '首次开通赠送' }
    ],
    spendRules: [{ icon: '✦', label: 'AI生图', points: '-6~20', desc: '按模型计费' }],
    milestones: config.CHECKIN_MILESTONES
  }
});