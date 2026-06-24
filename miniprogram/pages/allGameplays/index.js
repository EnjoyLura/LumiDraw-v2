// 全部玩法页
const util = require('../../utils/util');
const GAMEPLAYS = [
  { name: '人物美颜', color: 'linear-gradient(135deg,#FFB3C1,#FF8FA3)' },
  { name: '证件照', color: 'linear-gradient(135deg,#a8d8f8,#b0e6d0)' },
  { name: '宠物头像', color: 'linear-gradient(135deg,#FFD4C8,#FFC8D6)' },
  { name: '古风国潮', color: 'linear-gradient(135deg,#D4C8F0,#B8A8E0)' },
  { name: 'Q版头像', color: 'linear-gradient(135deg,#A3E4CC,#8BD8B8)' },
  { name: 'Logo设计', color: 'linear-gradient(135deg,#FFC8A8,#FFB090)' },
  { name: '壁纸', color: 'linear-gradient(135deg,#C8D8F8,#A8C0F0)' },
  { name: '表情包', color: 'linear-gradient(135deg,#F0C8D8,#E8B0C8)' }
];
Page({
  data: { gameplays: GAMEPLAYS },
  onTap(e) {
    const name = e.currentTarget.dataset.name;
    wx.switchTab({ url: '/pages/create/index' });
    util.showToast('已套用「' + name + '」模板');
  }
});
