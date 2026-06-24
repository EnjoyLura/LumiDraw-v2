// 通用工具函数

/**
 * 显示提示
 */
function showToast(title, icon = 'none') {
  wx.showToast({ title, icon, duration: 2000 });
}

/**
 * 显示加载中
 */
function showLoading(title = '加载中...') {
  wx.showLoading({ title, mask: true });
}

/**
 * 隐藏加载中
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示模态对话框
 */
function showModal(title, content) {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success: (res) => resolve(res.confirm)
    });
  });
}

/**
 * 格式化时间
 */
function formatTime(date) {
  if (typeof date === 'string') date = new Date(date);
  if (typeof date === 'number') date = new Date(date);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
}

/**
 * 格式化日期
 */
function formatDate(date) {
  if (typeof date === 'string') date = new Date(date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 节流
 */
function throttle(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * 防抖
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 生成用户ID
 */
function generateUserId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = 'LUMI';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 复制文本到剪贴板
 */
function copyText(text) {
  wx.setClipboardData({
    data: text,
    success: () => showToast('已复制到剪贴板')
  });
}

/**
 * 选择并上传图片
 */
function chooseImage(count = 1, sizeType = ['compressed']) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count,
      sizeType,
      sourceType: ['album', 'camera'],
      success: (res) => resolve(res.tempFilePaths),
      fail: reject
    });
  });
}

/**
 * 保存图片到相册
 */
function saveImageToPhotos(filePath) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: resolve,
      fail: (err) => {
        if (err.errMsg.includes('auth deny') || err.errMsg.includes('authorize')) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            success: (res) => {
              if (res.confirm) wx.openSetting();
            }
          });
        }
        reject(err);
      }
    });
  });
}

module.exports = {
  showToast,
  showLoading,
  hideLoading,
  showModal,
  formatTime,
  formatDate,
  throttle,
  debounce,
  generateUserId,
  copyText,
  chooseImage,
  saveImageToPhotos
};
