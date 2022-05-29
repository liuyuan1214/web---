<template>
  <section class="body-warp">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>
<script type="text/javascript">
  export default {
    name: 'app',
    created(){
          // var ua = navigator.userAgent.toLowerCase();
          // if(ua.indexOf('trident')>-1){
          //     var start = ua.indexOf('trident')+8;
          //     var version =  ua.substring(start,start+1);
          //     console.log(version);
          //     if(Number(version)<10){
          //       // this.$confirm('')
          //     }
          // }
    },
  }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .body-warp {
    animation: fadeIn .5s ease;
    height:100%;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s ease;
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
  [v-cloak] {
    display:none !important;
  }

</style>
