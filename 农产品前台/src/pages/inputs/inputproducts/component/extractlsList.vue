/*进货单提取列表*/
<template>
   <div style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
	      <label>选择农户：</label>
            <el-select v-model.trim="nhId" size="small"  clearable  class="f-vab f-mr20" style="width:150px;" placeholder="请选择">
              <el-option
                v-for="item in xhxmlist"
                :key="item.nhId"
                :label="item.nhxm"
                :value="item.nhId">
              </el-option>
          </el-select>
          <label>进货日期：</label>
          <date-picker style="vertical-align:bottom" @selChange="(val)=>{selDateRange=val}"></date-picker> 
          <el-input placeholder="请输入供应商单位名称/零售单号" style="vertical-align:bottom" @keyup.enter.native=getTableData v-model.trim=findName class="input-with-select"  size="small"></el-input>
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
        :visible.sync="extractlsInfoDialog"
        :before-close="()=>{extractlsInfoDialog = false}"
      >
       <extractOperatels :id="currentRow.id?currentRow.id:''" @close="extractlsInfoDialog = false;search()" />
      </el-dialog>
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios/'
	import extractOperatels  from './extractOperatels.vue';
    export default {
      components:{
        extractOperatels
      },
        data(){
            return {
                selDateRange:null,
                findName:'',
                currentRow:{},
				nhId:'',
                extractlsInfoDialog:false,
                //table参数
                tableHeader:[
                  {label:'购买时间',prop:'cjsj',width:'180'},
                  {label:'单据编号',prop:'lsdh',width:'160'},
                  {label:'供应商单位',prop:'bizName'},
                  {label:'订单总金额（元）',prop:'jsje',width:'150'},
                  {label:'操作',width:'120','render-column':(h,row)=>{
                     return (
                           <el-button size="mini" class="edit"  onClick={()=>{this.currentRow = row;this.extractlsInfoDialog=true}}>操作</el-button>
                        )
                  }}
                ],
                loading:false,
                totalCount:1,
				xhxmlist: [],
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
		  this.getNh();
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
        getNh(){
          let params = {
            qyid:this.userInfo.qyid,
            sfky:1
          };
          fetch({
            method:'get',
            url:'/jcdk/dk/listNhQY/',
            data:params
          }).then(res=>{
           this.xhxmlist = res.list;
          }).catch(()=>{
            this.loading = false;
          })
        },
        getTableData(obj={pageSize:10,pageNo:1}){
          this.loading = true;
           let { findName } = this;
           let selDateRange = this.selDateRange;
          let params = {
            key:findName,
			zt:2,
			nhId:this.nhId,
            startDate:selDateRange? selDateRange[0]:'',
            endDate:selDateRange? selDateRange[1]:''
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          fetch({
            method:'get',
            url:'/nzsyLs/pageLsddbForny/',
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



