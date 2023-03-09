<template>
  <!-- <view class="set"> -->
  <text class="iconfont icon-shezhi set" @click="toSet(state.nickname)"></text>
  <!-- </view> -->
  <view class="header">
    <view @click="toLogin">
      <image :src="state.isShow ? '../../static/images/avatar.jpg' : '../../static/images/missing-face.png'"></image>
      <text>{{ state.isShow ? state.nickname : '游客' }}</text>
    </view>
  </view>
  <!-- 最近与收藏：如果未登录显示 "暂无数据~" 只有登录才能看到数据 -->
  <view class="container">
    <van-tabs
      title-active-color="red"
      color="red"
      :active="active"
      @change="onChange"
      nav-class="van-tabs__nav van-tabs__nav--line"
      custom-class="van-tab__pane van-tab__pane--active"
    >
      <van-tab title="最近">
        <!-- 内容区域 -->
        <scroll-view scroll-y="true" class="listScroll" v-if="state.historyList.length !== 0">
          <view class="scrollItem" v-for="(item, index) in state.historyList" :key="item.song.song_id" @click="playMusic(state.historyList, index, 'history')">
            <text class="rank">{{ index + 1 }}.</text>
            <image :src="item.song.song_imgpath"></image>
            <view class="musicInfo">
              <text class="musicName">{{ item.song.song_songname }}</text>
              <text class="author">{{ item.song.singer_name }}</text>
            </view>
            <text class="iconfont icon-gengduo2"></text>
          </view>
        </scroll-view>
        <view class="noData" v-else>暂无数据~</view>
      </van-tab>
      <van-tab title="收藏">
        <!-- 内容区域 -->
        <scroll-view scroll-y="true" class="listScroll" v-if="state.likeSongs.length !== 0">
          <view class="scrollItem" v-for="(item, index) in state.likeSongs" :key="item.song.song_id" @click="playMusic(state.likeSongs, index, 'like')">
            <text class="rank">{{ index + 1 }}.</text>
            <image :src="item.song.song_imgpath"></image>
            <view class="musicInfo">
              <text class="musicName">{{ item.song.song_songname }}</text>
              <text class="author">{{ item.song.singer_name }}</text>
            </view>
            <text class="iconfont icon-gengduo2"></text>
          </view>
        </scroll-view>
        <view class="noData" v-else>暂无数据~</view>
      </van-tab>
    </van-tabs>
  </view>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getRecommendSongs } from '../../api/api.js';
import { useMusic, useUser } from '../../store/index.js';
import { getToken } from '../../utils/auth.js';
const userStore = useUser();
const musicStore = useMusic();
const active = ref(0);
const state = reactive({
  likeSongs: [],
  historyList: [],
  nickname: '', //用户昵称
  isShow: false
});

// 点击头像区域，跳转到登录页面
const toLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  });
};
// 跳转至设置页面（修改昵称、修改密码、和退出登录）
const toSet = nickname => {
  uni.navigateTo({
    url: `/pages/set/set?nickname=${nickname}`
  });
};

//
const playMusic = (list, index, type) => {
  const playList = list.map(item => {
    if (item.song && item.song.song_id) {
      return item.song;
    }
  });
  // 点击歌曲，将当前歌曲列表赋值给库中的musicStore.playList
  musicStore.updatePlayList(playList);
  // 修改列表中的下标（为了点击播放另一首歌）
  musicStore.updatePlayListIndex(index);
  // 跳转到歌曲详情页
  uni.navigateTo({
    url: `/pages/songDetail/songDetail?type=${type}`
  });
};

const onChange = event => {};

// onShow会在重新进入（不是刷新，页面还存在）页面之后会再次执行一次回调，而onLoad只是在页面加载时执行一次
onShow(() => {
  // console.log(1232, getToken('token'));
  if (getToken() !== '' && getToken()) {
    // 获取用户信息
    let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
    state.nickname = userInfo.nickname;
    state.isShow = true;
    state.likeSongs = userStore.isLikeList;
    state.historyList = userStore.historyList;
  }
});
</script>

<style lang="scss">
.set {
  position: fixed;
  top: 0rpx;
  right: 30rpx;
  color: #fff;
  font-size: 50rpx;
}
.header {
  height: 300rpx;
  padding: 0 30rpx;
  color: #fff;
  background: url('../../static/images/person_bj.webp') no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  image {
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    vertical-align: middle;
  }
  text {
    color: #fff;
  }
}

.container {
  .van-tab__pane {
    padding: 0 30rpx;
    background-color: #fff;
    color: #000;
    display: flex;
    height: calc(100vh - 388rpx);
  }
  .listScroll {
    height: calc(100vh - 428rpx);
    padding-bottom: 20rpx;
    padding-top: 20rpx;
    .scrollItem {
      position: relative;
      display: flex;
      margin-bottom: 20rpx;
      .rank {
        width: 40rpx;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
      }
      image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 8rpx;
        margin-left: 10rpx;
      }
      .musicInfo {
        display: flex;
        flex-direction: column;
        margin-left: 20rpx;
        text {
          height: 50rpx;
          line-height: 50rpx;
          font-size: 26rpx;
          max-width: 500rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .author {
          font-size: 24rpx;
        }
      }
      .iconfont {
        position: absolute;
        right: 0;
        width: 100rpx;
        height: 100rpx;
        line-height: 100rpx;
        text-align: right;
      }
    }
  }

  .noData {
    width: 100%;
    height: calc(100vh - 388rpx);
    line-height: calc(100vh - 388rpx);
    color: #a3a3a3;
    text-align: center;
  }
}
</style>
