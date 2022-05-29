<template>
   <div class="dkfzr" style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input placeholder="商品名称"  @keyup.enter.native=search v-model.trim=ncpmc class="input-with-select f-vab"  size="small">
          </el-input> 
          <el-button type="primary" size="small" style="padding:5px 15px" @click=search><i class="el-icon-search f-fs20"></i></el-button>
       </div>
    </div> 
    <el-table
      class="f-mt20"
      :data="tableData"
      stripe
      check
      ref="multipleTable"
      v-loading=loading
      style="width: 100%"
      @select="select" 
      @select-all="selectAll" >
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="ncpmc"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="gg"
        label="规格类型">
      </el-table-column>
      <el-table-column
        prop="dw"
        width="80"
        label="单位">
      </el-table-column>
      <el-table-column
        prop="yl"
        width="80"
        label="余量">
      </el-table-column>
      <el-table-column
        prop="xgpc"
        width="220"
        label="批次号">
      </el-table-column>
      <!-- <el-table-column
        prop="lx"
        label="类型">
	        <template slot-scope="scope">
	          <span style="margin-left: 10px">{{ lxlistALl[scope.row.lx].label }}</span>
	        </template>
      </el-table-column> -->
    </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>
    <div class="f-mt30">
              <el-button round type="primary" @click=selNcp>选 中</el-button>
              <el-button  round  @click="$emit('close')">关 闭</el-button>
      </div>
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios'
  import muiltsel from './muiltsel.js';

    export default {
        mixins:[muiltsel],
        data(){
            return {
                sfky:false,
                ncpmc:'',
                ly:'',
                lx:'',
                lylists:[
                  {label:'全部',value:''},
                  {label:'基地生产',value:'1'},
                  {label:'外来采购',value:'2'},
                ],
                lxlistsChangeByly:[],
                lxlistALl:[
                  {label:'全部',value:''},
                  {label:'采收',value:'1'},
                  {label:'采购',value:'2'},
                  {label:'包装',value:'3'},
                ],
                lxlistcg:[
                  {label:'全部',value:''},
                  {label:'采购',value:'2'},
                  {label:'包装',value:'3'},
                ],
                
                lxlistsc:[
                  {label:'全部',value:''},
                  {label:'采收',value:'1'},
                  {label:'包装',value:'3'},
                ],        
                addNcpDialogVisable:false,
                loading:false,
                totalCount:1,
                pageSize:10,
                pageNo:1,
                tableData: [],
                multipleSelection:[],
                taskData:[],

               selRows:[]
            }
        },
        props:{
          selIds:{
            type:Array,
            default:function(){
              return []
            }
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
          this.pageNo=1;
          this.getTableData();
        },
          selLy(val){
            this.lx = '';
            this.lxlistsChangeByly = val == 1?
                          this.lxlistsc:val == 2?
                                      this.lxlistcg : [];
          },
        handleSizeChange(pageSize){
          var oldPageSize = this.pageSize;
          this.pageSize = pageSize;
          this.getTableData({pageSize,pageNo:this.pageNo});
        },
        handleCurrentChange(pageNo){
          this.pageNo = pageNo;
          this.getTableData({pageNo,pageSize:this.pageSize});
        },
        getTableData(obj={}){
          this.loading = true;
          let {sfky,ncpmc,lx,ly} = this;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            searchKey:ncpmc,
            sfky:1,
            lx,
            // ly:this.userInfo.nyVersion==5?'4':ly,
            type:'1'
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          fetch({
            method:'get',
            url:'/Bzgm/pckcb/pagePckcb/',
            data:params
          }).then(res=>{
            let {data,pageNo,totalCount} = res.list;
            this.tableData = data;
            this.totalCount = totalCount;
              if (this.taskData.length || this.selIds.length) {
                this.toggleSelection(this.taskData)
              }
              this.loading = false;
          }).catch(()=>{
            this.loading = false;
          })
        },
        selNcp(){
          this.$emit('selNcp',this.taskData)
          this.$message.success('添加成功!')
          this.taskData = [];
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
   .f-lh32{
     line-height:32px;
   }
   .w120p{
     width:120px;
   }
</style>
<style>
/* .table .el-button:hover{
  background:#ecf5ff;
  color:#60acff;
  border:1px solid #60acff;
} */
.table .logoImg{
       width:80px;
       height:80px;
       border-radius:5px;
   }
</style>

