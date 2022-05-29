/*产品维护所属类别选择*/
<template>
   <div style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input :placeholder="'商品名称'" style="vertical-align:bottom"  @keyup.enter.native=getTableData v-model.trim=searchkey class="input-with-select"  size="small">
          </el-input> 
          <el-button type="primary" size="small"  style="padding:5px 15px;" @click=getTableData><i class="el-icon-search f-fs20"></i></el-button>
       </div>
    </div> 
     <s-table
        v-loading=loading
        class="table"
         element-loading-text="拼命加载中"
        :tableData=tableData
        :totalCount=totalCount
        :getData=getTableData
        :tableHeader="tableHeader"
     ></s-table>
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios/'
    export default {
        props:{
            ncpdm:{
              type:[Number,String],
              default:''
            },
            ly:{
              type:String,
              default:"1"
            }
        },
        data(){
            return {
                ncpmc:'',
                zldm:'',
                ej:'',
                searchkey:'',
                zldms:[],
                ejs:[],
                //table参数
                tableHeader:[
                  {label:'入库日期',prop:'rkrq'},
                  {label:'农产品名称',prop:'ncpmc'},
                  {label:'余量',prop:'yl'},
                  {label:'单位',prop:'dw'},
                  {label:'批次号',prop:'xgpc',width:'200'},
                  {label:'操作',width:'120','render-column':(h,row)=>{
                     return (
                           <el-button size="mini" class="edit"  onClick={()=>{this.$emit('selSample',row)}}>选择</el-button>
                        )
                  }}
                ],
                loading:false,
                totalCount:1,
                tableData: [],
                isAddFzr:false
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
        watch:{
          ncpdm(){
            this.getTableData();
          }
        },
       methods:{  
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        getTableData(obj={pageSize:10,pageNo:1}){
          this.loading = true;
           let {searchkey,ncpdm,ly,lx} = this;
           if(ly==1 && this.userInfo.nyVersion==5){
             lx=4;
           }  
           var params =  {
            scjyztId:this.userInfo.scjyztId,
            findName:searchkey,  
            ncpdm,
            ly:ly,
            lx:lx?lx:ly,
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          var query = {
            method:'get',
            url:'/Bzgm/getTabNcpPckcbByNcpdm/',
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



