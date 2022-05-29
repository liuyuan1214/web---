/*委托检测报告*/
<template>
  <div style="padding-bottom:70px;min-height:470px;">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <label>日期</label>
        <date-picker @selChange="(val)=>{selDateRange=val}"></date-picker>
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
      :tableHeader=tableHeader
    ></s-table>
    <el-dialog
      title="关联批次"
      width="900px"
      :visible.sync="glpcDialogVisable"
      :append-to-body="true"
      @close="closeForm()"
    >
      <v-glpc :sampleType="yply" :selId="selId" @closeAllForm="closeAllForm"></v-glpc>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { timeFormat } from 'common/tools'
  import fetch from 'fetch/axios/';
  import vGlpc from './glpc.vue';
  export default {
    components:{
      vGlpc
    },
    props: {
      yply: {
        type: String,
        default:''
      },
    },
    data(){
      return {
        selDateRange:null,   //清空日期 是参数设置为null
        glpcDialogVisable:false,
        selId:'',
        //table参数
        tableHeader:[
          {label:'报告时间',prop:'sjsj',width:'200',},
          {label:'样品编号',prop:'sampNo',width:'150',},
          {label:'样品名称',prop:'sampName'},
          {label:'检测机构',prop:'jcgs',width:'250'},
          {label:'类型',prop:'jclx',formatter:(val)=>{return val==1?'农产品检测':'环境检测'}},
          {label:'操作',prop:'sfky',width:'200','render-column':this.renderEdit}
        ],
        loading:false,
        totalCount:1,
        tableData: [],
      }
    },
    computed:{
      ...mapGetters({
        userInfo:'getUserInfo',
      })
    },
    created(){
      setTimeout(()=>{
        this.getTableData();
      },100)
    },
    methods:{
      /*render-column开始*/
      renderEdit(h,row){
        return (
          <el-button size="mini" type="info" plain onClick={()=>{
            this.glpcDialogVisable=true;
            this.selId=row.id;
            }}>关联批次</el-button>
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
        this.$refs.stable.getDataByPage();
      },
      getTableData(obj={pageSize:10,pageNo:1}){
        this.loading = true;
        let {selDateRange} = this;
        let params = {
          qyid:this.userInfo.qyid,
          startDate:selDateRange? selDateRange[0]:'',
          endDate:selDateRange? selDateRange[1]:''
        };
        //合并组件的pageSize 和 pageNo 参数
        Object.assign(params,obj);
        fetch({
          url:'/lcjc/pageLcjxZcb/',
          method:'post',
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
      },
      closeForm(){
        this.glpcDialogVisable = false;
      },
      closeAllForm(){
        this.glpcDialogVisable = false;
        this.$emit("closeForm");
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

