/*产品维护所属类别选择*/
<template>
   <div style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <!--<div class="header f-df f-pr20">-->
       <!--<div>-->
          <!--<el-input :placeholder="sampleType==1?'商品名称':'商品名称'" style="vertical-align:bottom"  @keyup.enter.native=getTableData v-model.trim=searchkey class="input-with-select"  size="small">-->
          <!--</el-input> -->
          <!--<el-button type="primary" size="small"  style="padding:5px 15px;" @click=search><i class="el-icon-search f-fs20"></i></el-button>-->
       <!--</div>-->
    <!--</div> -->
     <s-table
        v-loading=loading
        class="table"
        ref="stable"
         element-loading-text="拼命加载中"
        :tableData=tableData
        :totalCount=totalCount
        :getData=getTableData
        :tableHeader="getTableHeader()"
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
            },
        },
        data(){
            return {
                //table参数
              tableHeader1:[
                {label:'起批日期',prop:'packDate',width:'150'},
                {label:'农产品名称',prop:'ncpMc'},
                {label:'批次',prop:'zzpc'},
                {label:'操作',width:'120','render-column':(h,row)=>{
                    return (
                      <el-button size="mini" class="edit"  onClick={()=>{this.$emit('selSample',row)}}>选择</el-button>
                  )
                  }}
              ],
                tableHeader2:[
                  {label:'采收日期',prop:'csrq',width:'150'},
                  {label:'农产品名称',prop:'csncpmc'},
                  {label:'批次',prop:'zzpc'},
                  {label:'操作',width:'120','render-column':(h,row)=>{
                      return (
                        <el-button size="mini" class="edit"  onClick={()=>{this.$emit('selSample',row)}}>选择</el-button>
                    )
                    }}
                ],
                tableHeader3:[
                  {label:'采购日期',prop:'purchDate',width:'150'},
                  {label:'农产品名称',prop:'wareName'},
                  {label:'批次',prop:'batchno'},
                  {label:'操作',width:'120','render-column':(h,row)=>{
                      return (
                        <el-button size="mini" class="edit"  onClick={()=>{this.$emit('selSample',row)}}>选择</el-button>
                    )
                    }}
                ],
              tableHeader4:[
                {label:'包装日期',prop:'packDate',width:'120'},
                {label:'农产品名称',prop:'ncpMc'},
                {label:'批次',prop:'zzpc'},
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
          console.log(this.sampleType)
          this.getTableData();
        },
       methods:{  
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
       // getTableHeader(){
       //  if(this.userInfo.nyVersion==5 && !this.isCs && this.sampleType==2 ){
       //    return this.tableHeader3;
       //  }else{
       //    if(this.sampleType==1){
       //      return this.isCs?this.tableHeader:this.tableHeader0;
       //    }else{
       //      return this.isCs?this.tableHeader2:this.tableHeader1;
       //    }
       //  }
       // },
        search(){
          this.$refs.pageNo=1;
          this.$refs.stable.getTableData();
        },
         getTableHeader(){
           if(this.sampleType=='1'){
             return this.tableHeader1;
           }else if(this.sampleType=='2'){
             return this.tableHeader2;
           }else if(this.sampleType=='3'){
             return this.tableHeader3;
           }else{
             return this.tableHeader4;
           }
         },
        getTableData(obj={pageSize:10,pageNo:1}){
          this.loading = true;

          //合并组件的pageSize 和 pageNo 参数
          // if(this.isCs){
          //    var  url=this.sampleType==1?'/Bzgm/gm/pagePackRecordOut/':'/cggl/cg/pagePurchDetail/';
          // }else{
          //   if(this.sampleType==2 && this.userInfo.nyVersion==5){
          //     var  url='/scgl/ns/pageNsczFmYm/'
          //   }else{
          //     var  url=this.sampleType==1?'/Bzgm/pagePackRecord/':'/scgl/ns/pageCsjl/';
          //   }
          // }

          if(this.sampleType == '1'){
            var url='/Bzgm/pagePackRecord/';
            var params =  {
              scjyztId:this.userInfo.scjyztId,
              lx:this.userInfo.nyVersion==5?2:1
            };
          }else if(this.sampleType == '2'){
            var url='/scgl/ns/pageCsjl/';
            var params =  {
              scjyztId:this.userInfo.scjyztId,
            };
          }else if(this.sampleType == '3'){
            var url='/cggl/cg/pagePurchDetail/';
            var params =  {
              companyId:this.userInfo.scjyztId,
            };
          }else{
            var url='/Bzgm/gm/pagePackRecordOut/';
            var params =  {
              scjyztId:this.userInfo.scjyztId,
            };
          }
          Object.assign(params,obj);

          var query = {
            method:'get',
            url:url,
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



