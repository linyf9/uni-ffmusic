import {
  getToken,
  removeToken
} from './auth.js'
import env from './env.js'

function service(options = {}) {
  options.url = `${env.baseUrl}${options.url}`
  // 判断本地是否存在token，如果存在则带上请求头，且在请求头设置token
  if (getToken()) {
    options.header = {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': `${getToken()}`
    }
  }

  return new Promise((resolved, rejected) => {
    options.success = (res) => {
      // 如果请求回来的状态码不是200，则执行以下操作
      if (res.data.code !== 200) {
        uni.showToast({
          icon: 'none',
          duration: 3000,
          title: `${res.data.message}`
        });
        // 登录失效  code为 10101 token失效，即登录失效，请重新登录
        if (res.data.code === '10101') {
          // 清除本地token
          removeToken()
          // 清除用户数据
          uni.removeStorageSync('userInfo')
          // 关闭所有页面，并跳转到登录页
          uni.reLaunch({
            url: '/pages/login/login'
          });
        }

        // 返回错误信息
        rejected(res)

      } else {
        // 请求回来的状态码为200，则返回内容
        resolved(res.data.data)
      }
    }

    options.fail = (err) => {
      // 请求失败的弹窗提醒
      uni.showToast({
        icon: 'none',
        duration: 3000,
        title: '服务器错误,请稍后再试'
      });
      rejected(err);
    }

    // 发送请求
    uni.request(options);

  })

}

export default service;
