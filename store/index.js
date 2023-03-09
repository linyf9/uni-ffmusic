import {
  defineStore
} from 'pinia' //引入pinia
import {
  getDailyRecommend,
  getGeDanDetails,
  getRecommendSongs,
  getHotRank,
  getUpRank,
  getZwDjRank,
  getSongById,
  getSongLyric,
  userLogin
} from '../api/api.js'
import {
  getToken,
  setToken,
  removeToken
} from '../utils/auth.js'



// useMusic 音乐仓库
//这里官网是单独导出  是可以写成默认导出的  官方的解释为大家一起约定仓库用use打头的单词 固定统一小仓库的名字不易混乱
export const useMusic = defineStore("music", {
  state: () => {
    return ({

      playList: [], // 播放列表数组
      playListIndex: 0, //播放列表的下标，切歌时改变即可
      // isbtnShow: false, //暂停按钮的显示的控制状态

      song: {}, //歌曲信息
      isMusicPlay: false,
      musicId: '',
      lyric: '', //歌词
      ctWidth: 0, // 当前实时播放的长度

      collectSongs: [], //用户收藏的歌曲
      recentSongs: [], //用户最近播放的歌曲
    }) //为了避免出错，返回的值用()包起来
  },

  actions: {

    async getSongById(song_id) {
      let res = await getSongById(song_id);
      this.song = res;
    },

    async getSongLyricById(song_id) {
      let res = await getSongLyric(song_id);
      this.lyric = res;
    },

    // 修改播放列表
    updatePlayList(playList) {
      this.playList = playList
      // console.log(this.playList, '99999');
    },
    // 向播放列表追加搜索时，点击的那首歌曲
    pushPlayList(value) {
      this.playList.push(value)
    },
    // 修改播放列表的下标
    updatePlayListIndex(playListIndex) {
      this.playListIndex = playListIndex
    },
    // 修改播放状态
    updateIsbtnShow(isbtnShow) {
      this.isbtnShow = isbtnShow
    },
    // 根据音乐id获取/修改歌词
    async updateLyric(musicId) {
      let res = await getSongLyric(musicId);
      this.lyric = res;
    },
    updateIsMusicPlay(value) {
      this.isMusicPlay = value
    },
    updateMusicId(value) {
      this.musicId = value
    },


  },

  getters: {

  }


})


// useUser 用户仓库
export const useUser = defineStore("user", {
  state: () => {
    return ({
      isLikeList: (uni.getStorageSync('isLikeList') !== '' && JSON.parse(uni.getStorageSync('isLikeList'))) ||
        [], // 用户点击收藏的歌曲 
      historyList: (uni.getStorageSync('historyList') !== '' && JSON.parse(uni.getStorageSync(
        'historyList'))) || [], // 用户最近播放的歌曲
    }) //为了避免出错，返回的值用()包起来
  },

  actions: {
    // 用户收藏列表
    updateIsLikeList({
      song,
      isLike
    }) {
      // 歌曲存在,且状态为喜欢,就不需要重复添加
      for (let i = 0; i < this.isLikeList.length; i++) {
        if (this.isLikeList[i] && this.isLikeList[i].song && this.isLikeList[i].song.song_id === song.song_id &&
          isLike) {
          return
        }
      }
      // 收藏
      if (isLike) {
        this.isLikeList.unshift({
          song,
          isLike
        })
        // 播放后收藏
        if (this.historyList.length !== 0) {
          if (this.historyList.some(item => item.song.song_id === song.song_id)) {
            let arr = this.historyList.map((item, index) => {
              if (item.song.song_id === song.song_id) {
                return index
              }
            })
            this.historyList[arr[0]] = {
              song,
              isLike: false
            }
            // console.log(this.historyList, '收藏');
            uni.setStorageSync('historyList', JSON.stringify(this.historyList))
          }
        }

        uni.setStorageSync('isLikeList', JSON.stringify(this.isLikeList))
      }
      // 取消收藏
      if (!isLike) {
        let arr = this.isLikeList.filter(item => item.song.song_id !== song.song_id)
        this.isLikeList = arr

        // 播放后取消收藏，对应历史记录也要将置为false
        if (this.historyList.length !== 0) {
          if (this.historyList.some(item => item.song.song_id === song.song_id)) {
            let arr = this.historyList.map((item, index) => {
              if (item.song.song_id === song.song_id) {
                // console.log(index, '098654');
                return index
              }
            })
            // this.historyList.splice(arr[0], 1, {
            //   song,
            //   isLike
            // })
            this.historyList[arr[0]] = {
              song,
              isLike: false
            }
            uni.setStorageSync('historyList', JSON.stringify(this.historyList))
          }
        }

        uni.setStorageSync('isLikeList', JSON.stringify(this.isLikeList))
      }

    },

    // 历史记录
    updateHistoryList({
      song,
      isLike
    }) {
      // 歌曲存在就不需要重复添加
      for (let i = 0; i < this.historyList.length; i++) {
        if (this.historyList[i] && this.historyList[i].song && this.historyList[i].song.song_id === song.song_id) {
          return
        }
      }

      this.historyList.unshift({
        song,
        isLike
      })
      // console.log(this.historyList, '888');
      // 本地储存
      uni.setStorageSync('historyList', JSON.stringify(this.historyList))
    },



  },

  getters: {

  }


})
