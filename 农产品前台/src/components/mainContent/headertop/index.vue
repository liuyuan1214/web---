<template>
  <div id="app-head" class="f-select-not">
    <!-- 左边的logo -->
    <router-link to="/home" class="left bg-main f-autoCont" v-if="false">
      <el-tooltip effect="light"  content="首 页" placement="bottom">
        <!-- <img src="../../../../static/headertitle/logo.png" class="logo-img"> -->
      </el-tooltip>
    </router-link>
    <!-- 右边的系统名字用户信息等 -->
    <div class="right" :style="{background:'url(./static/headerbg/bg'+userInfo.nyVersion+'.png)'}">
      <div class="content f-df" sw-align="center">
        <!-- <div class="sys-title f-f1">{{title}}</div> -->
        <div class="f-f1">
          <h2 class="farm">农产品溯源信息查询</h2>
          <!-- <img v-if="userInfo.nyVersion" :src="'./static/headertitle/name.png'" class="sys-title" style="height:62px;">  -->
        </div>
        <div v-if="showVersionChange" class="f-fs18 f-cp" style="margin-right:30px;" @click="dialogVisible=true">
          <span>版本切换</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <!-- 消息 -->
        <div class="f-cp sys-info">
         
        </div>
        <!-- 用户中心:退出登录，修改密码 -->
        <user-info></user-info>
      </div>
    </div>
    <!-- 版本切换的弹框 -->
    <el-dialog
      title="版本选择"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      append-to-body
      top="30vh"
      :width="versionWidth">
      <div class="f-df f-cp">
        <div v-for="(item,index) in baselist" :key="index" class="baseitem" @click="changeBase(item)">
          <img class="version-icon" :src="'./static/version/v'+(item.nyVersion)+'.png'" />
          {{versionNames[item.nyVersion-1]}}
        </div>
      </div>
    </el-dialog>

    <!-- 溯源协议的弹框 -->

    <el-dialog
      title="农产品质量安全溯源平台使用协议"
      :visible.sync="dialogVisiblesyxy"
      :width="versionWidth"
      :close-on-click-modal="false"
      :show-close="false"
      top="10vh"
      center>
      <div class="f-xy" style="height: 600px;overflow-y: auto;">
        <p>
          根据《中华人民共和国农产品质量安全法》、《农业局关于印发农业生产领域农产品质量安全追溯管理实施方案的通知》（丽农发〔2014〕0036号）、
          《人民政府办公室关于农产品质量安全溯源体系建设的实施意见》（丽政办法〔2014〕126号）及《“丽水山耕”区域公用品牌商标使用管理实施细则》等的相关规定，
          甲乙双方遵循自愿、诚实、信用原则，协商一致，签订该协议。
        </p>
        <p>
          “丽水山耕”农产品质量安全溯源平台是委市政府委托农业投资发展有限公司开发的“丽水山耕”管理系统的其中一个平台，甲方是该溯源平台的知识产权拥有者。
        </p>
        <p>一、合同期限</p>
        <p>合同期限叁年。甲、乙双方应在本协议到期前两个月，就是否继续授权使用溯源平台进行协商，到期继续使用，需重新签订本协议，不续签协议则自行终止。</p>
        <p>二、双方的权利义务</p>
        <p>（一）甲方权利义务</p>
        <p>1.甲方拥有对乙方使用溯源平台管理、监督等权利。</p>
        <p>2.甲方无偿提供溯源操作培训及版本更新服务。</p>
        <p>3.乙方需妥善保管溯源平台账号，不得出现借用、盗用、转让等情况。一旦发现，甲方有权取消乙方溯源平台账号及使用权。</p>
        <p>4.甲方提供标准溯源二维码。</p>
        <p>（二）乙方权利义务</p>
        <p>1.乙方需指定专人负责溯源平台的操作并积极反馈系统使用情况。</p>
        <p>2.乙方需保证正常登陆及使用溯源平台，并保证输入信息的真实性。</p>
        <p>3.乙方需严格使用甲方提供的溯源二维码标签，确保二维码标签不做他用。</p>
        <p>三、费用收取</p>
        <p>使用溯源平台及溯源二维码标签暂不收取费用。</p>
        <p>四、若乙方在使用溯源平台有如下情况之一者，甲方将取消其使用溯源平台资格并收回平台使用账号：</p>
        <p>1.领取二维码，使用率低于50%；</p>
        <p>2.二维码标签粘贴在不对应产品包装上，经查证后仍不整改的；</p>
        <p>3.未经许可转让、出售、转接溯源平台的登入账号及二维码标签的；</p>
        <p>4.发生重大食品安全事故的；</p>
        <p>5.经消费者投诉并核实其产品确实存在质量问题的；</p>
        <p>6.超过三个月未登陆溯源平台进行操作的。</p>
        <p>7.合同终止的。</p>
        <p>五、争议解决</p>
        <p>在履行本合同过程中发生的争议，由双方协商解决，协商不成的情况下提交莲都区人民法院管辖。</p>
        <p>六、其他</p>
        <p>1.本合同一式贰份，甲乙双方各壹份。合同自签章之日起生效，具有相同的法律效力。</p>
        <p>2.未尽事宜，由双方协商补充，另行签署书面补充协议，具有相同法律效力。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-checkbox v-model="checked">阅读并且同意相关协议</el-checkbox>
        <el-button type="primary" @click="saveSyqyXyb" :disabled="checked == false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex' 
