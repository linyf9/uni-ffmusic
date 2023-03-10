<template>
  <image :src="playList[playListIndex].song_imgpath" class="bigimg"></image>
  <view class="song">
    <view class="song-container" v-if="!isLyricShow" @click="isLyricShow = !isLyricShow">
      <image src="../../static/images/needle-ab.png" class="needle-img" :class="state.isPlay && 'needle-rotate'"></image>
      <image src="../../static/images/cd.png" class="cd-img" :class="state.isPlay && 'disc-animation'"></image>
      <image :src="playList[playListIndex].song_imgpath" class="song-img" :class="state.isPlay && 'disc-animation'"></image>
    </view>
    <!-- @click="isLyricShow = !isLyricShow" -->
    <view class="singer" v-if="!isLyricShow">
      <text @click="toSingerDetail(playList[playListIndex].song_singerid)">{{ playList[playListIndex].singer_name }}</text>
      <text>&nbsp;-&nbsp;{{ playList[playListIndex].song_songname }}</text>
    </view>
    <view class="lyric" v-if="isLyricShow" id="musicLyric" @click="isLyricShow = !isLyricShow">
      <text
        class="other"
        :style="{
          color: index == state.nowlirics ? '#EB4A38' : '#ffffff',
          fontSize: index == state.nowlirics ? '32rpx' : '26rpx',
          transform: 'translateY(' + state.height + 'rpx)'
        }"
        v-for="(item, index) in lyric"
        :key="index"
      >
        {{ item.lrc }}
      </text>
    </view>
    <view class="footer">
      <!-- 进度条 -->
      <view class="footer-top">
        <!-- 总进度条 -->
        <view class="bar">
          <!-- 实时进度条 -->
          <view class="audio-currentTime-bar" :style="{ width: state.currentWidth + '%' }">
            <!-- 小圆球 -->
            <view class="audio-circle"></view>
          </view>
        </view>
      </view>
      <!-- 底部 -->
      <view class="footer-bottom">
        <text
          class="iconfont"
          :class="state.playModel === 0 ? 'icon-liebiaoxunhuan' : state.playModel === 1 ? 'icon-danquxunhuan' : 'icon-suijibofang'"
          @click="changeModel"
        ></text>
        <!-- <text class="iconfont icon-zuobofang" id="pre" @click="handleSwitch"></text> -->
        <text class="iconfont icon-zuobofang" @click="goPlay(-1)"></text>
        <!-- icon-24gl-playCircle 暂停 -->
        <text @click="musicPlay" class="iconfont  big" :class="state.isPlay ? 'icon-24gl-pauseCircle' : 'icon-24gl-playCircle'"></text>
        <!-- <text class="iconfont icon-youbofang" id="next" @click="handleSwitch"></text> -->
        <text class="iconfont icon-youbofang" @click="goPlay(1)"></text>
        <!-- icon-aixin1 实心 -->
        <text class="iconfont " :class="state.isLike ? 'icon-aixin1' : 'icon-aixin'" @click="updateIsLike"></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getSongById, getSongLyric, getSongMP3Src } from '../../api/api.js';
import { ref, reactive, nextTick, onBeforeMount, onBeforeUnmount, onUpdated, watch, computed } from 'vue';
import bus from '../../utils/mittBus.js';
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { useMusic, useUser } from '../../store/index.js';
import { getToken } from '../../utils/auth.js';

const musicStore = useMusic();
const userStore = useUser();

let { playList, playListIndex, isMusicPlay } = storeToRefs(musicStore);

const props = defineProps({
  type: {
    type: String,
    default: '',
    required: false
  }
});

let state = reactive({
  song: {}, // 歌曲对象
  lyric: '', //歌词
  isPlay: false, // 是否播放歌曲
  musicId: '', //音乐id
  musicLink: '', //音乐链接
  currentWidth: 0, //实时进度条宽度
  top: '20rpx',
  nowlirics: '',
  height: '',
  playModel: 0,
  isLike: false
});
let audioObj = {}; //音频对象

