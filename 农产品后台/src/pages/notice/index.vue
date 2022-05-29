/*投入品维护*/
<template>

     <div class="tab-item">
       <page-name v-model="showBack"></page-name>
       <!-- 搜索头部 -->
        <div class="header f-df f-pr20">
          <div>
              <label>日期</label>
             <el-date-picker
                v-model="query1.month"
                type="month"
                size="small"
                 value-format="yyyy-MM"
                placeholder="选择月">
             </el-date-picker> 
              <el-input  placeholder="请输入通知主题"  @keyup.enter.native=search1 v-model.trim=query1.searchKey class="f-mr20 input-with-select f-vab"  size="small">
              </el-input> 
              <el-button type="primary"  size="small" style="padding:5px 15px" @click=search1><i class="el-icon-search f-fs20"></i></el-button>
          </div>
        </div> 
        <div class="f-df f-mt10 f-mb10">
          <div>通知公告共：[ <span class="f-red">{{totalCount1}}</span> ] 条，未读：[ <span class="f-red">{{cdrzNum1}}</span> ] 条</div> 
        </div>
        <s-table
          style="margin-top:0"
          v-loading=loading1
          ref="table1"
          element-loading-text="拼命加载中"
          :tableData=tableData1
          :totalCount=totalCount1
		      :cdrzNum=cdrzNum1
          :getData=getTableData1
          :tableHeader=tableHeader1
      ></s-table>
       <v-info :form="editRow" v-if="isInfo" @closeForm="closeForm"></v-info>
     </div>
</template>

<script>
	  import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios'
    import vInfo from './info.vue';
    import timeFormat from 'common/tools/timeFormat';
    export default {
        name:'notice',
        data(){
            return {
                showBack:false,
                query1:{
                  searchKey:'',
                  month:null,
                },
                currentTab:1,
                //table参数
                tableHeader1:[
                  {label:'状态',prop:'readStatus',formatter:(value)=>{return value==2?'已阅':'未阅' },width:'150'},
                  {label:'日期',prop:'sendDate',width:'200'},
                  {label:'通知主题',prop:'title'},
                  {label:'发件人',prop:'yhxm',width:'220'},
                  {label:'操作',prop:'sfky','render-column':this.renderTzInfo1,width:'220'}
                ],
                loading1:false,
                totalCount1:0,
                cdrzNum1:0,
                tableData1: [],
                isInfo:false,
                editRow:{}
            }
        },
        components:{
          vInfo
        },
        computed:{
          ...mapGetters({
              userInfo:'getUserInfo',
          })
        },  
        created(){
          this.getTableData1();
        },
       methods:{
       /*render-column开始*/
        renderTzInfo1(h,row){
          return (
                <el-button size="mini" class="edit" onClick={()=>{this.getInfo(row)}}>查看</el-button> 
          )
        },
        getInfo(editRow){
            fetch({
              method:'get',
              url:'/jgNotice/getNoticeById/',
              data:{
                id:editRow.id
              }
            }).then((res)=>{
              this.editRow = res.bean;
              this.isInfo=true
            }).catch((res)=>{
                this.$message.error(res.errorMess)
            })
            //阅读通知
            if(editRow.readStatus==1){
              this.hasReadInfo(editRow);
            }
        },
        hasReadInfo(editRow){
            fetch({
              method:'post',
              url:'/jgNotice/saveReader/',
              data:{
                noticeId:editRow.id,
                userId:this.userInfo.userId,
                deptSno:this.userInfo.ztdm
              }
            }).then((res)=>{
              //阅读成功; 修改状态
              this.getTableData1({pageNo: this.$refs.table1.pageNo,pageSize: this.$refs.table1.pageSize});
              this.$store.dispatch("setUnreadNotice");
            }).catch((res)=>{
                this.$message.error(res.errorMess)
            })
        },
       /*render-column结束*/
       search1(){
         this.$refs.table1.pageNo = 1;
         this.getTableData1();
       },
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        getTableData1(obj={}){
          this.loading = true;
          let {searchKey,month} = this.query1;
          let {userId} =  this.userInfo;
          let params = {
            ztyhId:userId,
            noticeKey:searchKey,
            month
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          fetch({
            url:'/utilmodel/qy/pageNoticeRecList/',
            method:'get',
            data:params
          }).then(res=>{
            let {data,pageNo,totalCount,cdrzNum} = res.list;
            this.tableData1 = data;
            this.totalCount1 = totalCount;
			this.cdrzNum1=cdrzNum?cdrzNum:0;
            this.currentPage1 = pageNo;
            this.loading1 = false;
          }).catch(()=>{
            this.loading1 = false;
          })
        },
    //用户通过点击半透明处或右上角x关闭
    closeForm() {
      this.isInfo = false;
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
       background:#2695b3;
     }
   }
   .header{
    //  margin-bottom:10px;
     .input-with-select{
       width:240px;
    }
   }

   .ncp-img{
     width:50px;
     height:50px;
     border-radius:50%;
   }
</style>



