// 编辑资料页
const util = require('../../utils/util');

Page({
  data: {
    avatarText: '梦',
    avatarColor: '#5B9FE8',
    nickName: '云端造梦师',
    nickCount: 5,
    gender: 'male',
    signature: '用AI描绘心中的梦境，每一笔都是想象力的延伸',
    signCount: 22,
    userId: 'LUMI8829'
  },

  onNickInput(e) {
    this.setData({ nickName: e.detail.value, nickCount: e.detail.value.length });
  },

  onSignInput(e) {
    this.setData({ signature: e.detail.value, signCount: e.detail.value.length });
  },

  onSelectGender(e) {
    this.setData({ gender: e.currentTarget.dataset.gender });
  },

  onChangeAvatar() {
    util.chooseImage(1).then(paths => {
      util.showToast('头像已更换');
    }).catch(() => {});
  },

  onSave() {
    if (!this.data.nickName.trim()) {
      util.showToast('请输入昵称');
      return;
    }
    util.showToast('资料已保存');
    setTimeout(() => wx.navigateBack(), 800);
  }
});
