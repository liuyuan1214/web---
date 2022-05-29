/*页面的整体布局*/
<template>
  <div class="main-content ofh f-df f-ofh" sw-mode=y>
      <h-section></h-section>
      <div class="f-df f-f1" style="overflow:hidden">
            <left-slide class="left-side"></left-slide>
            <div class="f-f1 f-df f-ofh" sw-mode="y"> 
              <tag-view></tag-view>
              <div  class="page-container f-f1">
                  <!-- <div class="pape-title" @click="changePage">{{routeName}}</div> -->
                  <!-- 用于存放页面内容 -->
                  <slot></slot>
              </div>
              <div class="f-pa" style="top:0;right:0;left:0;bottom:0;" @click="closeMeun" v-if="leftcontent"></div>
            </div>        
      </div>
  </div>
</template>
<script type="text/javascript">
  import hSection from './headertop/'
  import leftSlide from './leftSlide/'
  import tagView from './tagView/'

  import { mapGetters } from 'vuex';

  export default{
    name: 'maincontent',
    components: {
      hSection,  
      leftSlide,
      tagView
    },
    data(){
      return{
        routeName:''
      }
    },
    watch:{
      $route(){
        this.routeName = this.$route.name;
      }
    },
		computed: mapGetters({
      leftcontent:'getleftcontent'
    }),
    methods:{
  		closeMeun(){
				this.$store.dispatch('setLeftcontent',false)
			}
    }
  }
</script>

<style scoped lang="scss">
  .main-content {
    position: relative;
    height:100%;
  }
  .left-side {
    z-index: 100;
    height: 100%;
    width: 150px;
    //background-color: #417f04;
	background: linear-gradient(180deg ,#4a8c08,#6fac34);
  }
  .page-container{
    padding:15px;
    overflow-y:auto;
    box-sizing:border-box;
    .pape-title{
      padding-left:10px;
      border-left:5px solid #4a8c08;
      color:#333;
      font-size:16px;
      margin-bottom: 15px;
    }
  }
</style>
