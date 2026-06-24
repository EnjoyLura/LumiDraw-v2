// 邀请好友页
const util = require('../../utils/util');

Page({
  data: {
    inviteCode: 'LUMI8829',
    invitedList: [
      { name: '星辰大海', avatar: '星', color: '#6FD4B0', date: '06-15', credits: 50 },
      { name: '月光如水', avatar: '月', color: '#FFB59A', date: '06-12', credits: 50 },
      { name: '风之绘师', avatar: '风', color: '#B8A5E3', date: '06-08', credits: 50 }
    ]
  },

  onCopyCode() { util.copyText(this.data.inviteCode); },
  onShareInvite() { util.showToast('分享给微信好友'); }
});
