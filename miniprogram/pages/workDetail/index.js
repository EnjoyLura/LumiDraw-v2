// 作品详情页
const util = require('../../utils/util');

Page({
  data: {
    work: null,
    liked: false,
    favorited: false,
    isOwn: false,
    isFollowing: false,
    showImgPreview: false,
    previewImgSrc: ''
  },

  onLoad(options) {
    const id = options.id;
    const mockWork = {
      id: parseInt(id) || 1,
      imageUrl: '',
      _cardColor: 'linear-gradient(135deg, #5B9FE8, #B8A5E3)',
      title: '霓虹都市',
      desc: '赛博朋克风格的夜晚城市，霓虹灯光映照在雨后的街道上',
      prompt: 'cyberpunk city at night, neon lights reflecting on wet streets, rain, ultra detailed, cinematic lighting',
      model: 'GPT Image 2',
      ratio: '3:4',
      style: '赛博朋克',
      tags: ['二次元', '赛博朋克'],
      likes: 328,
      favorites: 92,
      remakes: 45,
      time: '2小时前',
      userId: 'u2',
      userName: '星辰大海',
      userAvatar: '星',
      userColor: '#6FD4B0',
      published: true
    };
    this.setData({
      work: mockWork,
      isOwn: mockWork.userId === 'self'
    });
  },

  onLikeTap() {
    const liked = !this.data.liked;
    const work = Object.assign({}, this.data.work);
    work.likes += liked ? 1 : -1;
    this.setData({ liked, work });
  },

  onFavTap() {
    const favorited = !this.data.favorited;
    const work = Object.assign({}, this.data.work);
    work.favorites += favorited ? 1 : -1;
    this.setData({ favorited, work });
  },

  onCopyPrompt() {
    util.copyText(this.data.work.prompt);
  },

  onRemake() {
    wx.switchTab({ url: '/pages/create/index' });
    util.showToast('已带入提示词和参数');
  },

  onUserTap() {
    wx.navigateTo({ url: '/pages/userProfile/index?userId=' + this.data.work.userId });
  },

  onToggleFollow() {
    if (this.data.isFollowing) {
      wx.showModal({
        title: '取消关注',
        content: '确定不再关注 ' + this.data.work.userName + ' 吗？',
        confirmColor: '#FF6B8A',
        success: (res) => {
          if (res.confirm) {
            this.setData({ isFollowing: false });
            util.showToast('已取消关注');
          }
        }
      });
    } else {
      this.setData({ isFollowing: true });
      util.showToast('已关注');
    }
  },

  onPreviewImage() {
    this.setData({ showImgPreview: true, previewImgSrc: this.data.work.imageUrl || '' });
  },

  onClosePreview() {
    this.setData({ showImgPreview: false });
  },

  onSave() {
    util.showToast('已保存到相册');
  },

  onDelete() {
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复',
      confirmColor: '#FF6B8A',
      success: function(res) {
        if (res.confirm) {
          util.showToast('已删除');
          setTimeout(function() { wx.navigateBack(); }, 800);
        }
      }
    });
  }
});
