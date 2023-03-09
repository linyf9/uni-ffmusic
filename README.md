# 一：创建项目

![image-20230226200710237](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226200710237.png)

创建 .gitignore 忽略文件: 

​				.hbuilderx
​				node_modules
​				unpackage/dist

git init

git add .

git commit -m "创建项目"

git remote add origin https://github.com/linyf9/uni-ffmusic.git

git push -u origin master

# 二：配置项目在微信开发者工具中运行

![image-20230226200830652](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226200830652.png)

![image-20230226200858016](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226200858016.png)

# 三：新建页面 、安装插件、跨域处理，及其他小点

1. 新建home页面

   ![image-20230226203427062](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226203427062.png)

2. 新建player页面 

   ![image-20230226203617682](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226203617682.png)

3. 新建my页面

   ![image-20230226203636253](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226203636253.png)

4. 安装插件

   ![image-20230226204531256](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226204531256.png)

5. 靠缩进

   ![image-20230226204832168](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226204832168.png)

6. 跨域处理

   小程序：是不存在跨域的！！不需要做兼容性处理

   建议：不需要在小程序中使用vue-router，因为uniapp有一套相对完整的路由了；如果真的需要使用vue-router就去装来用

7. Vue3引用组件

   ![image-20230226210720239](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226210720239.png)

8. js文件引入

   ![image-20230226210913405](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226210913405.png)

9. npm支持

   ![image-20230226210945535](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226210945535.png)

10. 导入css

    ![image-20230226211019223](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226211019223.png)

11. 模板内引入静态资源

    ![image-20230226211101633](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230226211101633.png)

12. 样式单位——rpx和upx一样，都是px的一半，20rpx==10px；提倡用flex布局

# 四：配置tabBar

在pages.json中配置：

"tabBar": {
    "color": "#333333",
    "selectedColor": "#00b36a",
    "list": [{
        "pagePath": "pages/home/home",
        "text": "主页",
        "iconPath": "static/images/tabBar/home.png",
        "selectedIconPath": "static/images/tabBar/home-active.png"
      },
      {
        "pagePath": "pages/player/player",
        "text": "播放",
        "iconPath": "static/images/tabBar/bofang.png",
        "selectedIconPath": "static/images/tabBar/bofang-active.png"
      },
      {
        "pagePath": "pages/my/my",
        "text": "个人中心",
        "iconPath": "static/images/tabBar/my.png",
        "selectedIconPath": "static/images/tabBar/my-active.png"
      }
    ]
  },

# 五：首页的开发

1. 顶部轮播图

   

2. 每日推荐

   

3. 精品歌单

   

4. 推荐歌曲

   

5. 排行榜

   （1）安装第三方包vant组件库

   ​	0. 项目 npm init -y

   ​    1. npm i @vant/weapp -S --production

   ​	2. 新创建个文件夹这里随意命名 本人命名是 `wxcomponents` 随着网上的来了

   ​	3. 这里 打开 `node_modules/@vant/weapp` 将 `weapp`里的`dist`文件夹复制到 `wxcomponents`这个文件夹下 `最终的结果为`：

   ![image-20230227132344939](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230227132344939.png)

   

   4. 打开 `App.vue` 引入：@import '/wxcomponents/dist/common/index.wxss';

   5. 最后打开 `pages.json`，引入要使用的组件即可；之后就可以在页面上使用啦

   ![image-20230227132511889](C:\Users\fly20\AppData\Roaming\Typora\typora-user-images\image-20230227132511889.png)

   ​	



# 六：封装uni.request请求

utils/request.js

```
import {
  getToken,
  removeToken
} from './auth.js'
import env from './env.js'

function service(options = {}) {
  options.url = `${env.baseUrl}${options.url}`
  // 判断本地是否存在token，如果存在则带上请求头，且在请求头设置token
  if (getToken()) {
    options.header = {
      'content-type': 'application/json',
      'Authorization': `${getToken()}`
    }
  }

  return new Promise((resolved, rejected) => {
    options.success = (res) => {
      // 如果请求回来的状态码不是200，则执行以下操作
      if (res.data.code !== 200) {
        uni.showToast({
          icon: 'none',
          duration: 3000,
          title: `${res.data.message}`
        });
        // 登录失效  code为 10101 token失效，即登录失效
        if (res.data.code === '10101') {
          // 清除本地token
          removeToken()
          // 关闭所有页面，并跳转到登录页
          uni.reLaunch({
            url: '/pages/login/login'
          });
        }

        // 返回错误信息
        rejected(res)

      } else {
        // 请求回来的状态码为200，则返回内容
        resolved(res.data.data)
      }
    }

    options.fail = (err) => {
      // 请求失败的弹窗提醒
      uni.showToast({
        icon: 'none',
        duration: 3000,
        title: '服务器错误,请稍后再试'
      });
      rejected(err);
    }

    // 发送请求
    uni.request(options);

  })

}

export default service;

```



utils/auth.js

