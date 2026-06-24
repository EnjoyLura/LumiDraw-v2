// 每日签到页
const util = require('../../utils/util');
const config = require('../../utils/config');

Page({
  data: {
    streak: 7,
    checkedToday: false,
    milestones: config.CHECKIN_MILESTONES,
    claimedMilestones: [3],
    calendarDays: []
  },

  onLoad() {
    this._buildCalendar();
  },

  _buildCalendar() {
    const days = [];
    const signedDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const milestoneDays = [3, 7, 14, 30];
    for (let i = 1; i <= 30; i++) {
      days.push({
        day: i,
        signed: signedDays.includes(i),
        isToday: i === 18,
        isMilestone: milestoneDays.includes(i)
      });
    }
    this.setData({ calendarDays: days });
  },

  onCheckin() {
    if (this.data.checkedToday) return;
    const newStreak = this.data.streak + 1;
    this.setData({ checkedToday: true, streak: newStreak });
    util.showToast('签到成功！+10积分，连续' + newStreak + '天');
  },

  onClaimMilestone(e) {
    const days = e.currentTarget.dataset.days;
    if (this.data.claimedMilestones.includes(days)) return;
    const claimed = this.data.claimedMilestones.concat([days]);
    const milestone = this.data.milestones.find(function(m) { return m.days === days; });
    this.setData({ claimedMilestones: claimed });
    util.showToast('领取成功！+' + milestone.reward + '积分');
  }
});
