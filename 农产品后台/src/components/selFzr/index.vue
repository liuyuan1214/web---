/*地块负责人*/
<template>
   <div style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input placeholder="请输入负责人姓名\手机号码码\身份证" style="vertical-align:bottom"  @keyup.enter.native=getTableData v-model.trim=findName class="input-with-select"  size="small">
          </el-input> 
          <el-button type="primary" size="small"  style="padding:5px 15px;" @click=getTableData><i class="el-icon-search f-fs20"></i></el-button>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="isAddFzr=true" round style="padding:9px 25px">新 增</el-button>
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
      title="新增负责人"
      :append-to-body="true"
      :visible.sync="isAddFzr"
      width="800px"
    >
      <add-fzr style="margin:0 auto;" v-if="isAddFzr"  @closeForm=closeForm></add-fzr>  
    </el-dialog>
   
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
	  import addFzr  from './addFzr.vue';
    export default {
        components:{
          addFzr
        },
        data(){
            return {
                sfky:false,
                findName:'',
                //table参数
                tableHeader:[
                  {label:'负责人姓名',prop:'nhxm'},
                  {label:'手机号码',prop:'lxdh'},
                  {label:'身份证号',prop:'sfzh'},
                  {label:'备注',prop:'bz'},
                  {label:'操作',width:'120','render-column':(h,row)=>{
                     return (
                           <el-button size="mini" class="edit" onClick={()=>{this.$emit('selfzr',row)}}>选择</el-button>
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
          setTimeout(()=>{
               this.getTableData();
          },100)
         
        },
       methods:{  
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        getTableData(obj={}){
          this.loading = true;
          let {qyid,sfky,findName} = this;
          let params = {
            qyid:this.userInfo.qyid,
			      sfky:1,
            findName
          };
          if(sfky) params.sfky=1;
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_base.dkfzr_list(params).then(res=>{
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
              setTimeout(()=>{
                  this.$refs.stable.getDataByPage();
              },100)
             
            }  
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

</style>


