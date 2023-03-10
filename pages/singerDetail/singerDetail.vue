<template>
  <image :src="state.singerInfo.singer_avatar" mode="" class="bigimg"></image>
  <view class="singerDetail">{{ details }}</view>
</template>

<script setup>
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref, reactive, computed } from 'vue';
import { getSingerInfo } from '../../api/api.js';
const state = reactive({
  singerInfo: {},
  singer_id: 1
});
const getSinger = async () => {
  let { createdAt, updatedAt, ...singerInfo } = await getSingerInfo(state.singer_id);
  state.singerInfo = singerInfo;
  console.log(state.singerInfo);
  // 动态设置标题
  uni.setNavigationBarTitle({
    title: `${state.singerInfo.singer_name}`
  });
};
const details = computed(() => {
  if (state.singerInfo) {
    const arr = state.singerInfo.singer_details.split('。').map(item => {
      if (item != '') {
        return item;
      }
    });
    const newArr = arr.filter(item => {
      if (item) {
        return item;
      }
    });
    let str = '';
    if (newArr.length > 8) {
      str = newArr.slice(0, 9).join('。') + '。';
    } else {
      str = newArr.join('。') + '。';
    }
    console.log(str);
    return str;
  }
});
onLoad(options => {
  let singer_id = options.song_singerid;
  state.singer_id = singer_id;
  // 获取歌手信息
  getSinger();
});
</script>

<style lang="scss">
.bigimg {
  width: 100%;
  height: 500rpx;
}
.singerDetail {
  padding: 1rpx 12rpx;
  color: #fff;
  font-size: 30rpx;
  text-align: justify;
  text-indent: 2em;
  line-height: 50rpx;
  text {
  }
}
</style>
