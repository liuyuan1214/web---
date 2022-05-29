/*地块负责人*/
<template>
   <div>
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input style="vertical-align:bottom" placeholder="请输入传感器名称" @keyup.enter.native=search v-model.trim=positCode class="input-with-select"  size="small">
          </el-input> 
          <el-button type="primary" size="small" @click=search style="padding:5px 15px"><i class="el-icon-search f-fs20"></i></el-button>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click=editRow round style="padding:9px 25px">新 增</el-button>
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
        label="传感器ID">
      </el-table-column>
      <el-table-column
        prop="sensorName"
        label="传感器名称">
      </el-table-column>
      <el-table-column
        prop="sensorType"
        label="传感器类型">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
        <template slot-scope="scope">
        <span>{{ scope.row.createTime|formateDate }}</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间">
        <template slot-scope="scope">
        <span>{{ scope.row.updateTime|formateDate }}</span>
      </template>
      </el-table-column>
      <el-table-column
        width="250"
        label="操作">
      <template slot-scope="scope">
        <el-button  size="mini" type="info" plain @click="editRow(scope.row)">编 辑</el-button>
        <el-button  size="mini" type="info" plain @click="editRow(scope.row)">删 除</el-button>
        <el-button  size="mini" type="info" plain @click="updateRow(scope.row)">传感器告警设置</el-button>
        <el-button  size="mini" type="info" plain @click="historyDetail(scope.row)">传感器历史记录查看</el-button>
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
         historyDetail(row){
            this.$router.push({name:'storeMaintain',query: {row:row}})
         },
         //传感器告警设置
         updateRow(row){
           this.$emit('edit',row)
         },
         //编辑
         editRow(row={}){
             this.$emit('edit',row)
         },

         search(){
           this.pageNum=1;
           this.getTableData();
         },
        //获取table的数据
        getTableData(obj={}){
           let { id } = this.$route.query
           console.log(id,"id号码")
          console.log("到达这里了")
          this.loading = true;

        
          let  pager={
              pageNum:this.pageNum,
              pageSize:this.pageSize
            }
          let params ={
            areaId:id,
            pager
          }
           params =JSON.stringify(params)
          this.$fetch.api_base.SensorList(params).then(res=>{
            let {data,pager} = res;

            this.tableData = data;
            this.totalCount = pager.count;
            this.pageNum = pager.pageNum;
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
  width: 200px;
}
</style>

