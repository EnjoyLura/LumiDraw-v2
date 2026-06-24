// 审核设置
Page({
  data: {
    autoSettings: [
      { title: 'AI内容安全检测', desc: '自动过滤违规内容', enabled: true },
      { title: '敏感词过滤', desc: '过滤提示词中的敏感词汇', enabled: true },
      { title: 'NSFW检测', desc: '检测并拦截不良图片', enabled: true }
    ],
    manualSettings: [
      { title: '新作品审核', desc: '发布前需人工审核', enabled: false },
      { title: '新用户审核', desc: '首次发布需人工审核', enabled: true }
    ],
    thresholds: [{ label: '安全评分阈值', value: '0.85' }, { label: '自动通过分数', value: '≥0.95' }, { label: '自动拒绝分数', value: '≤0.30' }],
    notifySettings: [
      { title: '举报通知', desc: '收到举报时推送通知', enabled: true },
      { title: '邮件通知', desc: '每日汇总发送至管理员邮箱', enabled: false }
    ]
  },
  onToggle(e) { wx.showToast({ title: '已切换', icon: 'none' }); }
});