import userInfo from "./userInfo";
  import fetch from 'fetch/axios/';
  import router, { resetRouter } from 'src/router/'

export default {
  components:{
    userInfo
  },
  computed:{
      ...mapGetters({
              userInfo:'getUserInfo',
              getVersion:'getVersion',
              unreadNotice:'getUnreadNotice',
          })
        },
      watch:{
        getVersion:function(newval,oldval){
          if(newval){
            this.dialogVisible=true;
          }
        },
      }, 
  data() {
    return {
        checked:false,
        dialogVisiblesyxy:false,
        versionNames:['种植业版','水产业版','畜牧业版','食用菌版','蜂产业版'],
        baselist:[],
        selIndex:0,
        selBase:{},
        dialogVisible:false,
        showVersionChange:false,
        versionWidth:"1000px",
        title: "农产品生产管理系统",
    };
  },
    created(){
      console.log(this.userInfo.syxy);
      if(this.userInfo.syxy == 0||this.userInfo.syxy == '0'||this.userInfo.syxy == 2||this.userInfo.syxy == '2'||this.userInfo.syxy == 3||this.userInfo.syxy == '3'){
        this.dialogVisiblesyxy=false
      }else{
        this.getBaseLand();
      }
    },
  methods: {
    saveSyqyXyb(){
      this.dialogVisiblesyxy=false;
      // fetch({
      //   url:'/syqyXy/saveSyqyXyb/',
      //   method:'post',
      //   data:{}
      // }).then(res=>{
      //   if(res.resCode == '000000'){
      //     this.dialogVisiblesyxy=false;
      //    // this.getBaseLand();
      //   }else{
      //     this.$message.error(error.errorMess);
      //   }
      // })
    },
    message() {
      router.push("/manage/message/index");
    },
    markdown() {
      router.push("/manage/markdown/index");
    },
      // changeBase(selItem){
			// 					let {hydm,industryId,ztdm,scjyztId,nyVersion,ztmc} = selItem;
      //           let changefield={hydm,hy:hydm,industryId,ztdm:ztdm,scjyztId,nyVersion,ztmc};
      //           let userInfo = Object.assign({...this.userInfo},changefield)
      //           //防止用户刷新网页vuex数据丢失，本地存储
      //           localStorage.setItem('userInfo',JSON.stringify(userInfo));
      //           this.$store.dispatch('delAllViews');
      //           this.$router.push('/home');
      //           //等本地保存好userInfo后刷新页面
      //           setTimeout(()=>{
      //             window.location.reload();
      //           },500)
      // },
      changeBase(selItem){
								let {hydm,industryId,ztdm,scjyztId,nyVersion,ztmc} = selItem;
                let changefield={hydm,hy:hydm,industryId,ztdm:ztdm,scjyztId,nyVersion,ztmc};
                let userInfo = Object.assign({...this.userInfo},changefield)
                //防止用户刷新网页vuex数据丢失，本地存储
                localStorage.setItem('ncpUserInfo',JSON.stringify(userInfo));
                this.$store.dispatch('setUserInfo',userInfo);
                this.refreshView();
                resetRouter()
                this.dialogVisible = false;
      },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('delAllViews');
      const { fullPath } = this.$route
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    },
      // getBaseLand(){
      //   fetch({
      //     url:'/jcqy/zt/getScjyztByQyId/',
      //     method:'get',
      //     data:{
      //       qyid:this.userInfo.qyid
      //     }
      //   }).then(res=>{
      //     if(res.list && res.list.length!=1){
      //       this.showVersionChange=true;
      //       this.versionWidth=(res.list.length)*200+'px';
      //       this.baselist = res.list;
      //       // this.selBase= this.baselist[0];
      //       if(this.getVersion){
      //         this.dialogVisible=true;
      //       }
      //     }
      //   })
      // },
  }
};
</script>
<style lang="scss" scoped>
  .f-xy p{
    line-height: 25px;
  }
#app-head {
  .farm{
    line-height: 20;
    font-size: 30px;
margin-left: 50px;
  }
  height: 62px;
  width: 100%;
  display: flex;
  align-items: center;
  color: #fff;
  .left {
    z-index:101;
    height: 100%;
    width: 150px;
    border-bottom:1px solid #2b5700;
    line-height: 62px;
    .logo-img {
      width: 110px;
    }
  }
  .right {
    flex: 1;
    background-size: 100% 62px;
    .content {
      width: 100%;
      height: 62px;
      background: rgba(0, 0, 0, 0.15);
      .sys-title {
        padding-left: 30px;
      }
    }
  }
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
</style>
