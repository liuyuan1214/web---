<template>
<div>

  <div class="f-f1" style="text-align: right;margin:-10px 20px 20px">
    <el-button type="primary" size="medium" v-print="'#pdfDom'" round style="padding:9px 25px" :disabled="isDisable" @click="printBtn">打印</el-button>
  </div>

  <div class="print" id="pdfDom" style="page-break-after:always">
    <div v-for="(item,index) in printList" :Key="index" class="printDiv" :style="{height:scrollerHeight}">
      <div :class="[item.ccsl==1?'f-df f-dfmb20':'f-df']">
        <div :class="[item.ccsl==1?'printLogo':'printLogo2']">
          <img :src=[item.qyLogo?item.qyLogo:imgUrl]>
        </div>
        <div :class="[item.ccsl==1?'printTitle':'printTitle']">食用农产品合格证</div>
      </div>
      <div class="printbh">编号：{{item.bh}}</div>
      <div class="printscqy">{{item.scdw}}</div>
      <div class="f-df" style="margin-top: 4px;margin-bottom: 4px;">
        <div style="margin-right: 7px">
          <div :class="[item.ccsl==1?'printDiv1':'printDiv2']">食用农产品：{{item.ncpMc}}</div>
          <div :class="[item.ccsl==1?'printDiv1':'printDiv2']">数量(重量)：{{item.zl}}kg</div>
          <div :class="[item.ccsl==1?'printDiv1':'printDiv2']">开具日期：{{item.kjrq}}</div>
          <div :class="[item.ccsl==1?'printDiv1':'printDiv2']">联系方式：{{item.lxfs}}</div>
          <div :class="[item.ccsl==1?'printDiv1':'printDiv2']">产地：{{item.cd}}</div>
          <div :class="[item.ccsl==1?'printDiv1':'printDiv2']">生产盖章或签名：</div>
          <div :class="[item.ccsl==1?'printDiv1':'printDiv2']">安全保障方式：</div>
        </div>
        <div style="width: 55px;">
          <div class="cpslog">产品溯源 品质保障</div>
        <div :class="[item.ccsl==1?'ewm':'ewm2']" :id="'qrcode'+index">
        </div>
        </div>
      </div>
      <div style="margin-top: 8px;">
        <img :src="[item.aqbzfs==1?hgzUrl1:item.aqbzfs==2?hgzUrl2:item.aqbzfs==3?hgzUrl3:hgzUrl4]">
      </div>
    </div>


  </div>
</div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import {exec} from 'common/tools'
  import fetch from 'fetch/axios'
  import timeFormat from 'common/tools/timeFormat';
  import $ from 'jquery'
  import QRCode from 'qrcodejs2'

  export default {
    props: {
      printBean: {
        type: Object,
        default: function () {
          return {}
        }
      },
    },
    data(){
      return {
        isDisable:false,
        height:'',
        printList:[],
        imgUrl:"./static/noimghgz.png",
        hgzUrl1:"./static/hgz1.png",
        hgzUrl2:"./static/hgz2.png",
        hgzUrl3:"./static/hgz3.png",
        hgzUrl4:"./static/hgz4.png",
      }
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      }),
      scrollerHeight: function() {
        if(this.printBean.ccsl == 1){
          return 83.7*3.78+'px';
        }else{
          return 46.8*3.78+'px';
        }
      },
    },
    created() {
      this.getPrintPage();
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.getPrintPage();
      // });
    },

    methods: {
      getPrintPage(){
        var newlist =[];//二维码数组
        var printBean = this.printBean;
        for(var i=0;i<printBean.ewmlist.length;i++){
          var bean = {};
          bean.ccsl = printBean.ccsl;
          bean.qyLogo = printBean.qyLogo;
          bean.bh = printBean.bh;
          bean.scdw = printBean.scdw;
          bean.ncpMc = printBean.ncpMc;
          bean.zl = printBean.zl;
          bean.kjrq = printBean.kjrq;
          bean.lxfs = printBean.lxfs;
          bean.cd = printBean.cd;
          bean.aqbzfs = printBean.aqbzfs;
          bean.bh = printBean.ewmlist[i].bh;
          this.printList.push(bean)//存入列表数组
          newlist.push(printBean.ewmlist[i])//存入二维码数组
        }
        //生成二维码
        this.$nextTick(() => {
          newlist.forEach((item,index) => {
            let qrcodeEL = document.getElementById("qrcode"+index);
            var qrcode = new QRCode("qrcode"+index, {
              text: item.ewmdz,
              width: 70,
              height: 70,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H
            });

          });
        });

      },
      printBtn(){
        this.isDisable = true
      }
    }

  }
</script>

<style scoped>
  .print{
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    page-break-after:always;
  }
  .printDiv{
    border:solid 1px ;
    /*A4纸大小：211mm*297mm 对应的像素：794px*1123px 所以 1mm = 3.78px*/
    width: 208px;
    padding: 10px;
    font-size: 12px;
    margin: 5px 3px;
  }
  .printDiv div{
  }
  .printDiv1{
    line-height: 15px;
    -webkit-transform-origin-x: 0;
    -webkit-transform: scale(0.70);
    width: 155px;
  }
  .printDiv2{
     line-height: 15px;
    -webkit-transform-origin-x: 0;
    -webkit-transform: scale(0.70);
    width: 155px;
   }
  .printLogo{
    width: 70px;
    height: 35px;
  }
  .printLogo2{
    width: 50px;
    height: 50px;
  }
  .printLogo img,.printLogo2 img{
    width: 100%;
    height: 100%;
  }
  .printTitle{
    font-size: 13px;
    font-weight: bold;
    line-height: 30px;
    text-indent: 10px;
  }
  .printbh{
    -webkit-transform-origin-x: 0;
    -webkit-transform: scale(0.67);
    width: 308px;
    text-align: right;
    margin-top: -5px;
  }
  .printscqy{
    overflow: hidden;
    font-size: 13px;
    font-weight: bolder;
    white-space:nowrap;
  }
  .printTitle2{
    font-size: 13px;
    font-weight: bold;
    line-height: 55px;
    text-indent: 15px;
  }
  .ewm{
    width: 70px;
    height: 70px;
    margin-left: -25px;
  }
  .ewm2{
    width: 70px;
    height: 70px;
    margin-left: -25px;
  }
  .ewm img,.ewm2 img{
    width: 100%;
  }
  .marginFooter{
    height: 20px;
    line-height: 20px;
    text-align: center;
  }
  .cpslog{
    -webkit-transform-origin-x: 0px;
    transform: scale(0.67);
    margin-right: -34px;
    margin-left: -26px;
    width: 108px;
  }
  img{
    width:100%;
    height:100%;
  }
</style>
