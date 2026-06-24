// 左侧抽屉组件
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
