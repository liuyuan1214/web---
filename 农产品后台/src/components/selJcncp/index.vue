/*产品维护所属类别选择*/
<template>
   <div style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-select v-model.trim="zldm" size="small" class="f-vab f-mr20" style="width:150px;" placeholder="请选择大类"   @change="getTableData;getTypes('NCPEJFL')">
            <el-option
              v-for="item in zldms"
              :key="item.sjzdBm"
              :label="item.sjzdMc"
              :value="item.sjzdBm">
            </el-option>
         </el-select>
          <el-select v-model.trim="ej" size="small"   class="f-vab f-mr20" style="width:150px;" placeholder="请选择小类"  @change=getTableData({pageSize:10,pageNo:1})>
            <el-option
              v-for="item in ejs"
              :key="item.sjzdBm"
              :label="item.sjzdMc"
              :value="item.sjzdBm">
            </el-option>
         </el-select>
          <el-input placeholder="输入农产品名称" style="vertical-align:bottom"  @keyup.enter.native=getTableData v-model.trim=ncpmc class="input-with-select"  size="small">
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
        ref="stable"
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
	//   import addFzr  from './addFzr.vue';
    export default {
        components:{
        //   addFzr
        },
        data(){
            return {
                ncpmc:'',
                zldm:'',
                ej:'',
                zldms:[],
                ejs:[],
                //table参数
                tableHeader:[
				  {label:'农产品',prop:'ncpMc'},
                  {label:'大类',prop:'ncpZlmc'},
                  {label:'小类',prop:'ncpEjZlmc'},
                  {label:'农产品代码',prop:'ncpDm'},
                  {label:'操作',width:'120','render-column':(h,row)=>{
                     return (
                           <el-button size="mini" class="edit"  onClick={()=>{this.$emit('selJcncp',row)}}>选择</el-button>
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
          this.getTypes('NCPLX');
        },
       methods:{  
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        getTableData(obj={}){
          this.loading = true;
          let {ncpmc,zldm,ej} = this;
          var params =  {
            industryId:this.userInfo.industryId,
            ncpmc:ncpmc,
		      	nyVersion:this.userInfo.nyVersion,
            zldm:zldm,
            ej:ej,
            scjyztId:0};
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
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
              this.$refs.stable.getDataByPage();
            }  
        },
        getTypes(typeText){
          var params={
            sjzdLxbm:typeText,
            industryId:this.userInfo.industryId,
            nyVersion:this.userInfo.nyVersion,		
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


