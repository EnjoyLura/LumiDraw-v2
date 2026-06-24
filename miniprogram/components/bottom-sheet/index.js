// 底部弹窗组件
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    }
  }
});
