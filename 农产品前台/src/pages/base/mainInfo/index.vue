<template>
<div style="padding-bottom:100px" class="main-info">
    <!-- 头部切换页面 -->
       <page-name v-model="isEdit"></page-name>
    <div v-show="currentTab==1">
          <base-info></base-info>
    </div>
</div>
</template>

<script>
	  import { mapGetters } from 'vuex'
	  import baseInfo from './base.vue'
    export default {
        name:'mainInfo',
       components:{
         baseInfo,
       },
        data(){
            return {
                currentTab:1,
                isEdit:false
            }
        }
    }
</script>

<style lang="scss" scoped>
  .tabs{
     height:40px;
     margin-top:15px;
     margin-bottom:30px;
     background:#d7d7d7;
    color:#333;
     .tab-item{
       padding: 0 10px;
       line-height:40px;
       border-right:1px solid #fff; 
     }
     .tab-active{
       color:#fff;
       background:#679936;
     }
   }
</style>



