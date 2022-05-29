/*产品维护所属类别选择*/
<template>
   <div style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-select v-model.trim="zldm" size="small" class="f-vab f-mr20" style="width:150px;" placeholder="请选择类别"   @change="lb='';getTypes('xiaolei')">
            <el-option
              v-for="item in zldms"
              :key="item.sjzdBm"
              :label="item.sjzdMc"
              :value="item.sjzdBm">
            </el-option>
         </el-select>
          <!-- <el-select v-model.trim="lb" size="small"   class="f-vab f-mr20" style="width:150px;" placeholder="请选择农资类别"  @change=search>
            <el-option
              v-for="item in ejs"
              :key="item.sjzdBm"
              :label="item.sjzdMc"
              :value="item.sjzdBm">
            </el-option>
         </el-select> -->
          <el-input placeholder="请输入投入品名称\生产单位" style="vertical-align:bottom"  @keyup.enter.native=search v-model.trim=findName class="input-with-select"  size="small">
          </el-input> 
          <el-button type="primary" size="small"  style="padding:5px 15px;" @click=search><i class="el-icon-search f-fs20"></i></el-button>
       </div>
      <!--<div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="isAdd=true" round style="padding:9px 25px">申 请</el-button>
      </div>-->
    </div> 
     <s-table
        v-loading=loading
        class="table"
        ref="stable"
         :element-loading-text="hasSel?'提取中':'拼命加载中'"
        :tableData=tableData
        :totalCount=totalCount
        :getData=getTableData
        :tableHeader=tableHeader
     ></s-table>
    <el-dialog
      title="新增投入品申请信息"
      :append-to-body="true"
      :visible.sync="isAdd"
      width="800px"
    >
      <add style="margin:0 auto;" v-if="isAdd"  @closeForm=closeForm></add>  
    </el-dialog>
   
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
      import add  from './add.vue';
    import fetch from 'fetch/axios/'
    export default {
        components:{
          add
        },
        data(){
            return {
                hasSel:false,
                findName:'',
                zldm:'',
                lb:'',
                zldms:[],
                ejs:[],
                //table参数
                tableHeader:[
                  {label:'投入品名称',prop:'agriProdName'},
                  {label:'规格型号',prop:'model'},
                  {label:'单位',prop:'unit'},
                  {label:'生产单位',prop:'scdw'},
                  {label:'操作',width:'120','render-column':(h,row)=>{
                     return (
                           <el-button size="mini" class="edit"  onClick={this.funSelect.bind(this,row)}>添加</el-button>
                        )
                  }}
                ],
                loading:false,
                totalCount:1,
                tableData: [],
                isAdd:false
            }
        },
        computed:{
          ...mapGetters({
              userInfo:'getUserInfo',
          })
        },  
        created(){
          this.getTableData();
          this.getTypes('dalei');
        },
       methods:{  
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        getTableData(obj={}){
          this.loading = true;
          let {findName,lb} = this;
          let {scjyztId,qyid,hydm,areaCode} = this.userInfo;
          var params =  {
            findName,
            areaCode, 
            scjyztId,
            hydm, 
            lb,
            type:this.zldm
          };
          //  console.log(params)
          // return;
          Object.assign(params,obj);
          //合并组件的pageSize 和 pageNo 参数
          var query = {
            method:'get',
            url:'/JcTrpWh/pageNcpUnTqAgri/',
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
        },
        //提取农产品
        funSelect(row){
          this.hasSel = true;
          var query = {
            method:'post',
            url:'/JcTrpWh/saveZttrp/',
            data:{
              trpIds:row.agriProdId,
              scjyztId:this.userInfo.scjyztId
            }  
          }
          fetch(query).then(res=>{
            this.$message.success('提取成功！')
            this.$emit('close',true)
            this.hasSel = false;
          }).catch(()=>{
            this.$message.error('提取失败，请联系管理员！')
            this.hasSel = false;
          }) 
        },
        search(){
          this.$refs.stable.pageNo=1;
          this.$refs.stable.getDataByPage();
        },
        closeForm(isRefresh){
            this.isAdd = !this.isAdd;
            if(isRefresh){
              //更新table的数据
              this.$refs.stable.getDataByPage();
            }  
        },
        getTypes(typeText){
          var params={
            sjzdLxbm:'TRPLX'
          }
          if(typeText==='dalei'){
            params.hy=this.userInfo.hydm;
          }else{
            params.zldm=this.zldm;
          }
          this.$fetch.api_base.cpwh_type(params).then(res=>{
             this[typeText==='dalei'?'zldms':'ejs']= res.list;
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


