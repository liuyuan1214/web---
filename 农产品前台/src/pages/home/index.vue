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
        <div class="f-f1 base-rules" :style="item.bg" v-for="(item,index) in statisticallist" :key="index">
          <div class="f-fs16">{{item.title}}</div>
          <div class="numToday" style="line-height: 50px">
            <count-to :start-val="0" :end-val="Number(statistcValue[item.valueT])" separator="" class="numToday"
                      :duration="2000"/>
          </div>
          <div class="f-fs16" style="display: flex">
            <div>累计：</div>
            <div style="margin-top: 1px">
              <count-to :start-val="0" :end-val="Number(statistcValue[item.valueTotal])" separator=""
                        :duration="2000"/>
            </div>

            <!-- {{statistcValue[item.valueTotal]}} -->
          </div>
        </div>
        <!-- <div class="f-sp" @click="sp"></div> -->
      </div>
      <div class="panel f-df bounceInLeft" style="margin-top: 30px">
        <div class="ywlc">
          <div class="title">业务流程</div>
          <div class="ywlc-content">
            <div class="ywlc-content-div">
              基地生产
              <div class="f-df jdscDiv">
                <div>
                  <img src="../../../static/navigation/nsjlDiv.png" class="f-cp"
                       @click="$router.push({path:'/product/farm'})"
                       alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/jt.png" class="f-lr" alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/jgbz.png" class="f-cp"
                       @click="$router.push({path:'/product/packaging'})"
                       alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/jt.png" class="f-lr" alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/qyzjDiv.png" class="f-cp"
                       @click="$router.push({path:'/product/self'})"
                       alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/jt.png" class="f-lr" alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/wtjcDiv.png" class="f-cp"
                       @click="$router.push({path:'/product/entrust'})"
                       alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/jt.png" class="f-lr" alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/cpgm.png" class="f-cp"
                       @click="$router.push({path:'/product/hangingCode'})"
                       alt="">
                </div>
              </div>
            </div>

            <div class="ywlc-content-div" style="margin-top: 25px">
              外来采购
              <div class="f-df jdscDiv">
                <div>
                  <img src="../../../static/navigation/ylcg.png" class="f-cp"
                       @click="$router.push({path:'/purchase/farmproducts'})"
                       alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/jt.png" class="f-lr" alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/jgbz.png" class="f-cp"
                       @click="$router.push({path:'/purchase/packagingout'})"
                       alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/jt.png" class="f-lr" alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/qyzjDiv.png" class="f-cp"
                       @click="$router.push({path:'/purchase/selfout'})"
                       alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/jt.png" class="f-lr" alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/wtjcDiv.png" class="f-cp"
                       @click="$router.push({path:'/purchase/entrustout'})"
                       alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/jt.png" class="f-lr" alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/cpgm.png" class="f-cp"
                       @click="$router.push({path:'/purchase/hangingCodeout'})"
                       alt="">
                </div>
              </div>
            </div>

            <div class="ywlc-content-div" style="margin-top: 25px">
              投入品
              <div class="f-df jdscDiv">
                <div>
                  <img src="../../../static/navigation/trpgl.png" class="f-cp"
                       @click="$router.push({path:'/inputs/inputMaintain'})"
                       alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/jt.png" class="f-lr" alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/trpcg.png" class="f-cp"
                       @click="$router.push({path:'/inputs/inputproducts'})"
                       alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/jt.png" class="f-lr" alt="">
                </div>
                <div>
                  <img src="../../../static/navigation/trply.png" class="f-cp"
                       @click="$router.push({path:'/inputs/inputApplication'})"
                       alt="">
                </div>
              </div>
            </div>

          </div>
          <!--<div class="sub-title">快捷操作</div>-->
          <!--<div class="f-df ">-->
          <!--<div class="base-operate f-cp" @click="$router.push({path:item.pagePath})"-->
          <!--v-for="(item,index) in CommonOperations" :key="index">-->
          <!--<div class="f-fs20"><img :src="`./static/operateicon/operate${index+1}.png`" alt="">{{item.title}}</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--<div class="sub-title">待处理任务</div>-->
          <!--<div class="questionCount">-->
          <!--<div>待处理质问：<span class="f-pr5 f-pl5 f-cp"-->
          <!--@click="$router.push({path:'/product/zxInfo'})">{{jgQuestionCount}}</span>条-->
          <!--</div>-->
          <!--<div>待处理审核：<span class="f-pr5 f-pl5">{{checkNum}}</span>条</div>-->
          <!--</div>-->
        </div>

      <!--  <div class="navigation f-pr">
           <div class="ewm">
            <img src="../../../static/navigation/qq1.png" alt="">
            <div class="item">QQ服务群XXXXXXXX</div>
          </div>
          <div class="ewm">
            <img src="../../../static/navigation/app1.png" alt="">
            <div class="item">微信扫一扫使用小程序</div>
          </div> -->
          <!--<img src="../../../static/navigation/navigate.gif" class="f-cp"-->
               <!--@click="$router.push({path:'/home/navigation'})"-->
               <!--alt="">-->
          <!--&lt;!&ndash; 去导航页 &ndash;&gt;-->
          <!--<div class="click-btn f-cp" @click="$router.push({path:'/home/navigation'})"></div>-->
          <!--<div class="contact">-->
            <!--&lt;!&ndash;<div class="item"></i></div>&ndash;&gt;-->
            <!--&lt;!&ndash;<img src="../../../static/navigation/qq.png" alt="">&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="item">&nbsp;</div>&ndash;&gt;-->
            <!--<img src="../../../static/navigation/app.png" alt="">-->
            <!--<div class="item">微信扫一扫使用小程序</div>-->
          <!--</div>
        </div>-->
      </div>
    </div>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import fetch from "fetch/axios";
  import timeFormat from 'common/tools/timeFormat';
  import CountTo from 'vue-count-to'

  export default {
    name: 'home',
    components: {
      CountTo,
    },
    data() {
      return {
        msg: "home page",
        date: '',
        weekday: '',
        statistcValue: {
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
          {
            title: "农事记录(批)",
            bg: "background:url("+require('../../../static/navigation/nsjl.png')+") no-repeat; background-size: 100% 100%",
            valueT: 'zzcsToday',
            valueTotal: 'zzcsTotal',
          },
          {
            title: "追溯标签使用量(枚)",
            bg: "background:url("+require('../../../static/navigation/zsbqsyl.png')+") no-repeat; background-size: 100% 100%",
            valueT: 'fmslToday',
            valueTotal: 'fmslTotal'
          },
          {
            title: "追溯标签访问量(枚)",
            bg: "background:url("+require('../../../static/navigation/zsbqfwl.png')+") no-repeat; background-size: 100% 100%",
            valueT: 'fmslToday',
            valueTotal: 'fmslTotal'
          },
          {
            title: "委托检测(份)",
            bg: "background:url("+require('../../../static/navigation/wtjc.png')+") no-repeat; background-size: 100% 100%",
            valueT: 'wtjcslToday',
            valueTotal: 'wtjcslTotal',
          },
          {
            title: "企业自检(批次)",
            bg: "background:url("+require('../../../static/navigation/qyzj.png')+") no-repeat; background-size: 100% 100%",
            valueT: 'qyzjToday',
            valueTotal: 'qyzjTotal',
          },
        ],
        CommonOperations: [
          {title: "产品维护", icon: "ny-icon-shouye", pagePath: '/base/productionMaintain'},
          {title: "农事操作", icon: "ny-icon-shouye", pagePath: '/product/farm'},
          {title: "委托检测", icon: "ny-icon-shouye", pagePath: '/test/testCommsion'},
          {title: "加工包装", icon: "ny-icon-shouye", pagePath: '/warehouse/packaging'},
          {title: "产品挂码", icon: "ny-icon-shouye", pagePath: '/warehouse/hangingCode'},
          {title: "销售单", icon: "ny-icon-shouye", pagePath: '/sale/saleList'},
        ],
        jgQuestionCount: 0,
        checkNum: 0,
        userInfo: {
                yhxm:'sss',
                userId: '222',
                scjyztId:'qqq',
                qyid:'qqq',
                qydm:'eee',
                hydm:'err',
                ztdm:'333',
                optTime:'4444',
                logIp:'555',
                sessionKey: '21',  //存储登录失效的code
                scjyztId:'33', 
                qyid:'5' ,
                ztmc:'666', 
                csmc:'11',
                 csid:'33', 
                 areaCode:'111', 
                 industryId:'666', 
                 yVersion:'77',
                 syxy:'44'
              }
      };
    },
    computed: {
      // ...mapGetters({
      //   userInfo: "getUserInfo"
      // })
    },
    created() {
      this.date = timeFormat.eight(new Date());
      var weekday = new Date().getDay();
      let weekdaytext = ['天', '一', '二', '三', '四', '五', '六'];
      this.weekday = weekdaytext[weekday];
      this.getStaticalInfo();
      this.getJgQuestionCount();
      this.getQyInfo();
    },
    methods: {
      getQyInfo() {
        var params = {scjyqyId: this.userInfo.qyid}
        this.$fetch.api_user.user_comInfo(params).then((res) => {
          var bean = res.bean;
          var ztmc = bean.ztmc;
          var lxdh = bean.lxdh;
          var dz = bean.dz;
          localStorage.setItem("ztmc",ztmc);
          localStorage.setItem("lxdh",lxdh);
          localStorage.setItem("dz",dz);
          })
      },
      sp(){
        this.$message.warning("即将上线！");
      },
      getStaticalInfo() {
        let {scjyztId, qyid} = this.userInfo;
        fetch({
          url: '/scgl/ns/scglxtSytj/',
          method: 'get',
          data: {
            date: timeFormat.one(new Date()),
            scjyztId,
            qyId: qyid
          }
        }).then(res => {
          if (res.list) {
            this.statistcValue = res.list;
          }
        })
      },
      getJgQuestionCount() {
        let {scjyztId} = this.userInfo;
        var params = {
          ny: new Date().getFullYear(),
          scjyztId
        };
        fetch({
          url: '/jcgl/jc/getJgQuestionCount/',
          method: 'get',
          data: params
        }).then(res => {
          if (res.bean) {
            this.jgQuestionCount = res.bean;
          }
        })
        fetch({
          url: '/Bzgm/sh/getCheckNum/',
          method: 'get',
          data: params
        }).then(res => {
          if (res.bean) {
            this.checkNum = res.bean;
          }
        })
      }
    }
  };
