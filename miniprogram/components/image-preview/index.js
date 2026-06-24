// 图片全屏预览组件
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    src: {
      type: String,
      value: ''
    },
    showSave: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    },

    onSave() {
      this.triggerEvent('save', { src: this.properties.src });
    },

    noop() {
      // 阻止事件穿透
    }
  }
});
