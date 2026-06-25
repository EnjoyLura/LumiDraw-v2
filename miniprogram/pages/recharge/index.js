// 积分充值页
const util = require('../../utils/util');
const config = require('../../utils/config');

Page({
  data: {
    credits: 2860,
    tiers: config.RECHARGE_TIERS,
    selectedTier: 3,
    currentTab: 'earn',
    earnRecords: [
      { title: '充值60积分', source: '微信支付', time: '06-18 14:30', amount: '+60' },
      { title: '每日签到', source: '签到奖励', time: '06-17 09:12', amount: '+10' },
      { title: '邀请好友奖励', source: '邀请·星辰大海', time: '06-15 10:05', amount: '+50' }
    ],
    spendRecords: [
      { title: '生成「霞虹都市」', model: 'GPT Image 2', time: '06-18 16:20', amount: '-15' },
      { title: '生成「山水之间」', model: 'Nano Banana 2', time: '06-17 20:15', amount: '-8' }
    ],
    recordAnimClass: '',
    showCustomSheet: false,
    customAmount: '',
    customCredits: 0,
    customBonus: 0,
    customFocused: false
  },

  onSelectTier(e) {
    this.setData({ selectedTier: parseInt(e.currentTarget.dataset.index) });
  },

  onRecharge() {
    const tier = this.data.tiers[this.data.selectedTier];
    util.showToast('支付¥' + tier.price + '充值' + tier.credits + '积分（支付功能即将上线）');
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.currentTab) return;
    const dir = tab === 'spend' ? 'left' : 'right';
    this.setData({ currentTab: tab, recordAnimClass: dir === 'left' ? 'anim-slide-left' : 'anim-slide-right' });
    setTimeout(() => this.setData({ recordAnimClass: '' }), 350);
  },

  onOpenCustom() {
    this.setData({ showCustomSheet: true, customAmount: '', customCredits: 0, customBonus: 0 });
  },

  onCloseCustom() {
    this.setData({ showCustomSheet: false });
  },

  onCustomFocus() { this.setData({ customFocused: true }); },
  onCustomBlur() { this.setData({ customFocused: false }); },

  onCustomInput(e) {
    const val = parseFloat(e.detail.value) || 0;
    const credits = Math.floor(val * 10);
    const bonus = Math.floor(credits * 0.05);
    this.setData({ customAmount: e.detail.value, customCredits: credits, customBonus: bonus });
  },

  onConfirmCustom() {
    const val = parseFloat(this.data.customAmount);
    if (isNaN(val) || val < 1) { util.showToast('请输入至少1元'); return; }
    this.setData({ showCustomSheet: false });
    util.showToast('支付¥' + val + '（支付功能即将上线）');
  }
});
