/*地块负责人*/
<template>
   <div>
     <!-- 搜索头部 -->
       <page-name v-model="isEdit"></page-name>
     <div class="header f-df f-pr20">
       <div>
              <label>日期</label>
             <date-picker @selChange="(val)=>{selDateRange=val}"></date-picker> 
              <label>状态</label>
              <el-select  v-model.trim="status" size="small" class=" f-mr20 f-vab" placeholder="请选择"  @change=search>
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="处理中"></el-option>
                <el-option value="2" label="完结"></el-option>
            </el-select>
              <el-input  placeholder="请输入农产品\批次"  @keyup.enter.native=search v-model.trim=searchKey class="f-mr20 input-with-select f-vab"  size="small">
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
        prop="askTime"
        label="质询日期">
      </el-table-column>
      <el-table-column
        prop="ncpmc"
        label="农产品名称">
      </el-table-column>
      <el-table-column
        prop="batchNo"
        label="批次码">
      </el-table-column>
      <el-table-column
        prop="content"
        label="质询内容">
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态">
        <template slot-scope="scope">
          <span v-text="scope.row.state==1?'处理中':'完结'"></span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        label="操作">
      <template slot-scope="scope">
        <el-button  v-if="scope.row.checkStatus==1" size="mini" class="edit" @click="handle(scope.row)">处 理</el-button>
        <span v-else>处理完成</span>
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
     <div class="f-red">
         问题： 质询page列表（查询时间子段）
     </div>
    </div> 
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios'
    
    export default {
        name:'questionInfo',
        data(){
            return {
                selDateRange:null,
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
         //状态是否可用
         stateChange(index){
           let currentItem = this.tableData[index];
           let {sccsId,sfky} = currentItem;
           //修改当前的状态
           sfky=sfky==1? 0:1;
           this.$fetch.api_base.dk_status({sccsId,sfky}).then(res=>{
              currentItem.sfky = sfky;
          })
         },
         search(){
           this.getTableData();
         },
        //获取table的数据
        getTableData(obj={}){
          this.loading = true;
          let {status,selDateRange,searchKey,pageNo,pageSize} = this;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            state:status,
            findName:searchKey,
            startDate:selDateRange?selDateRange[0]:'',
            endDate:selDateRange?selDateRange[1]:'',
            pageNo,
            pageSize
          };
          fetch({
              url:'/scgl/ns/pageJdQuestion/',
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


