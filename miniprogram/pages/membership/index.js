// 会员中心页
const util = require('../../utils/util');
const config = require('../../utils/config');

Page({
  data: {
    plans: config.MEMBER_PLANS,
    selectedPlan: 1,
    benefits: [
      { icon: '💰', title: '每日积分', desc: '每天领取50积分', color: '#6FD4B0' },
      { icon: '⭐', title: '签到加成', desc: '签到积分翻倍', color: '#5B9FE8' },
      { icon: '♛', title: '专属徽章', desc: 'VIP身份标识', color: '#B8A5E3' },
      { icon: '⚡', title: '优先生成', desc: '高峰期免排队', color: '#FFB59A' }
    ]
  },

  onSelectPlan(e) {
    this.setData({ selectedPlan: parseInt(e.currentTarget.dataset.index) });
  },

  onSubscribe() {
    const plan = this.data.plans[this.data.selectedPlan];
    util.showToast('开通' + plan.name + '会员（支付功能即将上线）');
  }
});
