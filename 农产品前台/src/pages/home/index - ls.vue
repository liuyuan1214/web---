
<template>
   <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="培育记录" name="first">
    <div class="f-mt20">
      <el-table   
       class="table"    
      :data="tableData1"
      ref="table"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%">
      <el-table-column
        prop="operator"
        width="150"
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="operateName"
         width="180"
        label="操作名称">
      </el-table-column>
      <el-table-column
        prop="operateTime"
        width="180"
        label="操作时间">
        <template slot-scope="scope">
        <span>{{ scope.row.operateTime|formateDate }}</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="operateImgUrl"
        width="280"
        label="操作附图">
        <template slot-scope="scope">
        <img>{{ scope.row.operateImgUrl }}</img>
      </template>
      </el-table-column>
      <el-table-column
        prop="comment"
        width="150"
        label="备注">
      </el-table-column>
    </el-table>
    </div> 

    </el-tab-pane>
    <el-tab-pane label="生产包装记录" name="second">

        <div class="f-mt20">
      <el-table   
       class="table"    
      :data="tableData2"
      ref="table"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%">
            <el-table-column
        prop="operator"
        width="150"
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="operateName"
         width="180"
        label="操作名称">
      </el-table-column>
      <el-table-column
        prop="operateTime"
        width="180"
        label="操作时间">
        <template slot-scope="scope">
        <span>{{ scope.row.operateTime|formateDate }}</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="operateImgUrl"
        width="280"
        label="操作附图">
        <template slot-scope="scope">
        <img>{{ scope.row.operateImgUrl }}</img>
      </template>
      </el-table-column>
      <el-table-column
        prop="comment"
        width="150"
        label="备注">
      </el-table-column>
    </el-table>
    </div> 
    </el-tab-pane>
    <el-tab-pane label="质检记录" name="third">

        <div class="f-mt20">
      <el-table   
       class="table"    
      :data="tableData3"
      ref="table"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%">
           <el-table-column
        prop="inspector"
        width="150"
        label="质检人">
      </el-table-column>
      <el-table-column
        prop="inspectTime"
         width="180"
        label="质检时间">
        <template slot-scope="scope">
        <span>{{ scope.row.inspectTime|formateDate }}</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="inspectScore"
        width="180"
        label="质检分数">
        <template slot-scope="scope">
        <span>{{ scope.row.inspectScore }}分</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="pass"
        width="280"
        label="质检是否通过">
        <template slot-scope="scope">
        <img>{{ scope.row.pass }}</img>
      </template>
      </el-table-column>
      <el-table-column
        prop="comment"
        width="150"
        label="备注">
      </el-table-column>
    </el-table>
    </div> 

    </el-tab-pane>
    <el-tab-pane label="物流记录" name="fourth">

        <div class="f-mt20">
      <el-table   
       class="table"    
      :data="tableData4"
      ref="table"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%">
      <el-table-column
        prop="logisticsOrderNo"
        width="150"
        label="物流单号">
      </el-table-column>
      <el-table-column
        prop="logisticsCompanyName"
         width="180"
        label="物流公司">
      </el-table-column>
    </el-table>
    </div> 
    </el-tab-pane>
  </el-tabs>
   </div>
</template>

<script>
	import vEdit  from './component/edit.vue';
	import vTable from './component/table';
     import timeFormat from 'common/tools/timeFormat';
    export default {
        name:'inputApplication',        
        components:{
            vEdit,
            vTable
        },
        filters: {
  formateDate (time) {
    let date = new Date(time)
    return timeFormat.format(date, 'yyyy-MM-dd HH:mm:ss')
  }
},

        mounted(){
             let { id } = this.$route.query
             console.log(id,"地块名称")
             var params ={
               "blockId":"1"
             }
             this.$fetch.api_base.ProductBlockInfo(params).then((res1)=>{
              
            let {data} =res1
            this.tableData1 = data.cultivation;
            this.tableData2 = data.process;
            this.tableData3 = data.qualityCheck;
            this.tableData4 = data.logistics;
          
            }).catch(()=>{
             
               
            })
        },
        data(){
            return {
                tableData1:[],
                tableData2:[],
                tableData3:[],
                tableData4:[],
                activeName: 'second',
               isEdit:false,   // 判断显示table 还是 编辑弹框
               editId:'',
               khtype:[
                  {label:'销售商',value:'01'},
                  {label:'农资供应商',value:'02'},
                  {label:'农产品供应商',value:'04'},
                ],
               editRow: {
                    nhId: '',
                    nhxm: '',
                    sfzh:'',
                    xb:'1',
                    dz: '',
                    bz: '',
                    lxdh: '',
                    sfky:1
                   }
            }
        },
       methods:{
          
       }
    }
</script>

<style lang="scss" scoped>
   .input-with-select{
       width:240px;
   }
   .ncp-img{
     width:50px;
     height:50px;
     border-radius:50%;
   }
   .editFzr{
       margin-left:150px;
   }
</style>






<!-- <template>
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
          <div class="f-fs18" >
              累计：<count-to :start-val="0" :end-val="statistcValue[item.valueTotal]" separator="" class="num" :duration="1000" />
            </div>
        </div>
      </div>
      <div class="sub-title">快捷操作</div>
      <div class="f-df ">
        <div class="base-operate f-cp" @click="$router.push({path:item.pagePath})" v-for="(item,index) in CommonOperations" :key="index">
          <div class="f-fs20"> <img :src="`./static/operateicon/operate${index+1}.png`" alt="">{{item.title}}</div>
        </div>
      </div>
      <div class="sub-title">待处理任务</div>
    </div>
    <div class="navigation f-pr10 f-pr" >
      <img src="../../../static/navigation/navigate.gif"  class="f-cp"  @click="$router.push({path:'/home/navigation'})" alt="">

      <div class="click-btn f-cp" @click="$router.push({path:'/home/navigation'})"></div>
      <div class="contact">
        <div class="item"></i></div>
        <img src="../../../static/navigation/qq.png" alt="">
        <div class="item">&nbsp;</div>
        <img src="../../../static/navigation/app.png" alt="">
        <div class="item">微信扫一扫使用小程序</div>
      </div>
    </div>
  </div>
