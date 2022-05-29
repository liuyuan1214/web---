/*页面的整体布局*/
<template>
              <div  class="page-title f-f1">
                  <div class="pape-name" >{{$route.meta.title}}
                  </div>
                   <el-button icon="icon-ny-back" round class="back-btn" size="mini" @click="$emit('input',false)" v-if="value"><span style="padding-left:3px;">返回</span></el-button>
            </div>        
</template>
<script type="text/javascript">

  export default{
    name: 'pageName',
    data(){
      return{
        routeName:''
      }
    },
    props:{
        value: {                
            type: Boolean,                
            default: false            
        }  
    }
  }
</script>

<style scoped lang="scss">
    .pape-name{
      padding-left:10px;
      border-left:5px solid #417f04;
      color:#333;
      font-size:16px;
      margin-bottom: 15px;
      display:inline-block;
    }
    .back-btn{
        margin-left:20px;
        background:#eee;
    }
</style>
<style>
 .page-title .back-btn:hover, .back-btn:focus {
    color: #666;
    border-color: #eee;
    background-color: #ededed;
}
 .page-title .el-button--mini.is-round {
    padding: 5px 15px;
}
</style>