const tokenKey = 'token'

// 登录与免登陆 认证令牌
// 获取本地token
export const getToken = () => {
  return uni.getStorageSync(tokenKey)
}
// 设置本地tolen
export const setToken = (token) => {
  return uni.setStorageSync(tokenKey, token)
}
// 删除本地token
export const removeToken = () => {
  return uni.removeStorageSync(tokenKey)
}