const isLyricShow = ref(false); //是否显示歌词
// 歌词
let lyric = computed(() => {
  if (musicStore.lyric) {
    // 对歌词的处理
    let arr = musicStore.lyric.split(/\r\n+/).map((item, i) => {
      let min = item.slice(item.indexOf('[') + 1, item.indexOf(':'));
      let sec = item.slice(item.indexOf(':') + 1, item.indexOf('.'));
      let mill = item.slice(item.indexOf('.') + 1, item.indexOf(']'));
      let lrc = item.slice(item.indexOf(']') + 1, item.length);
      // 总毫秒数
      let time = parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(mill);

      return { min, sec, mill, lrc, time };
    });

    arr.forEach((item, i) => {
      if (i === arr.length - 1) {
        //是否在最后一句
        item.pre = 0; //最后一句，就追加一属性pre，设置为0
      } else {
        item.pre = arr[i + 1].time; //最后一句，就追加一属性pre，设置为下一句的时间
      }
    });
    return arr;
  }
});

// 根据歌曲id获取/修改歌词
const getSongLyricById = async musicId => {
  musicStore.updateLyric(musicId);
};

// 点击歌手名称，跳转到歌手详情页
const toSingerDetail = song_singerid => {
  uni.navigateTo({
    url: `/pages/singerDetail/singerDetail?song_singerid=${song_singerid}`
  });
};

// 点击按钮，控制音乐的播放/暂停
const musicPlay = () => {
  state.isPlay = !state.isPlay;
  controlPlay(state.isPlay, playList.value[playListIndex.value].song_id, state.musicLink);
};
// 控制音乐播放/暂停的具体功能函数
const controlPlay = async (isPlay, musicId, musicLink) => {
  if (isPlay) {
    // 音乐播放
    if (!musicLink) {
      // 如果没有音乐链接，就获取音乐链接，并更新到state中
      // 获取当前歌曲id的音频链接
      musicLink = await getSongMP3Src(musicId);
      state.musicLink = musicLink;
    }
    // 赋值为当前歌曲音频链接
    audioObj.src = musicLink;
    audioObj.title = playList.value[playListIndex.value].song_songname;
    // 播放时，如果用户有登录，就将播放歌曲放入最近播放列表中
    if (getToken('token') !== '' && getToken('token')) {
      userStore.updateHistoryList({ song: playList.value[playListIndex.value], isLike: state.isLike });
    }

    // musicStore.ctWidth = state.currentWidth;
  } else {
    // 音乐暂停
    audioObj.pause();
    // 暂停时
    musicStore.ctWidth = state.currentWidth;
  }
};
// 修改播放状态的功能函数
const updateIsPlay = isplay => {
  state.isPlay = isplay;
  // 修改全局（仓库）中的 isMusicPlay
  isMusicPlay.value = isplay;
};

// 切歌：左右播放的事件回调
const goPlay = num => {
  // 播放下一首音乐的时候，应该先关闭当前播放的音乐
  audioObj.stop();
  // state.currentWidth = 0;

  let index = playListIndex.value + num;
  if (index < 0) {
    index = playList.value.length - 1;
  } else if (index >= playList.value.length) {
    index = 0;
  }
  // 修改数组下标，从而切换另一首歌
  musicStore.updatePlayListIndex(index);
  // 左右切歌时，如果该歌在收藏列表中，就置为true
  for (let i = 0; i < userStore.isLikeList.length; i++) {
    if (getToken('token') && userStore.isLikeList[i].song.song_id === playList.value[playListIndex.value].song_id) {
      state.isLike = userStore.isLikeList[i].isLike;
      break;
    } else {
      state.isLike = false;
    }
  }

  /* 根据下标获取数组中的其他歌曲的id*/
  let musicId = playList.value[playListIndex.value].song_id;
  // 动态设置页面标题
  uni.setNavigationBarTitle({
    title: `${playList.value[playListIndex.value].song_songname}`
  });
  // 获取最新的歌词
  getSongLyricById(musicId);
  // 自动控制播放最新的歌曲
  controlPlay(true, musicId);
};

// changeModel播放模式
const changeModel = () => {
  if (state.playModel === 0) {
    state.playModel = 1;
  } else if (state.playModel === 1) {
    state.playModel = 2;
  } else if (state.playModel === 2) {
    state.playModel = 0;
  }
};

