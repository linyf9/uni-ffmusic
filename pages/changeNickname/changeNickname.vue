<template>
  <view class="container">
    <view class="wrapper">
      <view class="input-content">
        <view class="input-item">
          <text class="tit">新昵称:</text>
          <input type="text" placeholder="请输入新昵称" data-type="nickname" id="nickname" @input="handleInput" />
        </view>
      </view>
      <button class="confirm-btn" @click="handle">确定</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useMusic, useUser } from '../../store/index.js';
import { updateNickname } from '../../api/api.js';

const userStore = useUser();

const state = reactive({
  nickname: ''
});

// 表单值实时变化的input事件的回调：
const handleInput = event => {
  // 拿到表单id，以区分是哪个表单
  let type = event.currentTarget.id;
  // 利用对象的[]取值
  state[type] = event.detail.value;
};

// 点击确定按钮的回调
const handle = async () => {
  // 1.收集数据
  let { nickname } = state;
  // 2. 验证
  // 修改昵称
  if (!nickname) {
    uni.showToast({
      title: '昵称不能为空',
      icon: 'none'
    });
    return;
  }
  let res1 = await updateNickname(nickname);
  if (res1.code === 200) {
    console.log(res1.userInfo);
    uni.setStorageSync('userInfo', JSON.stringify(res1.userInfo));
    uni.showToast({
      title: '昵称修改成功',
      duration: 1200,
      success() {
        setTimeout(() => {
          // 昵称正确修改之后回跳
          uni.navigateBack();
        }, 1200);
      }
    });
  } else {
    uni.showToast({
      title: '昵称修改失败，请重新输入',
      duration: 1200,
      icon: 'none'
    });
  }
};
onLoad(options => {
  state.nickname = options.nickname;
});
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
</style>
