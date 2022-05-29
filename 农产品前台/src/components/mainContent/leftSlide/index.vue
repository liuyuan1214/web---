/**/
<template>
  <div id="nav-menu-list" class="f-cp" v-if="false" >
    <div v-for="(item,index) in navlist" :key="index+'0'" 
    :class="['menu-item','f-pr','f-cp',activeMenu(item,index),activeMenu(item,index)==='submenushow'?'menu-item-hover':'']"
     @mouseover="mouseIn(index)">
      <div @click="toPage(item.path,index)">
            <img :src="'./static/slideicon/'+item.icon+'.png'" class="icon" />
            <span>{{item.name}}</span>
            <i class="el-icon-arrow-right arrow" v-if="item.children"></i>
      </div>
      <!-- 二级标题 -->
      <div class="secondary-menu f-pa f-cp fadeIn" 
          :style="index==6||index==7?'bottom:0':'top:0'" 
          v-if="item.children"
          @click="changePage">
        <router-link v-for="(child,i) in item.children" :key="i+'0000'" class="sub-menu" 
          active-class="bg-fff"
          :to="i==0?'none':'/'+item.path+'/'+child.path" exact>
          <i :class="[index==6||index==7?'icon-bottom':'icon-top','el-icon-caret-left']" v-if="i===0" ></i>
          <span>{{child.name}}</span>
        </router-link>
      </div>
    </div>
    
  </div>
</template>

<script>
  import moduleMenuList from './navmenu.json';
    import { mapGetters } from 'vuex';
  import fetch from 'fetch/axios/';
  export default {
    data() {
      return {
        navlist:moduleMenuList,
        curYear:2019,
        hoverMenuIdx:-1,
        currentTab:'',       //click事件点击的一级菜单
      }
    },
    created(){
        this.curYear =  new Date().getFullYear()
    },
    //不能通过监听路由，控制二级菜单的消失，因为点击当前页面的路由，路由不会发生变化
    // watch:{
    //   $route(){
    //     this.currentTab='';
    //   }
    // },
    watch:{
    	leftcontent(newVal,val){
    		if(!newVal){
          setTimeout(()=>{
            this.currentTab='';
          },500) 
    		}
	    }
	  },
    computed: {
      activeMenu(item,index){
        return function(item,index){
          // 点击过后，鼠标跟随显示二级菜单
          if(this.hoverMenuIdx == index && this.currentTab){
                return  'submenushow'
          }
          if(!this.currentTab){   //当前菜单所属的一级菜单
              return  this.$route.matched[0].path=='/'+item.path || (this.$route.path==='/home' && item.path==='/home')?'active':'';
          }
         }
        },
        ...mapGetters({
          leftcontent:'getleftcontent'
        })
      },
    methods: {
      changePage(){
        this.$store.dispatch('setLeftcontent',false)
      },
      toPage(path,index){
        if(path==='/home')this.$router.push({path: '/home'})
        this.currentTab=index;
        this.$store.dispatch('setLeftcontent',true)
      },
      mouseIn(index){
        this.hoverMenuIdx = index;
      }
    }
  }
</script>
<style lang="scss" scoped>
        #nav-menu-list{
          width:150px;
        }
        .menu-item{
          font-size:16px;
          width:100%;
          color:#fff;
          line-height:62px;
          .icon{
            margin: 0 10px 0 30px;
            width:25px;
            vertical-align: middle
          }
          .arrow{
            position:absolute;
            top:23px;
            right:12px;
          }
          .secondary-menu{
             display:none;
             animation: bounceInRight .2s ease;
             width:160px;
             left:150px;
             background:#f4f9ef;
              box-shadow:4px 4px 5px #ddd;
             .sub-menu{
               display:block;
               padding-left:25px;
               height:62px;
               color:#666666;
               text-decoration:none;
               .el-icon-caret-left{
                 font-size:23px;
                 left:-15px;
                 position:absolute;
               }
               .icon-top{
                 top:20px;
                 color:#dfedd2;
               }
               .icon-bottom{
                 bottom:19px;
                 color:#f4f9ef;
               }
             }
             .sub-menu:first-child{
               background:#dfedd2;
               font-weight:bold;
               color:#333;
               cursor:default;
             }
             .sub-menu:not(:first-child):hover{
               background:#fff;
             }
          }
        }
        .menu-item-hover{
          background:#89c152;
          .secondary-menu{
            display:block;
          }
        }
        .menu-item.active{
          background: #89c152;   
        }
        .change-site{
          margin:50px 10px 0 10px;
          background:#2b5700;
          line-height:52px;
          font-size:16px;
          user-select:none;
          color:#fff;
          text-align:center;
        }
        .baseitem{
          width:200px;
          height:250px;
          margin:10px;  
          line-height:50px;
          font-size:18px;
          text-align:center;
          .version-icon{
            width:150px;
            height:150px;
            display: block;
            margin:0 auto;
            transition:all 0.3s;
          }
           .version-icon:hover{
            transform:scale(1.2);
          }
        }
        .bgmain{
         background:#89c152;
         color:#fff;
        }
        .copy-right{
          width:150px;
          margin-bottom:18px;
          bottom:0;
          color:#fff;
          z-index:1000;
        }
   @keyframes scaleDraw {  /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
            0%{
                transform: scale(1);  /*开始为原始大小*/
            }
            25%{
                transform: scale(1.1); /*放大1.1倍*/
            }
            50%{
                transform: scale(1);
            }
            75%{
                transform: scale(1.1);
            }
        }
</style>



