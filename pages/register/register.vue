<template>
  <view class="container">
    <view class="wrapper">
      <view class="input-content">
        <view class="input-item">
          <text class="tit">手机号码:</text>
          <input type="text" placeholder="请输入手机号码" data-type="phone" id="phone" @input="handleInput" />
        </view>
        <view class="input-item">
          <text class="tit">密码:</text>
          <input type="password" placeholder="请输入密码" data-type="password" id="password" @input="handleInput" />
        </view>
        <view class="input-item">
          <text class="tit">昵称:</text>
          <input type="text" placeholder="请输入昵称" data-type="nickname" id="nickname" @input="handleInput" />
        </view>
      </view>
      <button class="confirm-btn" @click="register">注册</button>
    </view>
    <view class="register-section">
      已有账号?
      <text @click="toLogin">马上登录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useMusic, useUser } from '../../store/index.js';
import { userRegister } from '../../api/api.js';

const userStore = useUser();
const state = reactive({
  phone: '',
  password: '',
  nickname: ''
});

// 表单值实时变化的input事件的回调：
const handleInput = event => {
  // 拿到表单id，以区分是哪个表单
  let type = event.currentTarget.id;
  // 利用对象的[]取值
  state[type] = event.detail.value;
};

// 点击登录按钮的回调
const register = async () => {
  // 1.收集数据
  let { phone, password, nickname } = state;
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
  if (!nickname) {
    // 提示用户输入昵称不能为空
    uni.showToast({
      title: '昵称不能为空',
      icon: 'none'
    });
    return;
  }

  uni.showToast({
    title: '注册成功',
    duration: 1200,
    success() {
      setTimeout(() => {
        // 注册之后跳转到登录页
        uni.navigateTo({
          url: '/pages/login/login'
        });
      }, 1200);
    }
  });
};

// 已有账号，点击跳转到登录
const toLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
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
  margin-top: 60rpx;
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
