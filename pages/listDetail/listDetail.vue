<template>
  <image :src="state.playlist.list_imgpath" class="bigimg"></image>
  <view class="list">
    <view class="header">
      <image :src="state.playlist.list_imgpath"></image>
      <text>{{ state.playlist.list_details }}</text>
    </view>

    <!-- 列表内容区域 -->
    <my-listscroll :list="state.listSongs" :list_id="state.list_id"></my-listscroll>
  </view>
</template>

<script setup>
import { reactive, nextTick } from 'vue';
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import { getListData, getListSongs } from '../../api/api.js';
import bus from '../../utils/mittBus.js';

import { useMusic } from '../../store/index.js';

const state = reactive({
  playlist: {}, //歌单对象
  listSongs: [], //歌单里的歌曲播放列表
  index: 0, //点击音乐的下标
  list_id: 1
});

// onLoad
onLoad(async options => {
  let id = options.list_id;
  state.list_id = id;
  let res = await getListData(id);
  state.playlist = res;
  let res1 = await getListSongs(id);
  state.listSongs = res1;
  // 跳转过来时，页面一加载就设置 页面标题
  uni.setNavigationBarTitle({
    title: `${state.playlist.list_title}`
  });
});

onReachBottom(() => {
  console.log(333);
});
</script>

<style scoped lang="scss">
.bigimg {
  width: 100%;
  height: 500rpx;
  position: fixed;
  z-index: -1;
  filter: blur(60rpx);
}
.list {
  // color: #fff;
}
.header {
  // width: 100%;
  height: 300rpx;
  padding: 0 30rpx;
  color: #fff;

  // overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 30rpx;
    vertical-align: middle;
  }
  text {
    flex: 1;
    font-size: 32rpx;
    margin-left: 30rpx;
    text-align: justify;
  }
}

// .listContainer {
//   position: relative;
//   top: -20rpx;
//   padding: 0 20rpx;
//   border-radius: 30rpx;
//   background: #ffffff;
//   .listHeader {
//     height: 80rpx;
//     line-height: 80rpx;
//     display: flex;
//     justify-content: space-between;
//     align-content: center;
//     .left {
//       height: 80rpx;
//       display: flex;
//       align-items: center;
//     }
//     .iconfont {
//       font-size: 70rpx;
//       color: #2e7797;
//     }
//   }

//   .listScroll {
//     height: calc(100vh - 400rpx);
//     padding-bottom: 20rpx;
//     .scrollItem {
//       position: relative;
//       display: flex;
//       margin-bottom: 20rpx;
//       image {
//         width: 100rpx;
//         height: 100rpx;
//         border-radius: 8rpx;
//       }
//       .musicInfo {
//         display: flex;
//         flex-direction: column;
//         margin-left: 20rpx;
//         text {
//           height: 50rpx;
//           line-height: 50rpx;
//           font-size: 26rpx;
//           max-width: 500rpx;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }
//         .author {
//           font-size: 24rpx;
//         }
//       }
//       .iconfont {
//         position: absolute;
//         right: 0;
//         width: 100rpx;
//         height: 100rpx;
//         line-height: 100rpx;
//         text-align: right;
//       }
//     }
//   }
// }

// .container {
//   background-color: #fff;
//   padding: 0 30rpx;
//   border-top-left-radius: 30rpx;
//   border-top-right-radius: 30rpx;
//   position: relative;
//   top: 54rpx;
//   color: #000;
//   .top {
//     height: 80rpx;
//     display: flex;
//     align-items: center;
//     .iconfont {
//       font-size: 50rpx;
//       color: seagreen;
//       margin-right: 8rpx;
//     }
//   }
//   .list-scroll {
//     height: calc(100vh - 524rpx);
//     padding-bottom: 30rpx;
//     .scroll-item {
//       display: flex;
//       margin-bottom: 30rpx;
//       image {
//         width: 100rpx;
//         height: 100rpx;
//         border-radius: 10rpx;
//       }
//       .music-info {
//         display: flex;
//         flex-direction: column;
//         margin-left: 30rpx;

//         text {
//           height: 50rpx;
//           line-height: 50rpx;
//           font-size: 26rpx;
//           max-width: 500rpx;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }
//         .music-name {
//           font-size: 30rpx;
//         }
//       }
//       .iconfont {
//         position: absolute;
//         right: 0;
//         width: 100rpx;
//         height: 100rpx;
//         line-height: 100rpx;
//         text-align: right;
//       }
//     }
//   }
// }
</style>