// 监听播放状态的变化，从而调用不同的播放节奏
watch(
  () => state.playModel,
  value => {
    // console.log(value);
    if (value === 0) {
      audioObj.onEnded(() => {
        goPlay(1);
      });
    } else if (value === 1) {
      audioObj.onEnded(() => {
        goPlay(0);
      });
    } else {
      audioObj.onEnded(() => {
        // 产生一个随机数
        let randomIndex = Math.floor(Math.random() * playList.value.length);
        console.log(randomIndex);
        // 播放下一首音乐的时候，应该先关闭当前播放的音乐，并把进度条置为0
        audioObj.stop();
        state.currentWidth = 0;
        // 修改数组下标
        musicStore.updatePlayListIndex(randomIndex);
        /* 根据下标获取数组中的其他歌曲的id*/
        let musicId = playList.value[playListIndex.value].song_id;
        // 动态设置页面标题
        uni.setNavigationBarTitle({
          title: `${playList.value[playListIndex.value].song_songname}`
        });
        // 获取最新的歌词
        getSongLyricById(musicId);
        // 自动控制播放最新的歌曲
        controlPlay(true, musicId);
      });
    }
  }
);

// 用户点击收藏，改变收藏状态，和收藏列表
const updateIsLike = () => {
  if (!getToken('token')) {
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
    return;
  }
  // 以下操作是用户登录后的操作
  state.isLike = !state.isLike;
  userStore.updateIsLikeList({ song: playList.value[playListIndex.value], isLike: state.isLike });
};

// onLoad生命周期函数
onLoad(async options => {
  let musicId = playList.value[playListIndex.value].song_id;

  // 获取歌词
  getSongLyricById(musicId);

  // 动态设置页面标题
  uni.setNavigationBarTitle({
    title: `${playList.value[playListIndex.value].song_songname}`
  });

  // 创建音频实例
  audioObj = uni.getBackgroundAudioManager();

  // 解决暂停之后，退出重进同一首播放的歌曲，应该让进度条停留到上次播放的位置
  if (!musicStore.isMusicPlay && musicStore.musicId === musicId) {
    state.currentWidth = musicStore.ctWidth;
  }

  // 解决后退，再次进入同一首歌曲时，判断当前页面的歌曲是否在播放（拿仓库中存的歌曲与当前歌曲比较，同一首就显示播放状态）
  if (musicStore.isMusicPlay && musicStore.musicId === musicId) {
    // 因为重新进入一首歌曲，会看到是未播放的状态，但是音乐已经在播放了，所以应该立马改为播放状态
    state.isPlay = true;
  }

  // 监听音乐播放
  audioObj.onPlay(() => {
    // 音乐播放的时候就做：
    updateIsPlay(true);
    // 修改全局（仓库）中的 musicId
    musicStore.updateMusicId(musicId);
    // musicStore.musicId = musicId;
  });
  // 监听背景音乐暂停;
  audioObj.onPause(() => {
    updateIsPlay(false);
  });
  // 监听音乐停止
  audioObj.onStop(() => {
    updateIsPlay(false);
  });
  // 监听音乐自然播放结束
  audioObj.onEnded(() => {
    goPlay(1);
    state.currentWidth = 0;
  });

  // 监听（背景）音乐实时播放的进度
  audioObj.onTimeUpdate(() => {
    // 将当前歌曲的播放进度，存到库中
    // musicStore.ctWidth = (audioObj.currentTime / audioObj.duration) * 100;
    state.currentWidth = (audioObj.currentTime / audioObj.duration) * 100;

    // 如果不是同一首歌，就应该给state.currentWidth赋值为0
    if (musicStore.musicId !== musicId) {
      state.currentWidth = 0;
    }

    // 单位是秒，现在换算为毫秒
    state.currentTime = audioObj.currentTime * 1000;
    var realtime = audioObj.currentTime * 1000;
    for (var i = 1; i < lyric.value.length; i++) {
      if (realtime < lyric.value[i].time) {
        // newi 标识是否是播放的歌词，赋值给state.nowlirics
        var newi = i - 1;
        state.nowlirics = newi;
        // state.top = newi * -72 + 598 + 'rpx';
        // 每句歌词上滚的距离
        var height = 348 - newi * 105.6;
        // 配合transform: translateY(-) 来实现，每句歌词上滚的距离
        state.height = height;
        break;
      }
    }
    // 解决最后一句歌词无样式的问题
    if (realtime >= lyric.value[lyric.value.length - 1].time) {
      state.nowlirics = lyric.value.length - 1;
      state.height = 348 - state.nowlirics * 105.6;
    }
  });
});

