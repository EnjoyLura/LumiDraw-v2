// 瀑布流组件
Component({
  properties: {
    // 作品列表
    works: {
      type: Array,
      value: [],
      observer: '_onWorksChange'
    },
    // 是否显示已发布角标
    showPublished: {
      type: Boolean,
      value: false
    },
    // 点赞状态映射 { workId: true }
    likedMap: {
      type: Object,
      value: {},
      observer: '_onLikedMapChange'
    },
    // 管理模式
    manageMode: {
      type: Boolean,
      value: false
    },
    // 已选择映射 { workId: true }
    selectedMap: {
      type: Object,
      value: {}
    }
  },

  data: {
    leftItems: [],
    rightItems: []
  },

  lifetimes: {
    attached() {
      this._leftHeight = 0;
      this._rightHeight = 0;
    }
  },

  methods: {
    // 作品数据变化时重新分配双列
    _onWorksChange(works) {
      if (!works || works.length === 0) {
        this.setData({ leftItems: [], rightItems: [] });
        this._leftHeight = 0;
        this._rightHeight = 0;
        return;
      }
      this._distributeItems(works);
    },

    _onLikedMapChange() {
      // 更新点赞状态
      this._distributeItems(this.properties.works);
    },

    // 将作品分配到左右两列
    _distributeItems(works) {
      const left = [];
      const right = [];
      let leftH = 0;
      let rightH = 0;

      works.forEach((work) => {
        const item = this._processItem(work);
        // 根据当前列高度分配，实现瀑布流效果
        if (leftH <= rightH) {
          left.push(item);
          leftH += item._estimatedHeight;
        } else {
          right.push(item);
          rightH += item._estimatedHeight;
        }
      });

      this._leftHeight = leftH;
      this._rightHeight = rightH;
      this.setData({ leftItems: left, rightItems: right });
    },

    // 处理单个作品数据
    _processItem(work) {
      const item = Object.assign({}, work);

      // 处理图片URL
      if (!item.imageUrl && item.imageUrls && item.imageUrls.length > 0) {
        item.imageUrl = item.imageUrls[0];
      }

      // 计算宽高比
      const ratioMap = {
        '1:1': '1/1', '3:4': '3/4', '4:3': '4/3',
        '2:3': '2/3', '3:2': '4/3', '9:16': '9/16', '16:9': '4/3'
      };
      item._aspectRatio = ratioMap[item.ratio] || '3/4';

      // 估算高度（用于分配列）
      const ratioHeightMap = {
        '1:1': 1, '3:4': 1.33, '4:3': 0.75,
        '2:3': 1.5, '9:16': 1.78, '16:9': 0.56
      };
      const imgRatio = ratioHeightMap[item.ratio] || 1.33;
      item._estimatedHeight = 200 * imgRatio + 80; // 图片高 + 信息区高

      // 显示标题
      item._displayTitle = item.title ||
        (item.prompt ? (item.prompt.length > 20 ? item.prompt.substring(0, 20) + '...' : item.prompt) : '未命名作品');

      // 用户信息（从外部传入或默认）
      item._userName = item._userName || '用户';
      item._userAvatarText = item._userAvatarText || '用';
      item._userColor = item._userColor || '#5B9FE8';

      // 点赞状态
      const likedMap = this.properties.likedMap || {};
      item._liked = !!likedMap[item.id || item._id];

      item._imgLoaded = false;

      return item;
    },

    onImageLoad(e) {
      const id = e.currentTarget.dataset.id;
      // 标记图片已加载
      this._updateItemField(id, '_imgLoaded', true);
    },

    onItemTap(e) {
      const id = e.currentTarget.dataset.id;
      if (this.properties.manageMode) {
        this.triggerEvent('selecttap', { id });
      } else {
        this.triggerEvent('itemclick', { id });
      }
    },

    onItemLongPress(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('longpress', { id });
    },

    onUserTap(e) {
      const userId = e.currentTarget.dataset.userId;
      this.triggerEvent('usertap', { userId });
    },

    onLikeTap(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('liketap', { id });
    },

    // 更新指定作品的字段
    _updateItemField(id, field, value) {
      const key1 = `leftItems`;
      const key2 = `rightItems`;
      const update = {};

      [this.data.leftItems, this.data.rightItems].forEach((items, colIdx) => {
        const key = colIdx === 0 ? key1 : key2;
        items.forEach((item, idx) => {
          if ((item.id || item._id) === id) {
            update[`${key}[${idx}].${field}`] = value;
          }
        });
      });

      if (Object.keys(update).length > 0) {
        this.setData(update);
      }
    }
  }
});
