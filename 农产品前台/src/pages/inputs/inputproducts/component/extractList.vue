/*进货单提取列表*/
<template>
   <div style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <label>进货日期：</label>
          <date-picker style="vertical-align:bottom" @selChange="(val)=>{selDateRange=val}"></date-picker> 
          <el-input placeholder="请输入供应商单位名称/销售编号" style="vertical-align:bottom" @keyup.enter.native=getTableData v-model.trim=findName class="input-with-select"  size="small"></el-input>
          <el-button type="primary" size="small" style="padding:5px 15px" @click=search><i class="el-icon-search f-fs20"></i></el-button>
       </div>
    </div> 
     <s-table
        v-loading=loading
        class="table"
        ref="stable"
         element-loading-text="拼命加载中"
        :tableData=tableData
        :totalCount=totalCount
        :getData=getTableData
        :tableHeader="tableHeader"
     ></s-table>
      <el-dialog
        title="采购单提取"
        width="1200px"
        :append-to-body="true"
        :visible.sync="extractInfoDialog"
        :before-close="()=>{extractInfoDialog = false}"
      >
       <extractOperate :id="currentRow.id?currentRow.id:''" @close="extractInfoDialog = false;search()" />
      </el-dialog>
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios/'
	import extractOperate  from './extractOperate.vue';
    export default {
      components:{
        extractOperate
      },
        data(){
            return {
                selDateRange:null,
                findName:'',
                currentRow:{},
                extractInfoDialog:false,
                //table参数
                tableHeader:[
                  {label:'进货日期',prop:'saleDate',width:'120'},
                  {label:'单据编号',prop:'saleSno',width:'140'},
                  {label:'供应商单位',prop:'cusName'},
                  {label:'订单总金额（元）',prop:'zhjze',width:'135'},
                  {label:'操作',width:'120','render-column':(h,row)=>{
                     return (
                           <el-button size="mini" class="edit"  onClick={()=>{this.currentRow = row;this.extractInfoDialog=true}}>操作</el-button>
                        )
                  }}
                ],
                loading:false,
                totalCount:1,
                tableData: []
            }
        },
        computed:{
          ...mapGetters({
              userInfo:'getUserInfo',
          })
        },  
        created(){
          this.getTableData();
        },
       methods:{  
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */       
        search(){
          this.$refs.stable.pageNo=1;
          this.$refs.stable.getDataByPage();
        },
        getTableData(obj={pageSize:10,pageNo:1}){
          this.loading = true;
           let { findName } = this;
           let selDateRange = this.selDateRange;
          let params = {
			qyId:this.userInfo.qyid,
            key:findName,
            startDate:selDateRange? selDateRange[0]:'',
            endDate:selDateRange? selDateRange[1]:''
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          fetch({
            method:'get',
            url:'/nzsySale/pageSaleInfoForNy/',
            data:params
          }).then(res=>{
            let {data,pageNo,totalCount} = res.list;
            this.tableData = data;
            this.totalCount = totalCount;
            this.currentPage = pageNo;
            this.loading = false;
          }).catch(()=>{
            this.loading = false;
          })
        }
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
</style>



