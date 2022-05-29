<template>
   <div class="dkfzr" style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input placeholder="产品名称\商品条码"  @keyup.enter.native=search v-model.trim=ncpmc class="input-with-select f-vab"  size="small">
          </el-input> 
          <el-button type="primary" size="small" style="padding:5px 15px" @click=search><i class="el-icon-search f-fs20"></i></el-button>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="addNcpDialogVisable=true" round style="padding:9px 25px">新 增</el-button>
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
      @select-all="selectAll">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="ncpmc"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="ggxh"
        label="规格类型">
      </el-table-column>
      <el-table-column
        prop="dw"
        label="单位">
      </el-table-column>
    </el-table>
    <!-- <div style="height:75px;"> -->
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
    <!-- </div> -->
    <div class="f-mt30">
              <el-button round type="primary" @click=selNcp>选 中</el-button>
              <el-button  round  @click="$emit('close')">关 闭</el-button>
      </div>
    <!-- <el-dialog
      title="新增农产品"
      :append-to-body="true"
      :visible.sync="addNcpDialogVisable"
      width="800px"
    >
      <sel-supname style="margin:0 auto;"  @selsup=selsup></sel-supname>  
    </el-dialog>  -->
   <div class="f-red">问题：新增还未做</div>
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios/'
	  // import { mapGetters } from 'vuex'
    export default {
        data(){
            return {
                sfky:false,
                ncpmc:'',
                addNcpDialogVisable:false,
                loading:false,
                totalCount:1,
                pageSize:10,
                pageNo:1,
                tableData: [],
                taskData:[],
                multipleSelection:[],
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
          this.getTableData({pageNo:1,pageSize:this.pageSize});
        },
        // 选中table已有数据
        toggleSelection(rows) {
          rows = this.selIds.concat(rows)
          
          if (rows) {
            rows.forEach(row => {
              this.$nextTick(() => {
                var checked = this.tableData.find(
                  tableRow => {return tableRow.ztncpId == row.ztncpId}
                )
                

                this.$refs.multipleTable.toggleRowSelection(checked)
              })
            })
          } else {
            this.$refs.multipleTable.clearSelection()
          }
        },
    // 表格单选事件
    select(selection, row) {
      let allRows = selection.filter(item => !!item)

      // 根据表格单选事件确定取消是取消了哪一行
      if (allRows.find(item => item.ztncpId == row.ztncpId)) {
        // 选中新增一行
        this.addRows([row])
      } else {
        // 取消删除一行
        this.removeRows([row])
      }
    },
    // 表格全选事件
    selectAll(selection) {
      // 如果有则是全选否则就是全取消
      if (selection.length > 1) {
        this.addRows(this.tableData)
      } else {
        this.removeRows(this.tableData)
      }
    },
        // 添加选中行
    addRows(rows) {
      for (let key of rows) {
        // 如果选中的数据中没有这条就添加进去
        console.log(!this.taskData.find(
            item => {item.ztncpId == key.ztncpId}
          ));
          
        if (
          !this.taskData.find(
            item => {item.ztncpId == key.ztncpId}
          )
        ) {
          this.taskData.push(key)
        }
      }
    },
    // 取消选中行
    removeRows(rows) {
      if (this.taskData.length > 0) {
        for (let row of rows) {
          this.taskData = this.taskData.filter(item => item.ztncpId != row.ztncpId)
        }
      }
    },
        handleSizeChange(pageSize){
          this.pageSize = pageSize;
          this.getTableData({pageSize,pageNo:this.pageNo});
        },
        handleCurrentChange(pageNo){
          this.pageNo = pageNo;
          this.getTableData({pageNo,pageSize:this.pageSize});
        },
        getTableData(obj={}){
          this.loading = true;
          let {sfky,ncpmc} = this;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            ncpmc:ncpmc,
			type:2,
            sfky:1
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_base.cpwh_list(params).then(res=>{
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
          this.$message.success('添加成功！')
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