```
const tokenKey = 'token'

// 登录与免登陆 认证令牌
// 获取本地token
export default getToken() {
  return uni.getStorageSync(tokenKey)
}
// 设置本地tolen
export default setToken(token) {
  return uni.setStorageSync(tokenKey, token)
}
// 删除本地token
export default removeToken() {
  return uni.removeStorageSync(tokenKey)
}

```



utils/env.js

```
export default {
  baseUrl: 'http://localhost:5000'
}

```



# 七：vue3中安装pinia

1. npm i pinia

2. 新建store文件夹，里边放置index.js,引入,使用，配置

   ```
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
   
   } from '../api/api.js'
   
   
   
   // useMusic 音乐仓库
   //这里官网是单独导出  是可以写成默认导出的  官方的解释为大家一起约定仓库用use打头的单词 固定统一小仓库的名字不易混乱
   export const useMusic = defineStore("music", {
     state: () => {
       return ({
         dailyRecommendList: [], //每日推荐歌曲数组
         geDanList: [], //歌单详情页的数组
         recommendList: [], //推荐歌曲数组
         hotRankList: [], //热歌榜数组
         upRankList: [], //飙升榜数组
         zwDjRankList: [], //中文dj榜数组
         playList: [{
           song_id: 43,
           singer_name: "李诗影（大恬）",
           song_filepath: "http://localhost:5000/2c7950f95dcefd3220a0bdf1d.mp3",
           song_imgpath: "http://localhost:5000/2c7950f95dcefd3220a0bdf1b.jpg",
           song_songname: "李诗影(大恬) - 从简 (DJ光波版)"
         }], // 播放列表数组
         playListIndex: 0, //播放列表的下标
   
         isMusicPlay: false,
         musicId: '',
       }) //为了避免出错，返回的值用()包起来
     },
   
     actions: {
   
       async getDailyRecommend() {
         let res = await getDailyRecommend()
         this.dailyRecommendList = res
       },
   
       async getGeDanDetails() {
         let res = await getGeDanDetails()
         this.geDanList = res.reverse()
       },
   
       async getRecommendSongs() {
         let res = await getRecommendSongs()
         res.splice(res.length - 1);
         let arr1 = res.slice(0, 3);
         let arr2 = res.slice(3, 6);
         let arr3 = res.slice(6, 9);
         let newArr = [arr1, arr2, arr3];
         this.recommendList = newArr
       },
   
       async getHotRank() {
         let res = await getHotRank()
         this.hotRankList = res
       },
   
       async getUpRank() {
         let res = await getUpRank()
         this.upRankList = res
       },
   
       async getZwDjRank() {
         let res = await getZwDjRank()
         this.zwDjRankList = res.reverse()
       },
   
   
     },
   
     getters: {
   
     }
   
   
   })
   
   
   // useUser 用户仓库
   export const useUser = defineStore("user", {
     state: () => {
       return ({
   
       }) //为了避免出错，返回的值用()包起来
     },
   
     actions: {
   
     },
   
     getters: {
   
     }
   
   
   })
   
   
   ```

3. 在main根上引入以上文件夹，并注册使用

   ```
   ...
   import {
     createPinia
   } from 'pinia'
   ...
   // #ifdef VUE3
   import {
     createSSRApp
   } from 'vue'
   export function createApp() {
     const app = createSSRApp(App)
     app.use(createPinia())
     return {
       app
     }
   }
   // #endif
   ```

4. 在页面使用

   ```
   <script setup>
   import { ref, reactive } from 'vue';
   import { onLoad } from '@dcloudio/uni-app';
   import { useMusic } from '../../store/index.js';
   import { storeToRefs } from 'pinia';
   
   const active = ref(0);
   let musicStore = useMusic();
   let { hotRankList, upRankList, zwDjRankList } = storeToRefs(musicStore);
   
   // 跳转到歌曲详情页
   const toSongDetail = song_id => {
     uni.navigateTo({
       url: `/pages/songDetail/songDetail?song_id=${song_id}`
     });
   };
   
   // 生命周期函数
   onLoad(() => {
     // 获取热歌榜数据
     musicStore.getHotRank();
     // 获取飙升榜数据
     musicStore.getUpRank();
     // 获取中文dj榜数据
     musicStore.getZwDjRank();
     // 防止页面刷新，数据丢失，将数据保存到 本地
     // uni.setStorageSync('itemDetail', JSON.stringify(state));
   });
   </script>
   
   
   ```
   
   # 八：vue3中使用mitt（兄弟组件传参）
   
   1. 安装 npm i mitt
   
   2. 这次使用的是局部导入，先在utils文件夹中创建 mittBus.js
   
      mittBus.js
   
      ```
      // 事件总线第三方库：npm i mitt
      import mitt from 'mitt'
      const bus = mitt()
      export default bus
      
      ```
   
   3. 在组件中使用
   
      ```
      .......
      import bus from '../../utils/mittBus.js';
      ......
      
      
      ```
   
      