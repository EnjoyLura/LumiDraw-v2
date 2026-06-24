// 云函数调用统一封装
const api = {
  /**
   * 调用云函数
   * @param {string} action - 操作名称，如 'user.login'
   * @param {object} data - 参数
   * @returns {Promise} 返回结果数据
   */
  call(action, data = {}) {
    return wx.cloud.callFunction({
      name: 'main',
      data: { action, data }
    }).then(res => {
      if (res.result && res.result.code === 0) {
        return res.result.data;
      }
      const msg = (res.result && res.result.msg) || '请求失败';
      return Promise.reject(new Error(msg));
    });
  },

  /**
   * 上传文件到云存储
   * @param {string} filePath - 本地文件路径
   * @param {string} cloudPath - 云端路径
   * @returns {Promise} 返回 fileID
   */
  uploadFile(filePath, cloudPath) {
    return wx.cloud.uploadFile({
      cloudPath,
      filePath
    }).then(res => res.fileID);
  },

  /**
   * 下载云存储文件
   * @param {string} fileID - 云存储 fileID
   * @returns {Promise} 返回本地临时路径
   */
  downloadFile(fileID) {
    return wx.cloud.downloadFile({
      fileID
    }).then(res => res.tempFilePath);
  },

  /**
   * 获取图片临时链接（用于非云开发环境访问）
   * @param {string[]} fileList - fileID 列表
   * @returns {Promise} 返回临时链接列表
   */
  getTempFileURL(fileList) {
    return wx.cloud.getTempFileURL({
      fileList
    }).then(res => res.fileList);
  }
};

module.exports = api;
