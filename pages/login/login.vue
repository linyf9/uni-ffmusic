<template>
  <view class="container">
    <view class="wrapper">
      <view class="welcome">欢迎回来！</view>
      <view class="input-content">
        <view class="input-item">
          <text class="tit">手机号码:</text>
          <input type="text" placeholder="请输入手机号码" data-test="abc" data-type="phone" id="phone" @input="handleInput" />
        </view>
        <view class="input-item">
          <text class="tit">密码:</text>
          <input maxlength="6" type="password" placeholder="请输入密码" data-test="abc" data-type="password" id="password" @input="handleInput" />
        </view>
      </view>
      <button class="confirm-btn" @click="login">登录</button>
      <view class="forget-section" @click="toChangePaaaword">忘记密码?</view>
    </view>
    <view class="register-section">
      还没有账号?
      <text @click="toRegister">马上注册</text>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useMusic, useUser } from '../../store/index.js';
import { userLogin } from '../../api/api.js';
import { setToken } from '../../utils/auth.js';

const userStore = useUser();
const state = reactive({
  phone: '',
  password: ''
});
// 表单值实时变化的input事件的回调：
const handleInput = event => {
  // 拿到表单id，以区分是哪个表单
  let type = event.currentTarget.id;
  // 利用对象的[]取值
  state[type] = event.detail.value;
};

// 点击登录按钮的回调
const login = async () => {
  // 1.收集数据
  let { phone, password } = state;
  // 2. 验证
  if (!phone) {
    // 提示用户输入手机号不能为空
    uni.showToast({
      title: '手机号不能为空',
      icon: 'none'
    });
    return;
  }
  let reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (!reg_tel.test(phone)) {
    // 提示用户输入手机号格式错误
    uni.showToast({
      title: '手机号格式错误',
      icon: 'none'
    });
    return;
  }
  if (!password) {
    // 提示用户输入密码不能为空
    uni.showToast({
      title: '密码不能为空',
      icon: 'none'
    });
    return;
  }

  // 发请求，后端验证是否登录成功
  let res = await userLogin({ phone, password });
  if (res.code === 200) {
    // 将token存到本地
    setToken(res.token);
    // 将用户信息存到本地
    uni.setStorageSync('userInfo', JSON.stringify(res.userInfo));
    uni.reLaunch({
      // 销毁之前的所有页面，打开指定页面
      url: '/pages/my/my'
    });
  } else {
    uni.showToast({
      title: '登录失败，请重新登录',
      icon: 'none'
    });
  }
};

// 跳转到注册页面
const toRegister = () => {
  uni.navigateTo({
    url: '/pages/register/register'
  });
};
// 跳转到修改密码的页面
const toChangePaaaword = () => {
  uni.navigateTo({
    url: '/pages/changePassword/changePassword'
  });
};
</script>

<style lang="scss">
.container {
  color: #fff;
}
.wrapper {
  position: relative;
  z-index: 90;
  padding-bottom: 40rpx;
}

.welcome {
  font-size: 46rpx;
  color: #f8f8f8;
  text-align: center;
  margin: 60rpx 0;
}

.input-content {
  padding: 0 60rpx;
}
.input-item {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30rpx;
  background: #f8f6fc;
  height: 80rpx;
  border-radius: 4px;
  margin-bottom: 40rpx;
}

.input-item:last-child {
  margin-bottom: 0;
}
.input-item .tit {
  margin-top: 15rpx;
  height: 50rpx;
  line-height: 50rpx;
  font-size: 35rpx;
  color: #606266;
  width: 28%;
}
.input-item input {
  margin-top: 10rpx;
  margin-left: 20rpx;
  height: 60rpx;
  font-size: 35rpx;
  color: #303133;
  width: 72%;
}
.confirm-btn {
  width: 630rpx !important;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 50rpx;
  margin-top: 70rpx;
  background: darkred;
  color: #fff;
  font-size: 32rpx;
  padding: 0;
}
.confirm-btn2:after {
  border-radius: 100px;
}

.forget-section {
  font-size: 28rpx;
  color: #4399fc;
  text-align: center;
  margin-top: 40rpx;
}

.register-section {
  position: absolute;
  left: 0;
  bottom: 50rpx;
  width: 100%;
  font-size: 28rpx;
  color: #606266;
  text-align: center;
}
.register-section text {
  color: #4399fc;
  margin-left: 10rpx;
}
</style>
