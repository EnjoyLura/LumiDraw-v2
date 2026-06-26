// 玩法管理
const util = require('../../../utils/util');
const GP_COLORS = [
  'linear-gradient(135deg,#FFB3C1,#FF8FA3)', 'linear-gradient(135deg,#a8d8f8,#b0e6d0)',
  'linear-gradient(135deg,#FFD4C8,#FFC8D6)', 'linear-gradient(135deg,#D4C8F0,#B8A8E0)',
  'linear-gradient(135deg,#A3E4CC,#8BD8B8)', 'linear-gradient(135deg,#FFC8A8,#FFB090)',
  'linear-gradient(135deg,#C8D8F8,#A8C0F0)', 'linear-gradient(135deg,#F0C8D8,#E8B0C8)'
];
Page({
  data: { gameplays: [
    { name: '人物美颜', sort: 1, usage: 523, enabled: true, color: GP_COLORS[0] },
    { name: '证件照', sort: 2, usage: 412, enabled: true, color: GP_COLORS[1] },
    { name: '宠物头像', sort: 3, usage: 356, enabled: true, color: GP_COLORS[2] },
    { name: '古风国潮', sort: 4, usage: 289, enabled: true, color: GP_COLORS[3] },
    { name: 'Q版头像', sort: 5, usage: 234, enabled: true, color: GP_COLORS[4] },
    { name: 'Logo设计', sort: 6, usage: 198, enabled: true, color: GP_COLORS[5] },
    { name: '壁纸', sort: 7, usage: 167, enabled: true, color: GP_COLORS[6] },
    { name: '表情包', sort: 8, usage: 145, enabled: true, color: GP_COLORS[7] }
  ]},
  onEdit(e) { wx.navigateTo({ url: '/pages/admin/gameplayEdit/index?id=' + e.currentTarget.dataset.idx }); },
  onAdd() { wx.navigateTo({ url: '/pages/admin/gameplayEdit/index?id=new' }); },
  onToggle(e) {
    const idx = e.currentTarget.dataset.idx;
    const gameplays = this.data.gameplays.slice();
    gameplays[idx] = Object.assign({}, gameplays[idx], { enabled: e.detail.value });
    this.setData({ gameplays });
    util.showToast(e.detail.value ? '已启用' : '已禁用');
  }
});
