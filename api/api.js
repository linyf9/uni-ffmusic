import request from '../utils/request.js'

// 注册请求

// 登录请求

// 1. 获取每日推荐的歌曲
export const getDailyRecommend = (page = 1) => request({
  url: `/song/rank?song_rank=每日推荐&offset=${page}`,
  method: 'GET'
})

// 2. 获取全部歌单基本数据
export const getGeDanDetails = () => request({
  url: '/list/',
  method: 'GET'
})

// 3. 获取推荐歌曲
export const getRecommendSongs = (page = 1) => request({
  url: `/song/recommend?offset=${page}`,
  method: 'GET'
})

// 4. 获取热歌榜数据
export const getHotRank = (page = 1) => request({
  url: `/song/rank?song_rank=热歌榜&offset=${page}`,
  method: 'GET'
})
// 5. 获取飙升榜数据
export const getUpRank = (page = 1) => request({
  url: `/song/rank?song_rank=飙升榜&offset=${page}`,
  method: 'GET'
})
// 6. 获取中文dj榜数据
export const getZwDjRank = (page = 1) => request({
  url: `/song/rank?song_rank=中文dj榜&offset=${page}`,
  method: 'GET'
})

// 7. 根据歌曲id获取歌曲详情
export const getSongById = (song_id) => request({
  url: `/song/detail/${song_id}`,
  method: 'GET'
})

// 8. 根据歌曲id获取歌曲mp3链接
export const getSongMP3Src = (song_id) => request({
  url: `/song/mp3src/${song_id}`,
  method: 'GET'
})

// 9. 根据歌曲id获取歌词
export const getSongLyric = (song_id) => request({
  url: `/song/lyric/${song_id}`,
  method: 'GET'
})


// 10. 根据歌单id获取歌单基本
export const getListData = (list_id) => request({
  url: `/list/${list_id}`,
  method: 'GET'
})

// 11. 根据歌单id获取歌单中的歌曲
export const getListSongs = (list_id, page = 1) => request({
  url: `/list/songs/${list_id}?offset=${page}&limit=10`,
  method: 'GET'
})



// 12. 用户注册的接口  参数对象data：{user_name: ,password: , nickname:  }
export const userRegister = ({
  phone,
  password,
  nickname
}) => request({
  url: `/user/front/register?user_name=${phone}&password=${password}&nickname=${nickname}`,
  method: 'POST',
})


// 13. 用户登录的接口
export const userLogin = ({
  phone,
  password
}) => request({
  url: `/user/login`,
  method: 'POST',
  header: {
    'content-type': 'application/x-www-form-urlencoded' //修改此处即可
  },
  data: {
    user_name: phone,
    password
  }
})

// 14. 用户未登录，但是忘记密码，进行密码的修改
export const updatePassword = ({
  phone,
  newPassword1
}) => request({
  url: `/user/update/password`,
  method: 'POST',
  header: {
    'content-type': 'application/x-www-form-urlencoded' //修改此处即可
  },
  data: {
    user_name: phone,
    password: newPassword1
  }
})

// 15. 用户登录，修改昵称
export const updateNickname = (nickname) => request({
  url: `/user/nickname`,
  method: 'POST',
  header: {
    'content-type': 'application/x-www-form-urlencoded' //修改此处即可
  },
  data: {
    nickname
  }
})

// 16. 登录后修改密码的接口
export const updatePasswordLogin = ({
  phone,
  newPassword1
}) => request({
  url: `/user/`,
  method: 'PUT',
  header: {
    'content-type': 'application/x-www-form-urlencoded' //修改此处即可
  },
  data: {
    user_name: phone,
    password: newPassword1
  }
})


// 17. 根据 关键字 模糊 搜索所有歌曲
export const getAllSongs = (keyword) => request({
  url: `/song?keyword=${keyword}`,
  method: 'GET'
})
