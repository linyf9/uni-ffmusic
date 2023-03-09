<template>
  <van-grid column-num="2" gutter="0" class="gedans-grid" :border="false">
    <van-grid-item use-slot v-for="item in state.geDanList" :key="item.list_id" content-class="van-grid-item__content" @click="toListDetil(item.list_id)">
      <image :src="item.list_imgpath"></image>
      <text>{{ item.list_title }}</text>
    </van-grid-item>
  </van-grid>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getGeDanDetails } from '../../api/api.js';
const state = reactive({
  geDanList: []
});
// 获取歌单全部数据
const getGedansData = async () => {
  // 获取全部歌单基本数据
  // 获取全部歌单基本数据
  let res = await getGeDanDetails();
  state.geDanList = res;
  // musicStore.getGeDanDetails();
  uni.setNavigationBarTitle({
    title: `歌单广场`
  });
};

// 跳转到歌单详情页
const toListDetil = list_id => {
  uni.navigateTo({
    url: `/pages/listDetail/listDetail?list_id=${list_id}`
  });
};

onLoad(() => {
  // 加载所有歌单，并设置标题
  getGedansData();
});
</script>

<style lang="scss">
.gedans-grid {
  .van-grid-item__content {
    color: #fff;
    background-color: #000;
    font-size: 26rpx;
    image {
      width: 320rpx;
      height: 300rpx;
    }
    text {
      display: inline-block;
      width: 320rpx;
    }
  }
}
</style>
