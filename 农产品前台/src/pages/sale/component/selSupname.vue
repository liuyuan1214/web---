/*地块负责人*/
<template>
   <div class="dkfzr" style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input placeholder="单位名称"  @keyup.enter.native=search v-model.trim=khmc class="input-with-select f-vab"  size="small">
          </el-input> 
          <el-button type="primary" size="small" style="padding:5px 15px" @click=search><i class="el-icon-search f-fs20"></i></el-button>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="supNameDialogVisable=true" round style="padding:9px 25px">新 增</el-button>
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
      title="新增往来单位"
      :append-to-body="true"
      :visible.sync="supNameDialogVisable"
      width="800px"
    >
      <add-sup  v-if="supNameDialogVisable" :khtype="khtype" :isSup="'01'" style="margin:0 auto;" @closeForm="supNameDialogVisable=false;search()"></add-sup>  
    </el-dialog> 
   </div>

</template>

<script>
      import { mapGetters } from 'vuex'
      import addSup from 'pages/base/parterInfo/component/edit.vue';
    export default {
        components:{
            addSup
        },
        data(){
            return {
                 khtype:[
                  {label:'销售商',value:'01'},
                  {label:'农资供应商',value:'02'},
                  {label:'检测机构',value:'03'},
                  {label:'农产品供应商',value:'04'},
                ],
                sfky:false,
                khlx:'',
                khmc:'',
                supNameDialogVisable:false,
                //table参数
                tableHeader:[
                  {label:'客户单位',prop:'khmc'},
                  {label:'客户简称',prop:'khjc'},
                  {label:'联系人',prop:'lxr'},
                  {label:'联系电话',prop:'lxdh'},
                  {label:'操作',prop:'sfky',width:'120','render-column':this.renderEdit}
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
                let {khId,sfky} = row;
                sfky=sfky==1?0:1;
                this.$fetch.api_base.kh_status({khId,sfky}).then(res=>{
                    row.sfky = sfky;
                })
              }
            }
          })
        },
        renderEdit(h,row){
          return (
            <el-button size="mini" class="edit"  onClick={()=>{this.$emit('selsup',row)}}>选择</el-button>
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
        getTableData(obj={}){
          this.loading = true;
          let {khmc} = this;
          let params = {
            qyid:this.userInfo.qyid,
            khmc:khmc,
            khlx:"01",
            sfky:1
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_base.kh_list(params).then(res=>{
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

