/*地块负责人*/
<template>
   <div class="dkfzr">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input placeholder="请输入账号名称\用户姓名手机号码" @keyup.enter.native=getTableData v-model.trim=searchkey class="input-with-select f-vab"  size="small">
          </el-input> 
          <el-button type="primary" size="small" style="padding:5px 15px" @click=getTableData><i class="el-icon-search f-fs20"></i></el-button>
          <el-checkbox v-model.trim=sfky class="f-ml20"  @change=getTableData>不显示停用的用户</el-checkbox>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="$emit('edit')" round style="padding:9px 25px">新 增</el-button>
      </div>
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
   </div>
</template>

<script>
	  import { mapGetters } from 'vuex'
    export default {
        data(){
            return {
                sfky:false,
                searchkey:'',
                //table参数
                tableHeader:[
                  {label:'账户名称',prop:'username'},
                  {label:'用户姓名',prop:'yhxm'},
                  {label:'手机号码',prop:'sjhm'},
                  {label:'身份证号码',prop:'sfzh'},
                  {label:'性别',prop:'xb',width:'100',formatter:(val)=>{ return val == 1 ? '男' : '女' }},
                  {label:'备注',prop:'bz'},
                  {label:'状态',prop:'sfky',width:'100','render-column':this.renderState},
                  {label:'启用',prop:'sfky',width:'100','render-column':this.renderSfkyBtn},
                  {label:'操作',prop:'sfky',width:'100','render-column':this.renderEdit}
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
          this.getTableData();
        },
       methods:{
       /*render-column开始*/
        renderState(h,row){
          return (<span class={row.sfky==1?'':'f-red'}>{row.sfky==1?'可用':'停用'}</span>)
        },
        renderSfkyBtn(h,row){
          return  h('el-switch',{
            attrs:{
              value:row.sfky==1?true:false,
              activeColor:"#090"
            },
            on:{
              change:(value)=>{
                let {ztyhId,sfky} = row;
                sfky=sfky==1?0:1;
                this.$fetch.api_user.user_status({ztyhId,sfky}).then(res=>{
                    row.sfky = sfky;
                })
              }
            }
          })
        },
        renderEdit(h,row){
          return (
            <el-button size="mini" class="edit"  onClick={()=>{this.$emit('edit',row)}}>编辑</el-button>
          )
        },
       /*render-column结束*/
      
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        getTableData(obj={}){
          this.loading = true;
          let {qyid,sfky,searchkey} = this;
          let params = {
            qyid:this.userInfo.qyid,
            searchkey
          };
          if(sfky) params.sfky=1;
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_user.user_list(params).then(res=>{
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
<style>
/* .table .el-button:hover{
  background:#ecf5ff;
  color:#60acff;
  border:1px solid #60acff;
} */
</style>

