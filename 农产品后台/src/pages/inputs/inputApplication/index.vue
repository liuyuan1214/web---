
<template>
   <div>
    <el-tabs v-model="activeName" >
    <el-tab-pane label="培育记录" name="first">
    <div class="f-mt20">
      <el-table   
       class="table"    
      :data="tableData1"
      ref="table"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%">
      <el-table-column
        prop="operator"
        width="150"
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="operateName"
         width="180"
        label="操作名称">
      </el-table-column>
      <el-table-column
        prop="operateTime"
        width="180"
        label="操作时间">
        <template slot-scope="scope">
        <span>{{ scope.row.operateTime|formateDate }}</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="operateImgUrl"
        width="280"
        label="操作附图">
        <template slot-scope="scope">
        <img>{{ scope.row.operateImgUrl }}</img>
      </template>
      </el-table-column>
      <el-table-column
        prop="comment"
        width="150"
        label="备注">
      </el-table-column>
    </el-table>
    </div> 

    </el-tab-pane>
    <el-tab-pane label="生产包装记录" name="second">

        <div class="f-mt20">
      <el-table   
       class="table"    
      :data="tableData2"
      ref="table"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%">
            <el-table-column
        prop="operator"
        width="150"
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="operateName"
         width="180"
        label="操作名称">
      </el-table-column>
      <el-table-column
        prop="operateTime"
        width="180"
        label="操作时间">
        <template slot-scope="scope">
        <span>{{ scope.row.operateTime|formateDate }}</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="operateImgUrl"
        width="280"
        label="操作附图">
        <template slot-scope="scope">
        <img>{{ scope.row.operateImgUrl }}</img>
      </template>
      </el-table-column>
      <el-table-column
        prop="comment"
        width="150"
        label="备注">
      </el-table-column>
    </el-table>
    </div> 
    </el-tab-pane>
    <el-tab-pane label="质检记录" name="third">

        <div class="f-mt20">
      <el-table   
       class="table"    
      :data="tableData3"
      ref="table"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%">
           <el-table-column
        prop="inspector"
        width="150"
        label="质检人">
      </el-table-column>
      <el-table-column
        prop="inspectTime"
         width="180"
        label="质检时间">
        <template slot-scope="scope">
        <span>{{ scope.row.inspectTime|formateDate }}</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="inspectScore"
        width="180"
        label="质检分数">
        <template slot-scope="scope">
        <span>{{ scope.row.inspectScore }}分</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="pass"
        width="280"
        label="质检是否通过">
        <template slot-scope="scope">
          
        <span>{{ getName(options, scope.row.pass) }}</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="comment"
        width="150"
        label="备注">
      </el-table-column>
    </el-table>
    </div> 

    </el-tab-pane>
    <el-tab-pane label="物流记录" name="fourth">

        <div class="f-mt20">
      <el-table   
       class="table"    
      :data="tableData4"
      ref="table"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%">
      <el-table-column
        prop="logisticsOrderNo"
        width="150"
        label="物流单号">
      </el-table-column>
      <el-table-column
        prop="logisticsCompanyName"
         width="180"
        label="物流公司">
      </el-table-column>
    </el-table>
    </div> 
    </el-tab-pane>
  </el-tabs>
   </div>
</template>

<script>
	import vEdit  from './component/edit.vue';
	import vTable from './component/table';
     import timeFormat from 'common/tools/timeFormat';
    export default {
        name:'inputApplication',        
        components:{
            vEdit,
            vTable
        },
        filters: {
  formateDate (time) {
    let date = new Date(time)
    return timeFormat.format(date, 'yyyy-MM-dd HH:mm:ss')
  }
},

        mounted(){
             let { id } = this.$route.query
             console.log(id,"地块名称")
             var params ={
               "blockId":id.id
             }
             this.$fetch.api_base.ProductBlockInfo(params).then((res1)=>{
              
            let {data} =res1
            this.tableData1 = data.cultivation;
            this.tableData2 = data.process;
            this.tableData3 = data.qualityCheck;
            console.log(data.qualityCheck,"质检记录")
            this.tableData4 = data.logistics;
          
            }).catch(()=>{
             
               
            })
        },
        data(){
            return {
              loading:false,
              options:[
                {
            value: true,
            label: '是',
          },
          {
            value: false,
            label: '否',
          }],
     
                tableData1:[],
                tableData2:[],
                tableData3:[],
                tableData4:[],
                activeName: 'second',
               isEdit:false,   // 判断显示table 还是 编辑弹框
               editId:'',
               khtype:[
                  {label:'销售商',value:'01'},
                  {label:'农资供应商',value:'02'},
                  {label:'农产品供应商',value:'04'},
                ],
               editRow: {
                    nhId: '',
                    nhxm: '',
                    sfzh:'',
                    xb:'1',
                    dz: '',
                    bz: '',
                    lxdh: '',
                    sfky:1
                   }
            }
        },
       methods:{
             // 处理数据
      getName(data, value) {
        return data.filter((item) => item.value === value)[0].label
      },
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
   .editFzr{
       margin-left:150px;
   }
</style>



