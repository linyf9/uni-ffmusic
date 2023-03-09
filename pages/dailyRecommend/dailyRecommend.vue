<template>
  <view class="header">
    <!-- :class="[yf.rank]" -->
    <view
      class="rank"
      v-if="state.pageTitle === '飙升榜' || state.pageTitle === '热歌榜' || state.pageTitle === '中文dj榜'"
      :style="{ background: state.pageTitle === '飙升榜' ? 'darkred' : state.pageTitle === '热歌榜' ? 'darkcyan' : state.pageTitle === '中文dj榜' ? 'goldenrod' : '#000' }"
    >
      <view class="content">
        <text class="title">{{ state.pageTitle }}</text>
        <text class="self" :class="{ dj: state.pageTitle === '中文dj榜' }">{{ state.pageTitle }}</text>
      </view>
    </view>
    <image src="../../static/images/bj.webp" v-else></image>
  </view>

  <!-- 列表内容区域 -->
  <my-listscroll :list="state.songList" :pageTitle="state.pageTitle"></my-listscroll>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMusic } from '../../store/index.js';
import { reactive, ref, useCssModule, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import bus from '../../utils/mittBus.js';
import { getDailyRecommend, getRecommendSongs, getUpRank, getHotRank, getZwDjRank } from '../../api/api.js';

//点击音乐的下标
// let index = ref(0);
let musicStore = useMusic();
const state = reactive({
  index: 0, //点击音乐的下标
  songList: [], // 歌曲播放列表
  pageTitle: '' //页面标题
});
// let { dailyRecommendList, musicId } = storeToRefs(musicStore);

const css = reactive({
  color: '#fff',
  content: '0987'
});

// 1. 获取每日推荐歌曲
const getDailySongs = async () => {
  let res = await getDailyRecommend();
  state.songList = res;
  // musicStore.playList = res;
  // musicStore.updatePlayList(res);
  // console.log(musicStore.playList);
};

// 2. 获取推荐歌曲
const getSongs = async () => {
  // 获取推荐歌曲
  let res = await getRecommendSongs();
  state.songList = res;
  // musicStore.playList = res;
  // musicStore.updatePlayList(res);
  // console.log(musicStore.playList);
};

// 3. 获取飙升榜歌曲
const getupRank = async () => {
  let res = await getUpRank();
  state.songList = res;
  // musicStore.playList = res;
  // musicStore.updatePlayList(res);
};

// 4. 获取热榜歌曲
const gethotRank = async () => {
  let res = await getHotRank();
  state.songList = res;
  // musicStore.playList = res;
  // musicStore.updatePlayList(res);
};

// 5. 获取中文dj榜歌曲
const getzwDjRank = async () => {
  let res = await getZwDjRank();
  state.songList = res;
  // musicStore.playList = res;
  // musicStore.updatePlayList(res);
};

onLoad(options => {
  let title = options.title;
  // 保存页面标题
  state.pageTitle = title;
  css.content = title;
  if (title == '每日推荐') {
    getDailySongs();
    // console.log(musicStore.playList, '7777');
  }
  if (title == '歌曲推荐') {
    getSongs();
  }
  if (title == '飙升榜') {
    getupRank();
  }
  if (title == '热歌榜') {
    gethotRank();
  }
  if (title == '中文dj榜') {
    getzwDjRank();
  }
  uni.setNavigationBarTitle({
    title: title
  });

  // console.log(musicStore.playList, '7777');
  // 订阅消息，如果要搞随机播放，就要多弄一个随机播放的标识，然后让listDetail去找随机的下标，取值范围要在数组中，如果随机到与之前一样的，就得重新随机
  // 如果是单曲循环的话，就还是继续播放当前的音乐即可
  // bus.on('switchType', type => {
  //   let { index } = state;
  //   if (type === 'pre') {
  //     if (index === 0) {
  //       index = musicStore.playList.length;
  //     }
  //     // 上一首
  //     index -= 1;
  //   } else {
  //     if (index === musicStore.playList.length - 1) {
  //       index = -1;
  //     }
  //     // 下一首
  //     index += 1;
  //   }
  //   state.index = index;
  //   let musicId = musicStore.playList[index].song_id;
  //   // 发布消息
  //   bus.emit('musicId', musicId);
  //   // console.log(musicId);
  // });
});
</script>

<!-- module="yf" -->
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 300rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
.rank {
  position: relative;
  width: 100%;
  height: 100%;
  // line-height: 300rpx;
  // text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    // width: 100rpx;
    // height: 100rpx;
    background-color: #red;
    font-size: 80rpx;
    display: flex;
    z-index: 2;
    .title {
      font-size: 80rpx;
      color: v-bind('css.color');
      z-index: 999;
    }
    .self {
      color: #000;
      position: absolute;
      left: 50%;
      // top: 50%;
      font-size: 90rpx;
      transform: translate(-86rpx, 16rpx) scaleY(0.5) skew(-38deg);
      -webkit-filter: blur(1rpx);
      -webkit-mask-image: linear-gradient(transparent, black);
      z-index: 1;
    }
    .dj {
      transform: translate(-126rpx, 13rpx) scaleY(0.5) skew(-38deg);
    }
  }
  // z-index: 2;
  // .title {
  //   font-size: 80rpx;
  //   color: v-bind('css.color');
  //   z-index: 99;
  // }
  // .self {
  //   color: #000;
  //   position: absolute;
  //   left: 50%;
  //   // top: 50%;
  //   font-size: 90rpx;
  //   transform: translate(-100rpx, 22rpx) scaleY(0.5) skew(-38deg);
  //   -webkit-filter: blur(1rpx);
  //   -webkit-mask-image: linear-gradient(transparent, black);
  // }
}
// .self {
//   color: #000;
//   // position: absolute;
//   // left: 50%;
//   // top: 50%;
//   transform: scaleY(0.5) skew(35deg);
//   -webkit-filter: blur(6rpx);
//   z-index: -1;
//   -webkit-mask-image: linear-gradient(transparent, black);
// }

// .listContainer {
//   position: relative;
//   top: -20rpx;
//   padding: 0 20rpx;
//   border-radius: 30rpx;
//   background: #ffffff;
// .listheaderheight: 80rpx;
// line-height: 80rpx;
// display: flex;
// justify-content: space-between;
// align-content: center;
// .left {
//   height: 80rpx;
//   display: flex;
//   align-items: center;
// }
// .iconfont {
//   font-size: 70rpx;
//   color: #2e7797;
// }
// .listScroll {
//   height: calc(100vh - 400rpx);
//   padding-bottom: 20rpx;
//   .scrollItem {
//     position: relative;
//     display: flex;
//     margin-bottom: 20rpx;
//     image {
//       width: 100rpx;
//       height: 100rpx;
//       border-radius: 8rpx;
//     }
//     .musicInfo {
//       display: flex;
//       flex-direction: column;
//       margin-left: 20rpx;
//       text {
//         height: 50rpx;
//         line-height: 50rpx;
//         font-size: 26rpx;
//         max-width: 500rpx;
//         white-space: nowrap;
//         overflow: hidden;
//         text-overflow: ellipsis;
//       }
//       .author {
//         font-size: 24rpx;
//       }
//     }
//     .iconfont {
//       position: absolute;
//       right: 0;
//       width: 100rpx;
//       height: 100rpx;
//       line-height: 100rpx;
//       text-align: right;
//     }
//   }
// }
// }
</style>
