<template>
  <div class="panel f-df">
    <div class="feature f-f1">
      <div class="userinfo">
        
      </div>
       <img src="../../../static/pic/pic1.jpg" alt="">
       <img src="../../../static/pic/pic2.jpg" alt="">
       <!-- <img src="../../../static/pic/pic3.webp" alt="">
       <img src="../../../static/pic/pic4.webp" alt=""> -->
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

