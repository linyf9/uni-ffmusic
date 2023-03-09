<template>
  <!-- 列表区域 -->
  <view class="listContainer">
    <!-- 列表头部 -->
    <view class="listHeader">
      <view class="left">
        <!-- <text class="iconfont icon-bofang"></text> -->
        <text>全部({{ list.length }}首)</text>
      </view>
    </view>
    <!-- 内容区 -->
    <scroll-view scroll-y="true" class="listScroll" @scrolltolower="handel">
      <!-- @click="toSongDetail(item.song_id, index)" -->
      <view class="scrollItem" v-for="(item, index) in list" :key="item.song_id" @click="playMusic(index)" v-if="list.length">
        <text class="rank">{{ index + 1 }}.</text>
        <image :src="item.song_imgpath"></image>
        <view class="musicInfo">
          <text class="musicName">{{ item.song_songname }}</text>
          <text class="author">{{ item.singer_name }}</text>
        </view>
        <text class="iconfont icon-gengduo2"></text>
      </view>
      <view class="loading" v-if="list.length">
        <view v-if="state.loading === 1">数据加载中...</view>
        <view v-if="state.loading === 2">没有更多了~</view>
      </view>
      <view class="noSongs" v-if="!list.length">暂无歌曲~</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { reactive } from 'vue';
import { useMusic } from '../../store/index.js';
import { getListSongs, getDailyRecommend, getRecommendSongs, getHotRank, getUpRank, getZwDjRank } from '../../api/api.js';
import bus from '../../utils/mittBus.js';

const musicStore = useMusic();

const state = reactive({
  currentPage: 1,
  loading: 0
});

const props = defineProps({
  list: {
    type: Array,
    default: [],
    required: false
  },
  list_id: {
    type: Number,
    required: false
  },
  pageTitle: {
    type: String,
    default: '',
    required: false
  }
});

const playMusic = index => {
  // 点击歌曲，将当前歌曲列表赋值给库中的musicStore.playList
  musicStore.updatePlayList(props.list);
  // 修改列表中的下标（为了点击播放另一首歌）
  musicStore.updatePlayListIndex(index);
  // 跳转到歌曲详情页
  uni.navigateTo({
    url: `/pages/songDetail/songDetail`
  });
};

// 滚动到底部触发
const handel = async () => {
  console.log('到底部了');
  if (state.loading === 2) return;
  state.currentPage++;
  state.loading = 1;
  console.log(state.currentPage, state.loading);

  // 歌单
  if (props.list_id) {
    console.log('到底部了888', props.list_id);
    let res = await getListSongs(props.list_id, state.currentPage);
    if (res.length === 0) {
      state.loading = 2;
    }
    props.list.push(...res);
  }

  // 每日推荐
  if (props.pageTitle === '每日推荐') {
    console.log('每日推荐');
    let res = await getDailyRecommend(state.currentPage);
    console.log(res);
    if (res.length === 0) {
      state.loading = 2;
    }
    props.list.push(...res);
  }
  // 歌曲推荐
  if (props.pageTitle === '歌曲推荐') {
    console.log('歌曲推荐');
    let res = await getRecommendSongs(state.currentPage);
    console.log(res);
    if (res.length === 0) {
      state.loading = 2;
    }
    props.list.push(...res);
  }
  // 飙升榜
  if (props.pageTitle === '飙升榜') {
    console.log('飙升榜');
    let res = await getUpRank(state.currentPage);
    console.log(res);
    if (res.length === 0) {
      state.loading = 2;
    }
    props.list.push(...res);
  }
  // 热歌榜
  if (props.pageTitle === '热歌榜') {
    console.log('热歌榜');
    let res = await getHotRank(state.currentPage);
    console.log(res);
    if (res.length === 0) {
      state.loading = 2;
    }
    props.list.push(...res);
  }
  // 中文dj榜
  if (props.pageTitle === '中文dj榜') {
    console.log('中文dj榜');
    let res = await getZwDjRank(state.currentPage);
    console.log(res);
    if (res.length === 0) {
      state.loading = 2;
    }
    props.list.push(...res);
  }
};
</script>

<style lang="scss" scoped>
.listContainer {
  position: relative;
  top: -20rpx;
  padding: 0 20rpx;
  border-radius: 30rpx;
  background: #ffffff;
  .listHeader {
    height: 80rpx;
    line-height: 80rpx;
    display: flex;
    justify-content: space-between;
    align-content: center;
    .left {
      height: 80rpx;
      display: flex;
      align-items: center;
    }
    .iconfont {
      font-size: 70rpx;
      color: #2e7797;
    }
  }

  .listScroll {
    height: calc(100vh - 400rpx);
    padding-bottom: 20rpx;

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

    .loading {
      text-align: center;
      font-size: 26rpx;
      color: #888;
      line-height: 2em;
    }

    .noSongs {
      text-align: center;
      color: #888;
      height: 100%;
      line-height: calc(100vh - 400rpx);
    }
  }
}
</style>
