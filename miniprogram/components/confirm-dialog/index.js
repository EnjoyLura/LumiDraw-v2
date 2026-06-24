// 确认对话框组件
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '确认操作'
    },
    message: {
      type: String,
      value: ''
    },
    confirmText: {
      type: String,
      value: '确认'
    },
    confirmColor: {
      type: String,
      value: '#FF6B8A'
    },
    iconBg: {
      type: String,
      value: 'rgba(255, 168, 184, 0.22)'
    },
    iconColor: {
      type: String,
      value: '#FFA8B8'
    },
    iconChar: {
      type: String,
      value: '✕'
    }
  },

  methods: {
    onConfirm() {
      this.triggerEvent('confirm');
    },

    onCancel() {
      this.triggerEvent('cancel');
    }
  }
});
