/*地块负责人*/
<template>
   <div class="dkfzr">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <label>日期</label>
          <date-picker @selChange="(val)=>{selDateRange=val}" style="vertical-align:bottom"></date-picker> 
          <label>数据来源</label>
          <el-select  v-model.trim="sjly" size="small"   class=" f-mr20 f-vab" placeholder="请选择"  style="vertical-align:bottom" @change=search>
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="手工输入"></el-option>
            <el-option value="2" label="设备提取"></el-option>
         </el-select>
          <label>样品来源</label>
          <el-select v-model.trim="jclx" size="small" class="f-mr20 f-vab" placeholder="请选择" style="vertical-align:bottom"  @change=search>
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="基地生产"></el-option>
            <el-option value="2" label="外来采购"></el-option>
         </el-select>
          <el-input  placeholder="请输入样品名称" clearable  @keyup.enter.native=search  style="vertical-align:bottom" v-model.trim=searchkey class=" input-with-select f-vab"  size="small">
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
    import fetch from 'fetch/axios/'
    import selSample from './selSample.vue'
    export default {
        components:{
          selSample
        },
        data(){
            return {
                sfky:false,
                searchkey:'',
                sjly:'',
                jclx:'',
                selDateRange:null,
                //table参数
                tableHeader:[
                  {label:'检测日期',prop:'czsj',width:150},
                  {label:'样品名称',prop:'ncpmc'},
                  {label:'检测项目',prop:'jcxm'},
                  {label:'检测类型',prop:'jcxzlx',formatter:(val)=>{return val==1?'定量':'定性'},width:150},
                  {label:'检测值',prop:'yzl'},
                  {label:'检测结果',prop:'jcjl',formatter:(val)=>{return val==1?'合格':'不合格'},width:150},
                  {label:'数据来源',prop:'sjly',formatter:(val)=>{return val==1?'手工输入':'设备提取'},width:150},
                  {label:'样品来源',prop:'jclx',formatter:(val)=>{return val==1?'基地生产':'外来采购'},width:150},
                  {label:'关联批次',prop:'zzpc','render-column':this.renderZzpc},
                  {label:'操作',prop:'sfky','render-column':this.renderEdit}
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
        renderImg(h,row){
            var imgSrc=row.attaUrl.split(',')[0];
            
            return (<img class="logoImg"  src={imgSrc}></img>)
        },
        renderZzpc(h,row){
          return (<span class={row.zzpc?'':'f-red'}>{row.zzpc?row.zzpc:'无关联批次'}</span>)
        },
        renderSfkyBtn(h,row){
          return  h('el-switch',{
            attrs:{
              value:row.sfky==1?true:false,
              activeColor:"#090"
            },
            on:{
              change:(value)=>{
                let {ztncpId,sfky} = row;
                sfky=sfky==1?0:1;
                this.$fetch.api_base.cpwh_status({ztncpId,sfky}).then(res=>{
                    row.sfky = sfky;
                })
              }
            }
          })
        },

        renderEdit(h,row){
          return (
            <el-button size="mini" class="edit" onClick={()=>{this.$emit('edit',row)}}>编辑</el-button>
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
        getTableData(obj={pageSize:10,pageNo:1}){
          this.loading = true;
           let {jclx,sjly,searchkey,selDateRange} = this;
          var params =  {
            startDate:selDateRange?selDateRange[0]:'',
            endDate:selDateRange?selDateRange[1]:'', 
            scjyztId:this.userInfo.scjyztId,
            searchkey,
            jclx,
            sjly
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          var query = {
            method:'get',
            url:'/scgl/ns/pageJyjc/',
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
<style>
/* .table .el-button:hover{
  background:#ecf5ff;
  color:#60acff;
  border:1px solid #60acff;
} */
.table .logoImg{
       width:80px;
       height:80px;
       border-radius:5px;
   }
</style>

