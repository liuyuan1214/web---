/*地块负责人*/
<template>
   <div class="dkfzr">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <label>销售日期</label>
          <date-picker style="vertical-align:bottom" @selChange="(val)=>{selDateRange=val}"></date-picker> 
          <el-input style="vertical-align:bottom" placeholder="请输入订单编号/供应商名称"  @keyup.enter.native=search v-model.trim=searchKey class="input-with-select f-vab"  size="small">
          </el-input> 
          <el-button type="primary" size="small" style="padding:5px 15px" @click=search><i class="el-icon-search f-fs20"></i></el-button>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="$emit('edit')" round style="padding:9px 25px">新 增</el-button>
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
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { timeFormat } from 'common/tools'  
        import fetch from 'fetch/axios/'

    export default {
        props:{
            khtype:{
              type:Array,
              default:()=>{
                return []
              }
            }
        },
        data(){
            return {
                khlx:'',
                searchKey:'',
                selDateRange:null,   //清空销售日期 是参数设置为null
                //table参数
                tableHeader:[
                  {label:'销售日期',prop:'xsrq',width:'150'},
                  {label:'订单号',prop:'xsdh',width:'200'},
                  {label:'客户单位',prop:'khmc'},
                  {label:'订单总价（元）',prop:'zje',width:'150'},
                  {label:'制单人',prop:'zdr',width:'200'},
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
          // this.getTableData();
        },
       methods:{
       /*render-column开始*/
        renderEdit(h,row){
          return (
            <el-button size="mini" type="info" plain  onClick={()=>{this.$emit('edit',row)}}>编辑</el-button>
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
        getTableData(obj={pageSize:10,pageNum:1}){
          this.loading = true;
          let {searchKey,selDateRange} = this;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            findName:searchKey,
            startDate:selDateRange? selDateRange[0]:'',
            endDate:selDateRange? selDateRange[1]:''
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
            var query = {
                method:'get',
                url:'/Xsd/xs/pageXsdNew/',
                data:params
            }
          fetch(query).then(res=>{
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

