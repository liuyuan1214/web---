<template>
  <div class="panel f-df">
    <div class="feature f-f1">
      <div class="userinfo">
        <span>你好，{{userInfo.yhxm}}</span>
        <span>今日是{{date}} <span class="f-pl5">星期</span>{{weekday}}</span>
        <span>您上次登录的时间：{{userInfo.optTime}}</span>
        <span>您上次登录的IP：{{userInfo.logIp}}</span>
      </div>
      <div class="f-df">
        <div class="f-f1 base-rules" :style="{background:item.bg}" v-for="(item,index) in statisticallist" :key="index">
          <div class="f-fs20">{{item.title}}</div>
          <div class="numToday f-cp" @click="$router.push({path:item.pagePath})">{{statistcValue[item.valueT]}} </div>
          <div class="f-fs18" >累计：{{statistcValue[item.valueTotal]}}</div>
        </div>
      </div>
      <div class="sub-title">快捷操作</div>
      <div class="f-df ">
        <div class="base-operate f-cp" @click="$router.push({path:item.pagePath})" v-for="(item,index) in CommonOperations" :key="index">
          <div class="f-fs20"> <img :src="`./static/operateicon/operate${index+1}.png`" alt="">{{item.title}}</div>
        </div>
      </div>
      <div class="sub-title">待处理任务</div>
      <div class="questionCount">
        <div>待处理质问：<span class="f-pr5 f-pl5 f-cp" @click="$router.push({path:'/product/zxInfo'})">{{jgQuestionCount}}</span>条</div>
        <div>待处理审核：<span class="f-pr5 f-pl5">{{checkNum}}</span>条</div>
      </div>
    </div>
    <div class="navigation f-pr10 f-pr" >
      <img src="../../../static/navigation/navigate.gif"  class="f-cp"  @click="$router.push({path:'/home/navigation'})" alt="">
      <!-- 去导航页 -->
      <div class="click-btn f-cp" @click="$router.push({path:'/home/navigation'})"></div>
      <div class="contact">
        <div class="item"></i></div>
        <img src="../../../static/navigation/qq.png" alt="">
        <div class="item">&nbsp;</div>
        <img src="../../../static/navigation/app.png" alt="">
        <div class="item">&nbsp;</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import fetch from "fetch/axios";
import timeFormat from 'common/tools/timeFormat';
export default {
  name:'home',
  data() {
    return {
      msg: "home page",
      date:'',
      weekday:'',
      statistcValue:{
          fmslToday: '',
          fmslTotal: '',
          gmslToday: '',
          gmslTotal: '',
          qyzjToday: '',
          qyzjTotal: '',
          wtjcslToday: '',
          wtjcslTotal: '',
          zzcsToday: '',
          zzcsTotal: '',
      },
      statisticallist: [
        { title: "农事记录(批)", bg: "#fcb83f" ,valueT:'zzcsToday',valueTotal:'zzcsTotal' , pagePath:'/product/farm'},
        { title: "委托检测(份)", bg: "#a36afb" ,valueT:'wtjcslToday',valueTotal:'wtjcslTotal', pagePath:'/test/testCommsion'},
        { title: "企业自检(批次)", bg: "#f49422" ,valueT:'qyzjToday',valueTotal:'qyzjTotal', pagePath:'/test/self'},
		{ title: "追溯标签发放量(枚)", bg: "#35c4af" ,valueT:'gmslToday',valueTotal:'gmslTotal', pagePath:'/warehouse/hangingCode'},
        { title: "追溯标签访问量(枚)", bg: "#3bafd2" ,valueT:'fmslToday',valueTotal:'fmslTotal'},
      ],
      CommonOperations: [
        { title: "产品维护", icon: "ny-icon-shouye", pagePath:'/base/productionMaintain'},
        { title: "农事操作", icon: "ny-icon-shouye", pagePath:'/product/farm'},
		{ title: "委托检测", icon: "ny-icon-shouye" ,pagePath:'/test/testCommsion'},
        { title: "加工包装", icon: "ny-icon-shouye" ,pagePath:'/warehouse/packaging'},
        { title: "产品挂码", icon: "ny-icon-shouye" ,pagePath:'/warehouse/hangingCode'},
        { title: "销售单", icon: "ny-icon-shouye",pagePath:'/sale/saleList' },
      ],
      jgQuestionCount:0,
      checkNum:0,
    };
  },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    created(){
      this.date=timeFormat.eight(new Date());
      var weekday = new Date().getDay();
      let weekdaytext = ['天','一','二','三','四','五','六'];
      this.weekday=weekdaytext[weekday];
      this.getStaticalInfo();
      this.getJgQuestionCount();
    },
  methods: {
    getStaticalInfo(){
      let{scjyztId,qyid} = this.userInfo;
      fetch({
        url:'/scgl/ns/scglxtSytj/',
        method:'get',
        data:{
          date:timeFormat.one(new Date()),
          scjyztId,
          qyId:qyid
        }
      }).then(res => {
          if(res.list){
            this.statistcValue = res.list;
          }
        })
    },
    getJgQuestionCount(){
      let{scjyztId} = this.userInfo;
      var params = {
          ny:new Date().getFullYear(),
          scjyztId
      };
      fetch({
        url:'/jcgl/jc/getJgQuestionCount/',
        method:'get',
        data:params
      }).then(res => {
          if(res.bean){
            this.jgQuestionCount = res.bean;
          }
      })
      fetch({
        url:'/Bzgm/sh/getCheckNum/',
        method:'get',
        data:params
      }).then(res => {
          if(res.bean){
            this.checkNum = res.bean;
          }
      })
    }
  }
};
</script>
<style scoped lang="scss">
.userinfo{
  line-height:80px;
  font-size:18px;
  &>span{
    padding-right:10px;
  }
}
.base-rules{
  height: 162px;
  border-radius:10px;
  line-height:40px;
  margin-right:20px;
  color:#fff;
  text-align:center;
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items: center;
  .numToday{
    font-size:28px;
    width:100%;
  }
}
.base-operate{
    border-radius: 10px;
    height: 60px;
    line-height: 60px;
    width: 170px;
    margin-right: 20px;
    color: #fff;
    text-align: center;
    font-size: 20px;
    width: 130px;
    background: #a9cd06;
  img{
    vertical-align:middle;
    width:35px;
    margin-right:5px;
  }
}
.sub-title{
  height:35px;
  margin:50px 0  30px 0;
  line-height:35px;
  font-size:18px;
  color:#fff;
  padding:0 20px;
  display:inline-block;
  background:#417f04;
  border-top-right-radius: 18px;
}
.questionCount{
  background: #f5f5f5;
  padding:40px 25px;
  line-height:45px;
  font-size:20px;
}
.navigation{
  width:320px;
  .click-btn{
    position: absolute;
    top: 170px;
    right: 90px;
    left: 120px;
    height: 50px;
  }
  .contact{
    width:280px;
    padding:45px 0 30px 0;
    margin: -66px 0 0 30px;
    background: #fff3e5;
    text-align: center;
    font-size:18px;
    img{
      width:160px;
      margin-top:14px;
    }
    .item{
      line-height:45px;
    }
  }
}
</style>

