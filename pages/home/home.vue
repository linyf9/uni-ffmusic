<template>
  <view class="home">
    <!-- 搜索 -->
    <view class="search" @click="toSearch">
      <text class="iconfont icon-sousuo"></text>
      <text class="text">搜索歌曲</text>
    </view>

    <!-- 轮播图区域，展示6首左右的歌吧 -->
    <swiper class="banners" indicator-color="ivory" indicator-active-color="#000000" :indicator-dots="true" circular :autoplay="true" :interval="3000" :duration="500">
      <swiper-item><image src="../../static/banners/安.jpg"></image></swiper-item>
      <swiper-item><image src="../../static/banners/与世界温柔相处.jpg"></image></swiper-item>
      <swiper-item><image src="../../static/banners/刘恋.jpg"></image></swiper-item>
      <swiper-item><image src="../../static/banners/星落.jpg"></image></swiper-item>
      <swiper-item><image src="../../static/banners/汐.jpg"></image></swiper-item>
      <swiper-item><image src="../../static/banners/热门.jpg"></image></swiper-item>
      <swiper-item><image src="../../static/banners/不冬眠.jpg"></image></swiper-item>
    </swiper>

    <!-- 三个图标：每日推荐、歌单、排行榜 -->
    <view class="nav-icon">
      <view class="icon-item" @click="toDailyDetail('每日推荐')">
        <text class="iconfont icon-tuijian1"></text>
        <text>每日推荐</text>
      </view>
      <view class="icon-item" @click="toGedanList">
        <text class="iconfont icon-yinlegedan-"></text>
        <text>歌单</text>
      </view>
      <view class="icon-item">
        <text class="iconfont icon-paihangbang1" @click="toRank"></text>
        <text>排行榜</text>
      </view>
    </view>

    <!-- 歌单推荐 -->
    <view class="list">
      <view class="header" @click="toGedanList">
        <text class="text">歌单推荐</text>
        <text class="iconfont icon-youjiantou"></text>
      </view>
      <scroll-view class="list-scroll" scroll-x enable-flex>
        <view class="scroll-item" v-for="item in state.geDanList" :key="item.list_id" @click="toListDetil(item.list_id)">
          <image :src="item.list_imgpath"></image>
          <text>{{ item.list_title }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 推荐歌曲 -->
    <view class="song">
      <view class="header" @click="toDailyDetail('歌曲推荐')">
        <text class="text">歌曲推荐</text>
        <text class="iconfont icon-youjiantou"></text>
      </view>
      <swiper class="song-swiper" circular next-margin="50rpx">
        <swiper-item v-for="(songs, index) in state.recommendList" :key="index">
          <view class="swiper-item">
            <view class="music-item" v-for="(item, index) in songs" :key="item.song_id" @click="toSongDetail(songs, index)">
              <image :src="item.song_imgpath"></image>
              <view class="music">
                <text class="music-name">{{ item.song_songname }}</text>
                <text class="singer-name">{{ item.singer_name }}</text>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 排行榜 -->
    <view class="rank">
      <view class="up-rank" @click="toDailyDetail('飙升榜')">飙升榜</view>
      <view class="hot-rank" @click="toDailyDetail('热歌榜')">热歌榜</view>
      <view class="dj-rank" @click="toDailyDetail('中文dj榜')">中文dj榜</view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useMusic } from '../../store/index.js';
import { storeToRefs } from 'pinia';
import bus from '../../utils/mittBus.js';

import {
  getDailyRecommend, //每日推荐列表
  getGeDanDetails, //歌单基本信息列表
  getRecommendSongs, // 推荐歌曲列表
  getHotRank, // 热歌列表
  getUpRank, // 飙升榜列表
  getZwDjRank, //中文dj列表
  getSongById,
  getSongLyric,
  userLogin
} from '../../api/api.js';

const active = ref(0);
let musicStore = useMusic();
const state = reactive({
  index: 0, //点击音乐的下标
  geDanList: [],
  recommendList: []
});

// 跳转到搜索页面
const toSearch = () => {
  uni.navigateTo({
    url: '/pages/search/search'
  });
};

// 跳转到(每日)推荐页
const toDailyDetail = title => {
  uni.navigateTo({
    url: `/pages/dailyRecommend/dailyRecommend?title=${title}`
  });
};

// 跳转到歌单广场页面
const toGedanList = () => {
  uni.navigateTo({
    url: '/pages/gedanList/gedanList'
  });
};

// 跳转到歌单详情页
const toListDetil = list_id => {
  uni.navigateTo({
    url: `/pages/listDetail/listDetail?list_id=${list_id}`
  });
};

