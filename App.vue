<script>
export default {
  onLaunch: function() {
    console.log('App Launch');
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  }
};
</script>

<style>
/*每个页面公共css */
@import url('static/iconfont/iconfont.css');
@import '/wxcomponents/dist/common/index.wxss';
page {
  background-color: #000000;
}
</style>
