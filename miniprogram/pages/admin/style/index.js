// 风格管理
const config = require('../../utils/config');
Page({
  data: { styles: config.STYLES.map((s,i) => ({ name: s, index: i, enabled: true })) },
  onEdit(e) { wx.navigateTo({ url: '/pages/admin/styleEdit/index?id=' + e.currentTarget.dataset.idx }); },
  onAdd() { wx.navigateTo({ url: '/pages/admin/styleEdit/index?id=new' }); }
});