// 跳转到歌曲详情页
const toSongDetail = async (list, index) => {
  // 点击歌曲，将当前歌曲列表赋值给库中的musicStore.playList
  musicStore.updatePlayList(list);
  // 修改列表中的下标（为了点击播放另一首歌）
  musicStore.updatePlayListIndex(index);
  // 跳转到歌曲详情页
  uni.navigateTo({
    url: `/pages/songDetail/songDetail`
  });
};

// 点击 “排行榜”
const toRank = () => {
  // 滚动到 底部排行榜位置
  uni.pageScrollTo({
    scrollTop: 500,
    duration: 300
  });
};

// 生命周期函数
onLoad(async () => {
  // 获取全部歌单基本数据
  let res1 = await getGeDanDetails();
  state.geDanList = res1;
  // 获取推荐歌曲数据
  let res2 = await getRecommendSongs();
  res2.splice(res2.length - 1);
  let arr1 = res2.slice(0, 3);
  let arr2 = res2.slice(3, 6);
  let arr3 = res2.slice(6, 9);
  let newArr = [arr1, arr2, arr3];
  state.recommendList = newArr;
});
</script>

<style lang="scss" scoped>
.home {
  padding: 0 30rpx;
  color: #fff;
}
.search {
  width: 100%;
  height: 70rpx;
  line-height: 70rpx;
  background-color: #f7f7f7;
  border-radius: 35rpx;
  color: #a3a3a3;
  margin-bottom: 30rpx;
  display: flex;
  .iconfont {
    margin-left: 20rpx;
  }
  .text {
    margin-left: 20rpx;
    font-size: 28rpx;
  }
}
.banners {
  width: 100%;
  height: 300rpx;
  border-radius: 20rpx;
  overflow: hidden;
  swiper-item {
    width: 100%;
    heigth: 100%;
    border-radius: 20rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}

.nav-icon {
  display: flex;
  justify-content: space-around;
  margin-top: 60rpx;
  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    .iconfont {
      width: 100rpx;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      border-radius: 50%;
      background-color: #2e7797;
      font-size: 50rpx;
    }
    text:last-child {
      margin-top: 20rpx;
    }
  }
}

.list {
  margin-top: 60rpx;
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    width: 25%;
    .text {
    }
    .iconfont {
      margin-left: 12rpx;
    }
  }
  .list-scroll {
    display: flex;
    // width: 200rpx;
    height: 273rpx;
    .scroll-item {
      margin-right: 28rpx;
      width: 200rpx;
      height: 200rpx;
      &:last-child {
        margin-right: 0rpx;
      }
      image {
        width: 200rpx;
        height: 200rpx;
        border-radius: 10rpx;
      }
      text {
        font-size: 26rpx;
        -webkit-line-clamp: 2; //（用来限制在一个块元素显示的文本的行数，2 表示最多显示 2 行。为了实现该效果，它需要组合其他的 WebKit 属性）
        display: -webkit-box; //（和 1 结合使用，将对象作为弹性伸缩盒子模型显示 ）
        -webkit-box-orient: vertical; //（和 1 结合使用 ，设置或检索伸缩盒对象的子元素的排列方式 ）
        overflow: hidden; //（文本溢出限定的宽度就隐藏内容）
        text-overflow: ellipsis;
      }
    }
  }
}

.song {
  margin-top: 60rpx;
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
    width: 25%;
    .text {
    }
    .iconfont {
      margin-left: 12rpx;
    }
  }
  .song-swiper {
    height: 430rpx;
    background: url('../../static/images/song_bj.webp') no-repeat;
    background-size: 100% 100%;
    swiper-item {
      .swiper-item {
        .music-item {
          display: flex;
          margin-top: 20rpx;
          image {
            width: 120rpx;
            height: 120rpx;
            border-radius: 6rpx;
          }
          .music {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 20rpx;
            .music-name {
              font-size: 30rpx;
              margin-bottom: 6rpx;
            }
            .singer-name {
              font-size: 26rpx;
            }
          }
        }
      }
    }
  }
}
.rank {
  margin-top: 60rpx;
  width: 100%;
  height: 270rpx;
  line-height: 220rpx;
  display: flex;
  justify-content: space-between;
  text-align: center;
  font-size: 36rpx;

  .up-rank {
    width: 31%;
    height: 220rpx;
    border-radius: 20rpx;
    background-color: darkred;
  }
  .hot-rank {
    width: 31%;
    height: 220rpx;
    border-radius: 20rpx;
    background-color: darkcyan;
  }
  .dj-rank {
    width: 31%;
    height: 220rpx;
    border-radius: 20rpx;
    background-color: goldenrod;
  }
}
</style>
