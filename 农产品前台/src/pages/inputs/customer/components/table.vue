/*地块负责人*/
<template>
   <div>
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input style="vertical-align:bottom" placeholder="请输入农产品类型名称" @keyup.enter.native=search v-model.trim=positCode class="input-with-select"  size="small">
          </el-input> 
          <el-button type="primary" size="small" @click=search style="padding:5px 15px"><i class="el-icon-search f-fs20"></i></el-button>
          
       </div>
    </div> 
    <!-- 列表 -->
    <div class="f-mt20">
      <el-table   
       class="table"    
      :data="tableData"
      ref="table"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="产品块名称">
      </el-table-column>
      <el-table-column
        prop="produceType"
        label="种植产品类型">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="种植产品类型名称">
      </el-table-column>
     
      <el-table-column
        width="280"
        label="操作">
      <template slot-scope="scope">
        <el-button  size="mini" type="info" plain @click="editRow(scope.row)">编 辑</el-button>
        <el-button  size="mini" type="info" plain @click="editRow(scope.row)">删 除</el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @prev-click="prevChange(-1)"
            @next-click="prevChange(1)"
            :current-page="pageNum"
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
      import timeFormat from 'common/tools/timeFormat';
    export default {
        data(){
            return {
                sfky:false,
                positCode:'',
                pageNum:1,
                pageSize:10,
                totalCount:1,
                tableData: [],
                loading:false
            }
        },
        computed:{
          ...mapGetters({
              userInfo:'getUserInfo',
          })
        },  
       filters: {
  formateDate (time) {
    let date = new Date(time)
    return timeFormat.format(date, 'yyyy-MM-dd HH:mm:ss')
  }
},
        created(){
          this.getTableData();
        },
       methods:{


         //编辑
         editRow(row={}){
             this.$emit('edit',row)
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
           this.pageNum=1;
           this.getTableData();
         },
        //获取table的数据
        getTableData(obj={}){
          this.loading = true;
          let  pager={
              pageNum:this.pageNum,
              pageSize:this.pageSize
            }
          let params ={
            pager
          }
           params =JSON.stringify(params)
          this.$fetch.api_base.ProductTypeList({}).then(res=>{
            let {data} = res;

            this.tableData = data;
            console.log(this.tableData,"表单")
            this.loading = false;
          }).catch(()=>{
            console.log("到这里了11")
            this.loading = false;
          })
        },
        //分页条的方法
        handleSizeChange(idx){
          this.pageSize = idx || 10;
          this.pageNum=1;
          this.getTableData();
        },
        handleCurrentChange(idx){
          this.pageNum=idx;
          this.getTableData()
        },
        prevChange(isPrev){
          if(isPrev>0){
            this.pageNum=this.pageNum+1;
          }else{
            this.pageNum=this.pageNum-1;
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

<style>
/* .table .el-button:hover{
  background:#ecf5ff;
  color:#60acff;
  border:1px solid #60acff;
} */
.el-table .cell {
  color: #333;
  display: inline-block;
  width: 280px;
}
</style>

