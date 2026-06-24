// 空状态组件
Component({
  properties: {
    icon: { type: String, value: '◇' },
    iconBg: { type: String, value: 'rgba(91, 159, 232, 0.12)' },
    iconColor: { type: String, value: '#5B9FE8' },
    text: { type: String, value: '暂无内容' },
    subText: { type: String, value: '' },
    buttonText: { type: String, value: '' }
  },

  methods: {
    onAction() {
      this.triggerEvent('action');
    }
  }
});
