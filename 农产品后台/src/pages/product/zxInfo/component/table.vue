/*质询信息*/
<template>
   <div class="dpwh">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
           <label>日期</label>
           <date-picker class="f-vab"  @selChange="(val)=>{selDateRange=val}"></date-picker> 
          <label>状态</label>
            <el-select v-model.trim="state" size="small"  clearable  class="f-vab f-mr20" style="width:150px;" placeholder="请选择"  @change=getTableData({pageSize:10,pageNo:1})>
               <el-option  label="全部" value=""></el-option>
               <el-option  label="处理中" value="1"></el-option>
               <el-option  label="完结" value="2"></el-option>
             
          </el-select>
           <el-input style="vertical-align:bottom" placeholder="批次/农产品名称"  @keyup.enter.native=search v-model.trim=searchkey class="input-with-select f-vab"  size="small">
          </el-input> 
          <el-button type="primary" size="small" style="padding:5px 15px" @click=search><i class="el-icon-search f-fs20"></i></el-button>
       </div>
    </div>
     <s-table
        v-loading=loading
        class="table"
        ref='stable'
         element-loading-text="拼命加载中"
        :tableData=tableData
        :totalCount=totalCount
        :getData=getTableData
        :tableHeader=tableHeader
     ></s-table>
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios/';
	  import vEdit  from './edit.vue';
    export default {
        data(){
            return {
                findName:'',
                selDateRange:null,
                searchkey:'',
                city:'',
                town:'',
                street:'',
                industryIds:'',
                state:'',
                isEdit:false,
                editRow:{},
                //table参数
                tableHeader:[
                  {label:'质询时间',prop:'askTime',width:'180'},
                  {label:'农产品',prop:'sortName',width:'180'},
                  {label:'生产批次',prop:'batchNo',width:'200'},
                  {label:'企业名称',prop:'companyName',width:'350'},
                  {label:'质询内容',prop:'content'},
                  {label:'状态',prop:'state',width:'180',formatter:(val)=>{return val==1? '处理中':'完结' }},
                  {label:'操作',prop:'state',width:'200','render-column':this.renderEdit}
                ],
                loading:false,
                pageSize:10,
                currentPage:1,
                totalCount:1,
                tableData: [],
                citylist:[],
                townlist:[],
                streetlist:[],
                industylist:[]
            }
        },
        computed:{
          ...mapGetters({
              userInfo:'getUserInfo',
          })
        },  
        components:{
          vEdit
        },
        created(){
           setTimeout(()=>{
            this.getTableData();
          },100)
          // this.getTableData();
        },
       methods:{
       /*render-column开始*/
        renderEdit(h,row){
          return (
            <div>
                <el-button size="mini" class="edit" onClick={()=>{return this.$emit("editrow",row) }}>{row.state==1?'处理':'查看'}</el-button>
            </div>
          )
        },
       /*render-column结束*/
      
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        search(){
          this.$refs.stable.pageNo=1;
          this.getTableData();
        },
        getTableData(obj={}){
          this.loading = true;
          let { searchkey,state,selDateRange } = this;
          let params = {
            findName:searchkey,
			scjyztId:this.userInfo.scjyztId,
            state,
            startDate:selDateRange? selDateRange[0]:'',
            endDate:selDateRange? selDateRange[1]:''
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          fetch({
            method:'get',
            url:'/scgl/ns/pageJdQuestion/', 
            data:params
          }).then(res=>{
            let {data,pageNo,totalCount,pageSize} = res.list;
            this.tableData = data;
            this.pageSize= pageSize
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
   .logoImg{
       width:80px;
       height:80px;
       border-radius:5px;
   }
</style>

<style lang="scss">
  .dpwh .logoImg{
       width:80px;
       height:80px;
       border-radius:5px;
   }
</style>
