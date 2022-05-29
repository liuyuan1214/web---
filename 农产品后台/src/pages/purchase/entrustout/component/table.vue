/*地块负责人*/
<template>
   <div class="dkfzr">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <label>报告日期</label>
          <date-picker @selChange="(val)=>{selDateRange=val}" style="vertical-align:bottom"></date-picker>
          <label>类型</label>
          <el-select  v-model.trim="jclx" size="small" class=" f-mr20 f-vab" placeholder="请选择" style="vertical-align:bottom"  @change=search >
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="农产品检测"></el-option>
            <el-option value="2" label="环境检测"></el-option>
         </el-select>
          <el-input  placeholder="请输入报告编号\样品名称\检测机构"  @keyup.enter.native=search v-model.trim=searchKey style="vertical-align:bottom" class=" input-with-select f-vab"  size="small">
          </el-input>
          <el-button type="primary" size="small" style="padding:5px 15px" @click=search><i class="el-icon-search f-fs20" ></i></el-button>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click=tqjcbg round style="padding:9px 25px">提取报告</el-button>
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
     <el-dialog
       title="检测报告"
       width="1200px"
       :visible.sync="tqbgDialogVisable"
       :append-to-body="true"
       @close="closeForm()"
     >
       <v-tqbg @closeForm="closeForm" :yply="yply"></v-tqbg>
     </el-dialog>
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios/'
    import selSample from './selSample.vue'
    //import vTqbg from 'pages/product/entrust/component/tqbg.vue'

    export default {
        components:{
          selSample,
          vTqbg
        },
        data(){
            return {
                tqbgDialogVisable:false,
                yply:'2',
                sfky:false,
                searchKey:'',
                jclx:'',
                selDateRange:null,
                //table参数
                tableHeader:[
                  {label:'报告日期',prop:'testDate',width:150},
                  {label:'样品名称',prop:'ypmc'},
                  {label:'报告编号',prop:'testSno'},
                  {label:'类型',prop:'jclx',formatter:(val)=>{return val==1?'农产品检测':'环境检测'}},
                  {label:'检测机构',prop:'testCompanyName'},
                  {label:'关联批次',prop:'zzpc'},
                  {label:'报告来源',prop:'bgly',formatter:(val)=>{return val==1?'手工录入':'检测机构'}},
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
           setTimeout(()=>{
            this.getTableData();
          },100)
          // this.getTableData();
        },
       methods:{
       /*render-column开始*/
        renderImg(h,row){
            var imgSrc=row.attaUrl.split(',')[0];

            return (<img class="logoImg"  src={imgSrc}></img>)
        },
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
            <el-button size="mini" type="info" plain onClick={()=>{this.$emit('edit',row)}}>编辑</el-button>
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
           let {jclx,searchKey,yply,selDateRange} = this;
          var params =  {
            startDate:selDateRange?selDateRange[0]:'',
            endDate:selDateRange?selDateRange[1]:'',
            scjyztId:this.userInfo.scjyztId,
            searchKey,
            jclx,
			yply:2,
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          var query = {
            method:'get',
            url:'/jcgl/jc/pageTestInfo/',
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
         tqjcbg(){
           this.tqbgDialogVisable =true;

         },
         closeForm(){
           this.tqbgDialogVisable = false;
           this.search();
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

