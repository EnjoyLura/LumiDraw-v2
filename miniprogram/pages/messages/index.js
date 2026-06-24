// 消息中心页
const util = require('../../utils/util');

Page({
  data: {
    categories: [
      { key: 'like', title: '点赞', icon: '♥', gradient: 'linear-gradient(135deg,#FFB3C1,#FF8FA3)', unread: 3, latest: '月光如水 赞了你的作品「霓虹都市」', time: '2分钟前' },
      { key: 'favorite', title: '收藏', icon: '★', gradient: 'linear-gradient(135deg,#A8D8F0,#7CC4E8)', unread: 2, latest: '风之绘师 收藏了你的作品「霓虹都市」', time: '30分钟前' },
      { key: 'remake', title: '同款生成', icon: '✦', gradient: 'linear-gradient(135deg,#A3E4CC,#7DD4B0)', unread: 1, latest: '月光如水 使用了你的提示词生成了新作品', time: '3小时前' },
      { key: 'follow', title: '新粉丝', icon: '👤', gradient: 'linear-gradient(135deg,#FFD4A8,#FFC088)', unread: 2, latest: '月光如水 关注了你', time: '5小时前' },
      { key: 'system', title: '系统通知', icon: '🔔', gradient: 'linear-gradient(135deg,#B4C8F5,#96B0E8)', unread: 0, latest: '每日签到 +10 积分已到账', time: '昨天' },
      { key: 'service', title: '官方客服', icon: '💬', gradient: 'linear-gradient(135deg,#C8B5E8,#B09DD8)', unread: 0, latest: '感谢使用Lumi-Draw', time: '3天前' }
    ]
  },

  onTapCategory(e) {
    const key = e.currentTarget.dataset.key;
    wx.navigateTo({ url: '/pages/msgDetail/index?type=' + key });
  }
});
