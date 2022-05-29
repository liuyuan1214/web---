/*地块负责人*/
<template>
   <div class="dkfzr">
     <!-- 搜索头部 -->
       <page-name v-model="isEdit"></page-name>
     <div class="header f-df f-pr20">
       <div>
          <label>日期</label>
          <date-picker style="vertical-align:bottom" @selChange="(val)=>{selDateRange=val}"></date-picker> 
          <label class="f-lh32">类型</label>
              <el-select style="vertical-align:bottom" v-model.trim="lx" size="small" class="f-vab w120p" placeholder="请选择" @change="search">
                <el-option
                  v-for="item in lxlists"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
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
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { timeFormat } from 'common/tools'  
        import fetch from 'fetch/axios/'

    export default {
        name:'countSale',
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
                lx:'1',
                selDateRange:null,   //清空销售日期 是参数设置为null
                //table参数
                tableHeader:[
                  {label:'排名',width:'100',prop:'xsrq','render-column':(h,row,index)=>{return Number(this.pageSize)*Number(this.currentPage - 1) + Number(index) + 1}},
                  {label:'农产品名称/销售商名称',prop:'ncpmc',width:'500','render-column':(h,row,index)=>{return row.ncpmc || row.khmc}},
                  {label:'销售金额(元)',prop:'xsje'},
                  {label:'销售量',prop:'xsl'},
                  {label:'销售次数',prop:'xscs'}
                ],
                lxlists:[
                    {label:'按农产品',value:'1'},
                    {label:'按销售商',value:'2'}
                ],
                loading:false,
                isEdit:false,
                currentPage:1,
                pageSize:10,
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
          this.getTableData();
        },
       methods:{
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
          let {selDateRange,lx} = this;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            type:lx,
			qyid:this.userInfo.qyid,
            startDate:selDateRange? selDateRange[0]:'',
            endDate:selDateRange? selDateRange[1]:''
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
            var query = {
                method:'get',
                url:'/Xsd/xs/xsphOrder/',
                data:params
            }
          fetch(query).then(res=>{
            let {data,pageNo,totalCount,pageSize} = res.list;
            this.tableData = data;
            this.totalCount = totalCount;
            this.currentPage = pageNo;
            this.pageSize = pageSize;
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

