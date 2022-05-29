/*用户信息*/
<template>
   <div class="dkfzr">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input placeholder="请输入打印机名称" @keyup.enter.native=search v-model=findName class="input-with-select f-vab"  size="small">
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
        ref="stable"
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
                  {label:'设备名称',prop:'dyjmc',width:'120'},
                  {label:'型号',prop:'dyjxh',width:'150'},
                  {label:'打印纸宽',prop:'dyjzk'},
                  {label:'类型',prop:'dyjlx',width:'100','render-column':this.renderLx},
                  {label:'编号(SN)',prop:'dyjbh'},
                  {label:'密钥(KEY)',prop:'dyjmy'},
                  {label:'商户编码',prop:'shbm'},
                  {label:'SIM卡',prop:'sim'},
                  {label:'备注',prop:'bz'},
                  {label:'默认打印机',prop:'mrdyj',width:'100','render-column':this.renderState},
                  {label:'操作',prop:'mrdyj',width:'100','render-column':this.renderEdit}
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
         renderLx(h,row){
           return (<span>{row.dyjlx==1?'小票打印机':'标签打印机'}</span>)
         },
         renderState(h,row){
           return (<span class={row.mrdyj==1?'f-blue':''}>{row.mrdyj==1?'是':'否'}</span>)
         },
        renderEdit(h,row){
             return (
               <el-button size="mini" class="edit" onClick={()=>{this.$emit('edit',row)}}>编辑</el-button>
           )
        },
       /*render-column结束*/
      
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.yhxx_list  请求api
        *params请求参数
        */
        search(){
          this.$refs.stable.pageNo=1;
          this.getTableData();
        },
        getTableData(obj={}){
          this.loading = true;
          let params = {
            bizid:this.userInfo.bizId,
            key:this.findName,
            pageNo:this.currentPage
          };
          if(obj==true||obj==false){
            obj={
              pageSize:this.$refs.stable.pageSize
            }
          }
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_base.dyj_page(params).then(res=>{
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


