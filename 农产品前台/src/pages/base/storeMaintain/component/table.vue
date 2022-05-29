/*店铺维护*/
<template>
   <div class="dpwh">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input placeholder="商铺名称"  @keyup.enter.native=search v-model.trim=findName class="input-with-select f-vab"  size="small">
          </el-input> 
          <el-button type="primary" size="small" style="padding:5px 15px" @click=search><i class="el-icon-search f-fs20"></i></el-button>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="$emit('edit')" round style="padding:9px 25px">新 增</el-button>
      </div>
    </div> 
     <s-table
        v-loading=loading
        class="table"
        ref='stable'
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
                findName:'',
                //table参数
                tableHeader:[
                  {label:'商铺图片',prop:'logoImg',"render-column":this.renderImg,width:'130'},
                  {label:'商铺名称',prop:'scMc'},
                  {label:'商铺类型',prop:'type',formatter:(val)=>{ 
                      return this.dptype[val-1];
                  }},
                  {label:'商铺网址',prop:'scDz'},
                  {label:'操作',prop:'sfky',width:'200','render-column':this.renderEdit}
                ],
                dptype:['京东','淘宝','天猫','微商城','小程序商城'],
                loading:false,
                pageSize:10,
                currentPage:1,
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
        renderEdit(h,row){
          return (
            <div>
                <el-button size="mini" class="edit" onClick={()=>{this.$emit('edit',row)}}>编辑</el-button>
                <el-button size="mini" type="danger" onClick={()=>{
                    this.$confirm("此操作将删除该条店铺维护信息, 是否继续?", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      cancelButtonClass:'is-round',
                      confirmButtonClass:'is-round',
                      type: "warning"
                    }).then(() => {
                      this.$fetch.api_base.dpwh_delete({id:row.id}).then(res=>{
                      this.$message.success('删除成功');
                      this.$refs.stable.getDataByPage();
                      }).catch(res=>{
                      this.$message.success(res.errorMess);  
                      }) 
                    }).catch(() => {});
                }}>删除</el-button>   
            </div>
          )
        },
        renderImg(h,row){
            if(row.logoImg){
              return (<img class="logoImg"  src={row.logoImg}></img>)
            }else{
              return  (<img class="logoImg"  src="./static/noimg.png"></img>)
            }
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
          let {findName} = this;
          let params = {
            qyId:this.userInfo.qyid,
            findName:findName
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_base.dpwh_list(params).then(res=>{
            let {data,pageNo,totalCount,pageSize} = res.list;
            this.tableData = data;
            this.pageSize= pageSize
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
   .logoImg{
       width:80px;
       height:80px;
       border-radius:5px;
   }
</style>

<style lang="scss">
  .dpwh .logoImg{
       width:80px;
       height:80px;
       border-radius:5px;
   }
</style>
