/*投入品维护*/
<template>
   <div>
     <!-- 切换tabs -->
    <div class="tabs  f-df f-cp">
      <div :class="[currentTab==1?'tab-active':'','tab-item']" @click="currentTab=1">投入品领用</div>
      <div :class="[currentTab==2?'tab-active':'','tab-item']"  @click="currentTab=2">投入品领用记录</div>
    </div>
    <!-- tab1 -->
     <div class="tab-item" v-show="currentTab==1">
       <!-- 搜索头部 -->
        <div class="header f-df f-pr20">
          <div>
              <label>地块名称</label>
              <el-select filterable clearable v-model.trim="query1.dkId" size="small" class=" f-mr20 f-vab" placeholder="请选择" style="vertical-align:bottom" @change=search1>
                <el-option :value="item.sccsId" :label="item.csmc" v-for="(item,index) in dklist" :key="index"></el-option>
            </el-select>
              <el-input  placeholder="请输入批次信息" style="vertical-align:bottom" @keyup.enter.native=search1 v-model.trim=query1.searchKey class=" input-with-select f-vab"  size="small">
              </el-input> 
              <el-button type="primary" size="small" style="padding:5px 15px" @click=search1><i class="el-icon-search f-fs20"></i></el-button>
          </div>
        </div> 
        <s-table
          style="margin-top:0"
          v-loading=loading1
          ref="stable1"
          class="table"
          element-loading-text="拼命加载中"
          :tableData=tableData1
          :totalCount=totalCount1
          :getData=getTableData1
          :tableHeader=tableHeader1
      ></s-table>
     </div>
     <!-- tab2 -->
     <div class="tab-item" v-show="currentTab==2">
       <!-- 搜索头部 -->
        <div class="header f-df f-pr20">
          <div>
              <label>领用日期</label>
             <date-picker @selChange="(val)=>{query2.selDateRange=val}" style="vertical-align:bottom"></date-picker> 
              <label>地块名称</label>
              <el-select filterable  clearable v-model.trim="query2.dkId" size="small" class=" f-mr20 f-vab" placeholder="请选择" style="vertical-align:bottom" @change=search1>
                <el-option :value="item.sccsId" :label="item.csmc" v-for="(item,index) in dklist" :key="index"></el-option>
            </el-select>
              <el-input  placeholder="请输入领用单号\批次信息" style="vertical-align:bottom"  @keyup.enter.native=search v-model.trim=query2.searchKey class=" input-with-select f-vab"  size="small">
              </el-input> 
              <el-button type="primary" size="small" style="padding:5px 15px" @click=search2><i class="el-icon-search f-fs20"></i></el-button>
          </div>
        </div> 
        <s-table
          style="margin-top:0"
          v-loading=loading2
          ref="stable2"
          class="table"
          element-loading-text="拼命加载中"
          :tableData=tableData2
          :totalCount=totalCount2
          :getData=getTableData2
          :tableHeader=tableHeader2>
        </s-table>
     </div>
   </div>
</template>

<script>
	  import { mapGetters } from 'vuex'
	  import fetch from 'fetch/axios'
    export default {
        data(){
            return {
                trpTypes:[
                  {'key':'qpzz','label':'起批种植'}
                ],
                query1:{
                  searchKey:'',
                  dkId:''
                },
                query2:{
                  searchKey:'',
                  dkId:'',
                  selDateRange:''
                },
                zldm1:'',
                trpmc1:'',
                zldm2:'',
                trpmc2:'',
                currentTab:1,
                //table参数
                tableHeader1:[
                  {label:'起批日期',prop:'qprq'},
                  {label:'种植农产品',prop:'ztncpmc'},
                  {label:'种植批次',prop:'zzpc'},
                  {label:'地块名称',prop:'cdmc'},
                  {label:'地块负责人',prop:'yhxm'},
                  {label:'操作',prop:'sfky','render-column':this.renderTrpEdit}
                ],
                loading1:false,
                totalCount1:1,
                tableData1: [],
                tableHeader2:[
                  {label:'领用日期',prop:'lydLyrq'},
                  {label:'领用单号',prop:'lydh'},
                  {label:'投入品名称',prop:'trpmc'},
                  {label:'领用数量',prop:'lysl'},
                  {label:'单位',prop:'dw'},
                  {label:'地块名称',prop:'csmc'},
                  {label:'批次',prop:'zzpc'}
                ],
                loading2:false,
                totalCount2:1,
                tableData2: [],
                dklist:[],
            }
        },
        computed:{
          ...mapGetters({
              userInfo:'getUserInfo',
          })
        },  
        created(){
          this.getTableData1();
          this.getTableData2();
          this.getDkList(); 
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
              activeColor:"#13ce66"
            },
            on:{
              change:(value)=>{
                let {nhId,sfky} = row;
                sfky=sfky==1?0:1;
                this.$fetch.api_base.dkfzr_status({nhId,sfky}).then(res=>{
                    row.sfky = sfky;
                })
              }
            }
          })
        },
        renderTrpEdit(h,row){
          return (
                <el-button size="mini"  class="edit" onClick={()=>{this.$emit('edit',row,'1')}}>领用开单</el-button> 
          )
        },
       /*render-column结束*/
        search1(){
          this.$refs.stable1.pageNo=1;
          this.$refs.stable1.getDataByPage();
        },
        search2(){
          this.$refs.stable2.pageNo=1;
          this.$refs.stable2.getDataByPage();
        },
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        getTableData1(obj={}){
          this.loading = true;
          let {searchKey,dkId} = this.query1;
          let {scjyztId} =  this.userInfo;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            dkId,
            searchkey:searchKey
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          fetch({
            url:'/cggl/cg/pageZzjlTrply/',
            method:'get',
            data:params
          }).then(res=>{
            let {data,pageNo,totalCount} = res.list;
            this.tableData1 = data;
            this.totalCount1 = totalCount;
            this.currentPage1 = pageNo;
            this.loading1 = false;
          }).catch(()=>{
            this.loading1 = false;
          })
        },
        getTableData2(obj={}){
          this.loading2 = true;
          let {dkId,searchKey,selDateRange} = this.query2;
          let {scjyztId} =  this.userInfo;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            dkId,
            searchkey:searchKey,
            startDate:selDateRange?selDateRange[0]:'',
            endDate:selDateRange?selDateRange[1]:'',
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          fetch({
            url:'/cggl/cg/pageTrply/',
            method:'get',
            data:params
          }).then(res=>{
            let {data,pageNo,totalCount} = res.list;
            this.tableData2 = data;
            this.totalCount2 = totalCount;
            this.currentPage2 = pageNo;
            this.loading2 = false;
          }).catch(()=>{
            this.loading2 = false;
          })
        },
        // 获取查询条件
        getDkList(){
          var params = {
            scjyztId:this.userInfo.scjyztId
          }
          fetch({
            method:'get',
            url:'/scgl/ns/getSccsByScjyztId/',
            data:params
          }).then(res=>{
            this.dklist = res.list;
          })
        }
       }
    }
</script>

<style lang="scss" scoped>
  .tabs{
     height:40px;
     margin-top:15px;
     margin-bottom:30px;
     background:#d7d7d7;
    color:#333;
     .tab-item{
       padding: 0 10px;
       line-height:40px;
       border-right:1px solid #fff; 
     }
     .tab-active{
       color:#fff;
       background:#679936;
     }
   }
   .header{
     margin-bottom:20px;
     .input-with-select{
       width:240px;
    }
   }

   .ncp-img{
     width:50px;
     height:50px;
     border-radius:50%;
   }
</style>



