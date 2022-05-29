/*地块负责人*/
<template>
   <div>
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
              <label>挂码日期</label>
             <date-picker @selChange="(val)=>{selDateRange=val}" style="vertical-align:bottom"></date-picker> 
              <label>挂码类型</label>
              <el-select  v-model.trim="gmly" size="small" class=" f-mr20 f-vab" style="vertical-align:bottom" placeholder="请选择"  @change=search>
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="基地生产"></el-option>
                <el-option value="2" label="外来采购"></el-option>
            </el-select>
              <label>状态</label>
              <el-select  v-model.trim="status" size="small" class=" f-mr20 f-vab" style="vertical-align:bottom" placeholder="请选择"  @change=search>
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="未审核"></el-option>
                <el-option value="2" label="待外审"></el-option>
                <el-option value="3" label="已作废"></el-option>
                <el-option value="4" label="外审通过"></el-option>
            </el-select>
              <el-input  placeholder="批次\产品"  @keyup.enter.native=search v-model.trim=searchKey style="vertical-align:bottom" class="input-with-select f-vab"  size="small">
              </el-input> 
          <el-button type="primary" size="small" @click=search style="padding:5px 15px"><i class="el-icon-search f-fs20"></i></el-button>
       </div>
    </div> 
    <!-- 列表 -->
    <div class="f-mt20">
      <el-table   
       class="table"    
      :data="tableData"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%">
      <el-table-column
        prop="hungDate"
        label="挂码日期">
      </el-table-column>
      <el-table-column
        prop="ncpMc"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="codeStart"
        label="开始码">
      </el-table-column>
      <el-table-column
        prop="codeEnd"
        label="结束码">
      </el-table-column>
      <el-table-column
        prop="codeTotal"
        label="挂码数（枚）">
      </el-table-column>
      <el-table-column
        prop="gmly"
        label="挂码类型">
        <template slot-scope="scope">
          <span v-text="scope.row.gmly==1?'基地生产':'外来采购'"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="hunger"
        label="挂码人">
      </el-table-column>
      <el-table-column
        prop="checkStatus"
        label="状态">
        <template slot-scope="scope">
          <span v-text="statusList[scope.row.checkStatus]"></span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        label="操作">
      <template slot-scope="scope">
        <el-button  v-if="scope.row.checkStatus==1" size="mini" class="edit"  @click="$emit('edit',scope.row)">处 理</el-button>
        <el-button  v-else size="mini" class="edit" @click="$emit('edit',scope.row)">查 看</el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @prev-click="prevChange(-1)"
            @next-click="prevChange(1)"
            :current-page="pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
     </el-pagination>
    </div> 
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios'
    
    export default {
        data(){
            return {
                selDateRange:null,
                statusList:{
                  "1":"待审核",
                  "2":"待外审",
                  "3":"已作废",
                  "4":"外审通过",
                  },
                status:'',
                gmly:'',
                searchKey:'',
                positCode:'',
                pageNo:1,
                pageSize:10,
                totalCount:1,
                tableData: [],
                loading:false,
                isEdit:false
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
         //处理
         handle(row={}){

         },
         search(){
           this.pageNo = 1;
           this.getTableData();
         },
        //获取table的数据
        getTableData(obj={}){
          this.loading = true;
          let {status,gmly,selDateRange,searchKey,pageNo,pageSize} = this;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            scjyqyId:this.userInfo.qyid,
            zzpc:searchKey,
            startDate:selDateRange?selDateRange[0]:'',
            endDate:selDateRange?selDateRange[1]:'',
            status,
            gmly,
            pageNo,
            pageSize
          };
          fetch({
              url:'/Bzgm/gm/pageHungCheck/',
              method:'get',
              data:params
          }).then(res=>{
            let {data,pageNo,totalCount} = res.list;
            this.tableData = data;
            this.totalCount = totalCount;
            this.pageNo = pageNo;
            this.loading = false;  
          }).catch(()=>{
            this.loading = false; 
          })
        },
        //分页条的方法
        handleSizeChange(idx){
          this.pageSize = idx || 10;
          this.pageNo=1;
          this.getTableData();
        },
        handleCurrentChange(idx){
          this.pageNo=idx;
          this.getTableData()
        },
        prevChange(isPrev){
          if(isPrev>0){
            this.pageNo=this.pageNo+1;
          }else{
            this.pageNo=this.pageNo-1;
          }
          this.getTableData()
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


