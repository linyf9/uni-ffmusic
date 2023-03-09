<template>
  <view class="set">
    <text class="nickname" @click="toChangeNickname">修改用户昵称</text>
    <text class="password" @click="toChangePaaaword">修改登录密码</text>
    <!-- 不用退出登录，token过期了会重新登录 -->
    <!-- <text class="outLogin">退出登录</text> -->
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getToken } from '../../utils/auth.js';
let nickname = ref('');
const toChangePaaaword = () => {
  if (getToken()) {
    // 跳转到修改密码页面
    uni.navigateTo({
      url: '/pages/changePassword/changePassword'
    });
  } else {
    uni.showToast({
      title: '您还没有登录，请先登录，您将跳转至登录页',
      duration: 1200,
      icon: 'none',
      success() {
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/login'
          });
        }, 1200);
      }
    });
  }
};
const toChangeNickname = () => {
  if (getToken()) {
    // 跳转到修改昵称页面
    uni.navigateTo({
      url: `/pages/changeNickname/changeNickname?nickname=${nickname.value}`
    });
  } else {
    uni.showToast({
      title: '您还没有登录，请先登录，您将跳转至登录页',
      duration: 1200,
      icon: 'none',
      success() {
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/login'
          });
        }, 1200);
      }
    });
  }
};
onLoad(options => {
  nickname.value = options.nickname;
});
</script>

<style lang="scss">
.set {
  color: #000;
  padding: 0 30rpx;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.nickname {
  border-bottom: 1rpx solid #ccc;
  height: 60rpx;
  line-height: 60rpx;
}
.password {
  border-bottom: 1rpx solid #ccc;
  height: 60rpx;
  line-height: 60rpx;
}
.outLogin {
  height: 60rpx;
  line-height: 60rpx;
}
</style>
