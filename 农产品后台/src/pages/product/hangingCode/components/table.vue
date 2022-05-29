/*产品挂码（基地）*/
<template>
   <div>
    <!-- tab1 -->
     <div class="tab-item" v-show="currentTab==1">
       <!-- 搜索头部 -->
        <div class="header f-df f-pr20">
          <div>
              <label>挂码日期</label>
          <date-picker @selChange="(val)=>{query1.selDateRange=val}" style="vertical-align:bottom"></date-picker> 
              <label>挂码类型</label>
              <el-select  v-model.trim="query1.lx" size="small" class=" f-mr20 f-vab" placeholder="请选择" style="vertical-align:bottom"  @change=search1>
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="成品挂码"></el-option>
                <el-option value="2" label="采收挂码"></el-option>
            </el-select>
              <el-input  placeholder="请输入产品名称" style="vertical-align:bottom"  @keyup.enter.native=search1 v-model.trim=query1.searchKey class="input-with-select f-vab"  size="small">
              </el-input> 
              <el-button type="primary" size="small" style="padding:5px 15px" @click=search1><i class="el-icon-search f-fs20"></i></el-button>
          </div>
          <div class="f-f1 f-tar">
            <el-button type="primary" size="medium" @click="$emit('edit',{})" round style="padding:9px 25px">新 增</el-button>
          </div>
        </div> 
        <s-table
          style="margin-top:0"
          v-loading=loading1
          ref="table1"
          class="table"
          element-loading-text="拼命加载中"
          :tableData=tableData1
          :totalCount=totalCount1
          :getData=getTableData1
          :tableHeader=tableHeader1
      ></s-table>
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
                  lx:'',
                  selDateRange:''
                },
                zldm1:'',
                trpmc1:'',
                zldm2:'',
                trpmc2:'',
                currentTab:1,
                //table参数
                tableHeader1:[
                  {label:'挂码日期',prop:'gmrq',width:120},
                  {label:'产品名称',prop:'hcNcpmc'},
                  {label:'开始码',prop:'codeStart'},
                  {label:'结束码',prop:'codeEnd'},
				  {label:'挂码数（枚）',prop:'codeTotalNum'},
                  {label:'批次号',prop:'zzpc','width':200,'render-column':(h,row)=>{
                      if(row.gmlx==1){
                        return String(row.zzpc)+'-'+row.cspch+'-'+row.remark;
                      }else{
                        return row.zzpc+'-'+row.cspch;
                      }
                  }},
                  {label:'类型',prop:'gmlx',formatter(val){return val==1?'成品挂码':'采收挂码'}},
                  {label:'备注',prop:'bz'},
                  {label:'操作',prop:'sfky','render-column':this.renderTrpEdit}
                ],
                loading1:false,
                totalCount1:1,
                tableData1: [],
                loading2:false,
                totalCount2:1,
                tableData2: [],
            }
        },
        computed:{
          ...mapGetters({
              userInfo:'getUserInfo',
          })
        },  
        created(){
          setTimeout(()=>{
              this.getTableData1();
          },100)
         
          this.getTypes();  //获取类别
        },
       methods:{
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
            <div>
                <el-button size="mini" type="info" plain  onClick={()=>{this.$emit('edit',row)}}>编辑</el-button>              
            </div>
          )
        },
        renderCsEdit(h,row){
          return (
            <el-button size="mini" class="edit"  onClick={()=>{this.$emit('csedit',row)}}>编辑</el-button>
          )
        },
       /*render-column结束*/
       search1(){
         this.$refs.table1.pageNo = 1;
         this.getTableData1();
       },
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        getTableData1(obj={}){
          this.loading = true;
          let {lx,searchKey,selDateRange} = this.query1;
          let {scjyztId} =  this.userInfo;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            lx,
            searchKey,
            startDate:selDateRange?selDateRange[0]:'',
            endDate:selDateRange?selDateRange[1]:'',
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          fetch({
            url:'/Pcgm/pageHungCode/',
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
        getTypes(){
          var params = {
            sjzdLxbm:'TRPLX',
            hy:1
          }
          this.$fetch.api_base.cpwh_type(params).then(res=>{
            this.trpTypes = res.list;
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



