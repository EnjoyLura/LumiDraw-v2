// 玩法管理
Page({
  data: { gameplays: [
    { name: '人物美颜', sort: 1, usage: 523, enabled: true },
    { name: '证件照', sort: 2, usage: 412, enabled: true },
    { name: '宠物头像', sort: 3, usage: 356, enabled: true },
    { name: '古风国潮', sort: 4, usage: 289, enabled: true },
    { name: 'Q版头像', sort: 5, usage: 234, enabled: true },
    { name: 'Logo设计', sort: 6, usage: 198, enabled: true },
    { name: '壁纸', sort: 7, usage: 167, enabled: true },
    { name: '表情包', sort: 8, usage: 145, enabled: true }
  ]},
  onEdit(e) { wx.navigateTo({ url: '/pages/admin/gameplayEdit/index?id=' + e.currentTarget.dataset.idx }); },
  onAdd() { wx.navigateTo({ url: '/pages/admin/gameplayEdit/index?id=new' }); }
});