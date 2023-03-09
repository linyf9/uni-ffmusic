<template>
  <view class="search">
    <!-- :value="keyword" -->
    <van-search custom-class="van-search" shape="round" background="#000000" :value="keyword" placeholder="搜索歌曲" @change="onChange" @search="onSearch" />
    <view class="history" v-show="keywordList.length !== 0">
      <view class="history-top">
        <text class="jl">历史记录</text>
        <text class="iconfont icon-shanchu" @click="clearHistory"></text>
      </view>
      <view class="history-container">
        <text class="keyword-item" v-for="(item, index) in keywordList" :key="index" @click="searchHistory(item)">{{ item }}</text>
      </view>
    </view>
    <view class="history-list" v-show="state.searchList.length !== 0">
      <view class="list">
        <view class="song-item" v-for="item in state.searchList" :key="item.song_id" @click="updateIndex(item)">
          <view class="song">
            <text class="songName">{{ item.song_songname }}</text>
            <text class="singer">{{ item.singer_name }}</text>
          </view>
          <text class="iconfont icon-bofang1"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useMusic } from '../../store/index.js';
import { getAllSongs } from '../../api/api.js';
let keyword = ref('');
let keywordList = reactive((uni.getStorageSync('keywordList') !== '' && JSON.parse(uni.getStorageSync('keywordList'))) || []);
let state = reactive({
  searchList: []
});
const musicStore = useMusic();
// 输入实时关键词触发
const onChange = async event => {};
// 用户按下回车触发
const onSearch = async event => {
  if (event.detail.trim() !== '') {
    keyword.value = event.detail.trim();
    let keywordSongs = await getAllSongs(keyword.value);
    if (keywordSongs.length !== 0) {
      state.searchList = keywordSongs;
      // console.log(keywordSongs, '按下回车');
    }
    // 数组去重
    if (keywordList.indexOf(keyword.value) !== -1) return;
    // 限制数组长度
    if (keywordList.length > 9) {
      // 删掉最后一个
      keywordList.splice(keywordList.length - 1, 1);
    }
    keywordList.unshift(keyword.value);
    // 为了刷新之后还能看见历史记录，应该，将历史记录存入本地
    uni.setStorageSync('keywordList', JSON.stringify(keywordList));
  } else {
    state.searchList = [];
  }
};

// 点击历史记录里的每一项
const searchHistory = async item => {
  let keywordSongs = await getAllSongs(item);
  state.searchList = keywordSongs;
};

// 点击清空历史记录
const clearHistory = () => {
  keywordList.splice(0);
  uni.removeStorageSync('keywordList');
  state.searchList = [];
};

const updateIndex = item => {
  // 向播放列表中追加歌曲
  musicStore.pushPlayList(item);
  // 修改下标
  musicStore.updatePlayListIndex(musicStore.playList.length - 1);
  // 跳转到歌曲详情页
  uni.navigateTo({
    url: `/pages/songDetail/songDetail`
  });
};

onLoad(() => {});
</script>

<style lang="scss">
.search {
  color: #fff;
}
.history {
  padding: 20rpx 30rpx;
  padding-bottom: 0;
  &-top {
    margin-bottom: 20rpx;
    .jl {
      font-weight: 700;
    }
    .iconfont {
      float: right;
    }
  }
  &-container {
    .keyword-item {
      display: inline-block;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
      background-color: #a3a3a3;
      border-radius: 32rpx;
      padding: 6rpx 16rpx;
      font-size: 28rpx;
    }
  }
}
.history-list {
  padding: 20rpx 30rpx;
  .list {
    background: #1e1e1e;
    border-radius: 30rpx;
    overflow: hidden;
  }
  .song-item {
    height: 100rpx;
    padding: 16rpx 30rpx;
    display: flex;
    color: #fff;
    justify-content: space-between;
    &:first-child {
      padding-bottom: 0;
    }
    .song {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .songName {
        font-size: 34rpx;
        margin-bottom: 5rpx;
      }
      .singer {
        font-size: 28rpx;
        color: #a3a3a3;
      }
    }
    .iconfont {
      line-height: 100rpx;
      font-size: 50rpx;
      color: #a3a3a3;
    }
  }
}
</style>
