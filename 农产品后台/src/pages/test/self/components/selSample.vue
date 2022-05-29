/*产品维护所属类别选择*/
<template>
   <div style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input :placeholder="sampleType==1?'农产品名称\\地块名称\\种植批次号':'样品名称\\供货商名称\\批次号'" style="vertical-align:bottom"  @keyup.enter.native=getTableData v-model.trim=searchkey class="input-with-select"  size="small">
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
        :tableHeader="sampleType==1?tableHeader:tableHeader1"
     ></s-table>
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios/'
    export default {
        props:{
            sampleType:{
              type:[Number,String],
              default:1
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
                  {label:'起批日期',prop:'qprq'},
                  {label:'样品名称',prop:'ztncpmc'},
                  {label:'地块',prop:'cdmc'},
                  {label:'批次号',prop:'zzpc'},
                  {label:'操作',width:'120','render-column':(h,row)=>{
                     return (
                           <el-button size="mini" class="edit"  onClick={()=>{this.$emit('selSample',row)}}>选择</el-button>
                        )
                  }}
                ],
                tableHeader1:[
                  {label:'采购日期',prop:'purchDate',width:'120'},
                  {label:'样品名称',prop:'wareName'},
                  {label:'供货商名称',prop:'supName'},
                  {label:'批次号',prop:'batchno',width:'230'},
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
        watch:{
          sampleType(newVal){
            this.getTableData();
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
        getTableData(obj={pageSize:10,pageNo:1}){
          this.loading = true;
           let {searchkey} = this;
          var params =  {
            searchkey
          };
          if(this.sampleType==1){
            params.scjyztId = this.userInfo.scjyztId;
          }else{
            params.companyId = this.userInfo.scjyztId;
          }
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          var query = {
            method:'get',
            url:this.sampleType==1?'/scgl/ns/pageZzjl/':'/cggl/cg/pagePurchDetail/',
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