</template>
-->

// <script>
// import { mapGetters } from 'vuex'
// import CountTo from 'vue-count-to'
// import fetch from "fetch/axios";
// import timeFormat from 'common/tools/timeFormat';
// export default {
//   name:'home',
//   components:{
//     CountTo
//   },
//   data() {
//     return {
//       msg: "home page",
//       date:'',
//       weekday:'',
//       statistcValue:{
//           fmslToday: '',
//           fmslTotal: '',
//           gmslToday: '',
//           gmslTotal: '',
//           qyzjToday: '',
//           qyzjTotal: '',
//           wtjcslToday: '',
//           wtjcslTotal: '',
//           zzcsToday: '',
//           zzcsTotal: '',
//       },
//       statisticallist: [
//         { title: "农事记录(批)", bg: "#fcb83f" ,valueT:'zzcsToday',valueTotal:'zzcsTotal' , pagePath:'/product/farm'},
//         { title: "委托检测(份)", bg: "#a36afb" ,valueT:'wtjcslToday',valueTotal:'wtjcslTotal', pagePath:'/test/testCommsion'},
//         { title: "企业自检(批次)", bg: "#f49422" ,valueT:'qyzjToday',valueTotal:'qyzjTotal', pagePath:'/test/self'},
// 		{ title: "追溯标签发放量(枚)", bg: "#35c4af" ,valueT:'gmslToday',valueTotal:'gmslTotal', pagePath:'/warehouse/hangingCode'},
//         { title: "追溯标签访问量(枚)", bg: "#3bafd2" ,valueT:'fmslToday',valueTotal:'fmslTotal'},
//       ],
//       CommonOperations: [
//         { title: "产品维护", icon: "ny-icon-shouye", pagePath:'/base/productionMaintain'},
//         { title: "农事操作", icon: "ny-icon-shouye", pagePath:'/product/farm'},
// 		{ title: "委托检测", icon: "ny-icon-shouye" ,pagePath:'/test/testCommsion'},
//         { title: "加工包装", icon: "ny-icon-shouye" ,pagePath:'/warehouse/packaging'},
//         { title: "产品挂码", icon: "ny-icon-shouye" ,pagePath:'/warehouse/hangingCode'},
//         { title: "销售单", icon: "ny-icon-shouye",pagePath:'/sale/saleList' },
//       ],
//       jgQuestionCount:0,
//       checkNum:0,
//     };
//   },
//     computed:{
//       ...mapGetters({
//         userInfo:"getUserInfo"
//       })
//     },
//     created(){
//       this.date=timeFormat.eight(new Date());
//       var weekday = new Date().getDay();
//       let weekdaytext = ['天','一','二','三','四','五','六'];
//       this.weekday=weekdaytext[weekday];
//       this.getStaticalInfo();
//       this.getJgQuestionCount();
//     },
//   methods: {
//     getStaticalInfo(){
//       let{scjyztId,qyid} = this.userInfo;
//       fetch({
//         url:'/scgl/ns/scglxtSytj',
//         method:'get',
//         data:{
//           date:timeFormat.one(new Date()),
//           scjyztId,
//           qyId:qyid
//         }
//       }).then(res => {
//           if(res.list){
//             this.statistcValue = res.list;
//           }
//         })
//     },
   
//   }
// };
// </script>
// <style scoped lang="scss">
// .userinfo{
//   line-height:80px;
//   font-size:18px;
//   &>span{
//     padding-right:10px;
//   }
// }
// .base-rules{
//   height: 162px;
//   border-radius:10px;
//   line-height:40px;
//   margin-right:20px;
//   color:#fff;
//   text-align:center;
//   display: flex;
//   flex-direction: column;
//   justify-content:center;
//   align-items: center;
//   .numToday{
//     font-size:28px;
//     width:100%;
//   }
// }
// .base-operate{
//     border-radius: 10px;
//     height: 60px;
//     line-height: 60px;
//     width: 170px;
//     margin-right: 20px;
//     color: #fff;
//     text-align: center;
//     font-size: 20px;
//     width: 130px;
//     background: #a9cd06;
//   img{
//     vertical-align:middle;
//     width:35px;
//     margin-right:5px;
//   }
// }
// .sub-title{
//   height:35px;
//   margin:50px 0  30px 0;
//   line-height:35px;
//   font-size:18px;
//   color:#fff;
//   padding:0 20px;
//   display:inline-block;
//   background:#417f04;
//   border-top-right-radius: 18px;
// }
// .questionCount{
//   background: #f5f5f5;
//   padding:40px 25px;
//   line-height:45px;
//   font-size:20px;
// }
// .navigation{
//   width:320px;
//   .click-btn{
//     position: absolute;
//     top: 170px;
//     right: 90px;
//     left: 120px;
//     height: 50px;
//   }
//   .contact{
//     width:280px;
//     padding:45px 0 30px 0;
//     margin: -66px 0 0 30px;
//     background: #fff3e5;
//     text-align: center;
//     font-size:18px;
//     img{
//       width:160px;
//       margin-top:14px;
//     }
//     .item{
//       line-height:45px;
//     }
//   }
// }
// </style>