onShow(async () => {
  if (props.type === 'like') {
    for (let i = 0; i < userStore.isLikeList.length; i++) {
      if (getToken('token') && userStore.isLikeList[i].song.song_id === playList.value[playListIndex.value].song_id) {
        state.isLike = userStore.isLikeList[i].isLike;
      }
    }
  } else {
    for (let i = 0; i < userStore.historyList.length; i++) {
      if (getToken('token') && userStore.historyList[i].song.song_id === playList.value[playListIndex.value].song_id) {
        for (let j = 0; j < userStore.isLikeList.length; j++) {
          console.log(userStore.isLikeList[j].song.song_id, userStore.historyList[i].song.song_id);
          if (getToken('token') && userStore.isLikeList[j].song.song_id === userStore.historyList[i].song.song_id) {
            state.isLike = true;
            break;
          } else {
            state.isLike = false;
          }
        }
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.bigimg {
  width: 100%;
  height: 100%;
  position: absolute;
  filter: blur(140rpx);
  z-index: -1;
}
.song {
  color: #fff;
  overflow: hidden;
}

.song-container {
  width: 100%;
  height: 900rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .needle-img {
    width: 200rpx;
    height: 300rpx;
    position: absolute;
    left: 46%;
    transform-origin: 30rpx 30rpx;
    transform: rotate(-20deg);
    transition: all 1s;
  }
  .needle-rotate {
    transform: rotate(1deg);
  }
  .cd-img {
    width: 500rpx;
    height: 500rpx;
    position: absolute;
    bottom: 230rpx;
    z-index: -1;
  }
  .disc-animation {
    animation: disc 8s linear infinite;
    animation-delay: 1s;
  }
  /*设置动画帧 1.from to(只有起始帧和结束帧)  2.百分比(不止两帧)*/
  @keyframes disc {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .song-img {
    width: 320rpx;
    height: 320rpx;
    border-radius: 50%;
    position: absolute;
    bottom: 314rpx;
  }
}

.singer {
  text-align: center;
  font-size: 34rpx;
  height: 53.99rpx;
}

// 歌词
.lyric {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 749rpx;
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
  margin-top: 100rpx;
  margin-bottom: 105rpx;
  scroll-behavior: smooth;
  .other {
    display: inline-block;
    white-space: nowrap;
    color: #fff;
    font-size: 26rpx;
    // margin-bottom: 50rpx;
    transform: translateY(360rpx);
    height: 107rpx !important;
    line-height: 107rpx;
  }
  .active {
    color: #ffa5d8;
    font-size: 36rpx;
  }
}

.footer {
  position: fixed;
  width: 100%;
  // bottom: 60rpx;
  .footer-top {
    box-sizing: border-box;
    width: 640rpx;
    height: 100rpx;
    margin: auto;
    // padding-top: 30rpx;
    line-height: 100rpx;
    display: flex;
    // border: 1rpx solid red;
    // justify-content: center;
    // align-items: center;
    .bar {
      position: relative;
      // width: 450rpx;
      width: 700rpx;
      height: 4rpx;
      background-color: rgba(0, 0, 0, 0.2);
      margin: auto;
      .audio-currentTime-bar {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 0rpx;
        height: 4rpx;
        background-color: #fff;
        .audio-circle {
          position: absolute;
          right: -12rpx;
          top: -4rpx;
          width: 12rpx;
          height: 12rpx;
          border-radius: 50%;
          background-color: #fff;
        }
      }
    }
  }
  .footer-bottom {
    display: flex;
    width: 100%;
    height: 200rpx;
    line-height: 120rpx;
    justify-content: space-around;
    // background-color: red;

    .iconfont {
      font-size: 50rpx;
    }
    .icon-aixin1 {
      color: red;
    }
    .big {
      font-size: 90rpx;
    }
  }
}
</style>
