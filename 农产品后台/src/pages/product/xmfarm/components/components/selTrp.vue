/*提取投入品*/
<template>
   <div style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
           <label></label>
          <el-input placeholder="请输入投入品名称\生产单位" style="vertical-align:bottom"  @keyup.enter.native=getTableData v-model.trim=findName class="input-with-select"  size="small">
          </el-input> 
          <el-button type="primary" size="small"  style="padding:5px 15px;" @click=getTableData><i class="el-icon-search f-fs20"></i></el-button>
       </div>
      <!-- <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="isAddFzr=true" round style="padding:9px 25px">新 增</el-button>
      </div> -->
    </div> 
     <s-table
        v-loading=loading
        class="table"
         element-loading-text="拼命加载中"
        :tableData=tableData
        :totalCount=totalCount
        :getData=getTableData
        :tableHeader=tableHeader
     ></s-table>
    <!-- <el-dialog
      title="新增"
      :append-to-body="true"
      :visible.sync="isAddFzr"
      width="800px"
    >
      <add-fzr style="margin:0 auto;" v-if="isAddFzr"  @closeForm=closeForm></add-fzr>  
    </el-dialog> -->
   
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
	import fetch from 'fetch/axios/';
	//   import addFzr  from './addFzr.vue';
    export default {
        components:{
        //   addFzr
        },
        data(){
            return {
                findName:'',
                zldm:'',
                sf:'sf',
                zldms:[],
                ejs:[],
                //table参数
                tableHeader:[
                  {label:'肥料名称',prop:'trpmc'},
                  {label:'规格',prop:'ggxh'},
                  {label:'单位',prop:'dw'},
                  {label:'生产单位',prop:'scdw'},
                  {label:'操作',width:'120','render-column':(h,row)=>{
                     return (
                           <el-button size="mini" class="edit"  onClick={()=>{this.$emit('selTrp',row)}}>选择</el-button>
                        )
                  }}
                ],
                loading:false,
                totalCount:1,
                tableData: [],
                isAddFzr:false
            }
        },
		props:{
             type:{
             type:String,
             default:''
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
        getTableData(obj={}){
          this.loading = true;
          let {scjyztId,hy,type} = this;
          var params =  {
      hy:this.userInfo.hy,
         trpmc:this.findName,
		  type,
          scjyztId:this.userInfo.scjyztId,};
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
		  	fetch({
            url:'/JcTrpWh/pageZttrp/',
            method:'get',
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
          this.$fetch.api_base.cpwh_ncplist(params).then(res=>{
            let {data,pageNo,totalCount} = res.list;
            this.tableData = data;
            this.totalCount = totalCount;
            this.currentPage = pageNo;
            this.loading = false;
          }).catch(()=>{
            this.loading = false;
          })
        },
        closeForm(isRefresh){
            this.isAddFzr = !this.isAddFzr;
            if(isRefresh){
              //更新table的数据
              this.getTableData();
            }  
        },
        getTypes(typeText){
          var params={
            sjzdLxbm:typeText,
            industryId:this.userInfo.industryId   
          }
          if(typeText==='NCPEJFL'){
            params.zldm=this.zldm;
          }
         
          this.$fetch.api_base.cpwh_type(params).then(res=>{
             this[typeText==='NCPLX'?'zldms':'ejs']= res.list;
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

<style>
/* .table .el-button:hover{
  background:#ecf5ff;
  color:#60acff;
  border:1px solid #60acff;
} */
</style>


