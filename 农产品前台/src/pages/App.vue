/*router-view里放页面内容,路由的meta参数的keepAlive可以控制当前页面是否缓存，二次加载不重新渲染*/
ondragstart="return false;" 不允许拖动
<template>
  <div class="view-page" v-cloak ondragstart="return false;">
    <s-main-content>
          <keep-alive  v-if="$route.meta.keepAlive"  :include="gcachedViews" class="bounceInLeft">
              <router-view :key="key"></router-view>
          </keep-alive>
          <router-view  v-else class="bounceInLeft"></router-view>
    </s-main-content>
  </div>
</template>
<script type="text/javascript">
  import sMainContent from 'components/mainContent'

  export default{
    name: 'page',
    computed: {
      gcachedViews() {
        return this.$store.state.tagsView.gcachedViews
      },
      key() {
        return this.$route.fullPath
      }
    },
    components: {
      sMainContent
    }
  }
</script>

<style lang="scss" scoped>
  .bounceInLeft{animation:bounceInLeft 0.3s ease}
  .view-page{
    width:100%;
    height:100%;
  }
  [v-cloak] {
  display:none !important;
}
</style>
