/*地块负责人*/
<template>
   <div>
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input style="vertical-align:bottom" placeholder="请输入地块名称" @keyup.enter.native=search v-model.trim=positCode class="input-with-select"  size="small">
          </el-input> 
          <el-button type="primary" size="small" @click=search style="padding:5px 15px"><i class="el-icon-search f-fs20"></i></el-button>
          <el-checkbox v-model.trim=sfky class="f-ml20"  @change=search>不显示停用的地块信息</el-checkbox>
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
        label="地块ID">
      </el-table-column>
      <el-table-column
        prop="areaName"
        label="地块名称">
      </el-table-column>
      <el-table-column
        prop="greenHouse"
        label="大棚名称">
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
        width="280"
        label="操作">
      <template slot-scope="scope">
        <el-button  size="mini" type="info" plain @click="editRow(scope.row)">编 辑</el-button>
        <el-button  size="mini" type="info" plain @click="editRow(scope.row)">删 除</el-button>
        <el-button  size="mini" type="info" plain @click="Sensor(scope.row)">传感器维护</el-button>
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
         Sensor(row){
           console.log(row.id,"选中的那一行")
           this.$router.push({name:'productionMaintain',query: {id:row.id}})
         },
         formateDa (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
},
// 左边补0函数
 padLeftZero (str) {
  return ('00' + str).substr(str.length)
},
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
          this.$fetch.api_base.AreaList(params).then(res=>{
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
  width: 280px;
}
</style>

