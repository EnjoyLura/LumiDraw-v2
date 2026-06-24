// 消息详情页
const util = require('../../utils/util');

const MOCK_MSGS = {
  like: [
    { id: 1, user: '月光如水', avatar: '月', color: '#FFB59A', content: '赞了你的作品「霓虹都市」', time: '2分钟前', unread: true },
    { id: 2, user: '风之绘师', avatar: '风', color: '#B8A5E3', content: '赞了你的作品「山水之间」', time: '1小时前', unread: true },
    { id: 3, user: '光影魔术', avatar: '光', color: '#FFE08A', content: '赞了你的作品「少女与猫」', time: '3小时前', unread: false }
  ],
  favorite: [
    { id: 1, user: '风之绘师', avatar: '风', color: '#B8A5E3', content: '收藏了你的作品「霓虹都市」', time: '30分钟前', unread: true },
    { id: 2, user: '光影魔术', avatar: '光', color: '#FFE08A', content: '收藏了你的作品「古风少女」', time: '2小时前', unread: true }
  ],
  follow: [
    { id: 1, user: '月光如水', avatar: '月', color: '#FFB59A', content: '关注了你', time: '5小时前', unread: true },
    { id: 2, user: '光影魔术', avatar: '光', color: '#FFE08A', content: '关注了你', time: '昨天', unread: false }
  ],
  remake: [
    { id: 1, user: '月光如水', avatar: '月', color: '#FFB59A', content: '使用了你的提示词生成了新作品', time: '3小时前', unread: true }
  ],
  system: [
    { id: 1, content: '每日签到 +10 积分已到账', time: '昨天', unread: false },
    { id: 2, content: '您的作品「霓虹都市」已通过审核', time: '2天前', unread: false },
    { id: 3, content: '欢迎使用Lumi-Draw！新用户赠送100积分', time: '3天前', unread: false }
  ],
  service: [
    { id: 1, content: '感谢使用Lumi-Draw，有任何问题随时联系我们', time: '3天前', unread: false },
    { id: 2, content: '您好，有什么可以帮您？', time: '5天前', unread: false }
  ]
};

const TITLE_MAP = {
  like: '点赞', favorite: '收藏', follow: '新粉丝',
  remake: '同款生成', system: '系统通知', service: '官方客服'
};

Page({
  data: {
    type: '',
    title: '',
    messages: []
  },

  onLoad(options) {
    const type = options.type || 'like';
    const title = TITLE_MAP[type] || '消息';
    wx.setNavigationBarTitle({ title: title });
    this.setData({
      type: type,
      title: title,
      messages: MOCK_MSGS[type] || []
    });
  },

  onTapMsg(e) {
    const id = e.currentTarget.dataset.id;
    const msgs = this.data.messages.map(function(m) {
      if (m.id === id) {
        return Object.assign({}, m, { unread: false });
      }
      return m;
    });
    this.setData({ messages: msgs });
  }
});
