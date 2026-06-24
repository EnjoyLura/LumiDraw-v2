// 浏览记录页
const util = require('../../utils/util');
const COLORS = ['linear-gradient(135deg,#a8d8f8,#b0e6d0)','linear-gradient(135deg,#FFD4C8,#FFC8D6)','linear-gradient(135deg,#D4C8F0,#B8A8E0)','linear-gradient(135deg,#A3E4CC,#8BD8B8)','linear-gradient(135deg,#FFC8A8,#FFB090)','linear-gradient(135deg,#C8D8F8,#A8C0F0)'];
Page({
  data: { cleared: false, todayItems: [], yesterdayItems: [] },
  onLoad() {
    const today = [], yesterday = [];
    for (let i = 0; i < 6; i++) today.push({ id: 500+i, color: COLORS[i%6] });
    for (let i = 0; i < 3; i++) yesterday.push({ id: 510+i, color: COLORS[(i+3)%6] });
    this.setData({ todayItems: today, yesterdayItems: yesterday });
  },
  onClear() { this.setData({ cleared: true }); util.showToast('已清空浏览记录'); },
  onItemTap(e) { wx.navigateTo({ url: '/pages/workDetail/index?id=' + e.currentTarget.dataset.id }); }
});
