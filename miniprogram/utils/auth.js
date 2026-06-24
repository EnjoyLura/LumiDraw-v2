// 用户鉴权工具
const api = require('./api');

let userInfo = null;

/**
 * 检查登录态
 */
function checkLogin() {
  return !!userInfo;
}

/**
 * 获取缓存的用户信息
 */
function getUserInfo() {
  return userInfo;
}

/**
 * 设置用户信息
 */
function setUserInfo(info) {
  userInfo = info;
  getApp().globalData.userInfo = info;
}

/**
 * 刷新用户信息（从云端获取）
 */
function refreshUserInfo() {
  return api.call('user.getProfile').then(data => {
    setUserInfo(data);
    return data;
  });
}

/**
 * 登录流程
 */
function login() {
  return api.call('user.login').then(data => {
    setUserInfo(data);
    return data;
  });
}

/**
 * 是否是管理员
 */
function isAdmin() {
  return userInfo && userInfo.isAdmin === true;
}

module.exports = {
  checkLogin,
  getUserInfo,
  setUserInfo,
  refreshUserInfo,
  login,
  isAdmin
};