</script>
<style scoped lang="scss">
  .userinfo {
    line-height: 40px;
    font-size: 18px;
    margin-bottom: 10px;

    & > span {
      padding-right: 10px;
    }
  }

  .base-rules {
    height: 140px;
    border-radius: 10px;
    margin-right: 20px;
    color: #fff;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .numToday {
      font-size: 28px;
      width: 100%;
    }
  }

  .base-operate {
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

    img {
      vertical-align: middle;
      width: 35px;
      margin-right: 5px;
    }
  }

  .sub-title {
    height: 35px;
    margin: 50px 0 30px 0;
    line-height: 35px;
    font-size: 18px;
    color: #fff;
    padding: 0 20px;
    display: inline-block;
    background: #417f04;
    border-top-right-radius: 18px;
  }

  .questionCount {
    background: #f5f5f5;
    padding: 40px 25px;
    line-height: 45px;
    font-size: 20px;
  }

  .navigation {
    width: 320px;
    box-shadow: 0 0 10px #dbdbdb;

    .click-btn {
      position: absolute;
      top: 170px;
      right: 90px;
      left: 120px;
      height: 50px;
    }

    .contact {
      width: 280px;
      padding: 45px 0 30px 0;
      margin: -66px 0 0 30px;
      background: #fff3e5;
      text-align: center;
      font-size: 18px;

      img {
        width: 160px;
        margin-top: 14px;
      }

      .item {
        line-height: 45px;
      }
    }

    .ewm{
      text-align: center;
      margin-top: 40px;
      width: 320px;
      img{
        box-shadow: 0 0 5px #969696;
        padding: 5px;
        margin-bottom: 10px;
        width: 180px;
        height: 180px;
      }
    }
  }

  .f-sp {
    width: 320px;
    background: url(../../../static/navigation/sp.png) no-repeat;
    background-size: 100% 100%;
    box-shadow: 0 0 10px #969696;
    border-radius: 12px;
    cursor: pointer;
  }

  .ywlc {
    width: 100%;
    margin-right: 20px;
    box-shadow: 0 0 10px #dbdbdb;

    .title {
      line-height: 60px;
      border-bottom: 1px solid #dbdbdb;
      font-size: 20px;
      padding: 0 25px;
    }

    .ywlc-content {
      padding: 25px;
    }

    .ywlc-content-div {
      font-size: 18px;
      border-bottom: 1px solid #dbdbdb;
    }

    .jdscDiv {
      margin: 25px 0;
    }

    .f-lr {
      margin: 15px;
    }
  }
</style>

