/*投入品维护*/
<template>
   <div>
     <!-- 切换tabs -->
    <div class="tabs  f-df f-cp">
      <div :class="[currentTab==1?'tab-active':'','tab-item']" @click="currentTab=1">投入品库</div>
      <div :class="[currentTab==2?'tab-active':'','tab-item']"  @click="currentTab=2">我的新增申请</div>
    </div>
    <!-- tab1 -->
     <div class="tab-item" v-show="currentTab==1">
       <!-- 搜索头部 -->
        <div class="header f-df f-pr20">
          <div>
              <label>类型</label>
              <el-select style="vertical-align:bottom" v-model.trim="zldm1" size="small" class="f-vab" placeholder="请选择"  @change="search1()" clearable>
                <el-option
                  v-for="item in trpTypes"
                  :key="item.sjzdBm"
                  :label="item.sjzdMc"
                  :value="item.sjzdBm">
                </el-option>
            </el-select>
              <el-input placeholder="投入品名称"  style="vertical-align:bottom" @keyup.enter.native="search1()" v-model.trim=trpmc1 class="input-with-select"  size="small">
              </el-input> 
              <el-button type="primary" size="small" @click="search1()"><i class="el-icon-search f-fs20"></i></el-button>
          </div>
          <div class="f-f1 f-tar">
            <el-button type="primary" size="medium" @click="$emit('edit',{})" round style="padding:9px 25px">提 取</el-button>
          </div>
        </div> 
        <s-table
          style="margin-top:0"
          v-loading=loading1
          ref="stable1"
          element-loading-text="拼命加载中"
          :tableData=tableData1
          :totalCount=totalCount1
          :getData=getTableData1
          :tableHeader=tableHeader1
      ></s-table>
     </div>
     <!-- tab2 -->
     <div v-show="currentTab==2">
       <!-- 搜索头部 -->
        <div class="header f-df f-pr20">
          <div>
		  <!-- 
              <label>类型</label>
              <el-select v-model.trim="zldm2" size="small" class="f-vab" placeholder="请选择"  @change=getTableData2 clearable>
                <el-option
                  v-for="item in trpTypes"
                  :key="item.sjzdBm"
                  :label="item.sjzdMc"
                  :value="item.sjzdBm">
                </el-option>
            </el-select> -->
              <el-input placeholder="请输入投入品名称" @keyup.enter.native=getTableData2 v-model.trim=trpmc2 class="input-with-select"  size="small">
              </el-input> 
              <el-button type="primary" size="small" @click=getTableData2><i class="el-icon-search f-fs20"></i></el-button>
          </div>
          <div class="f-f1 f-tar">
            <el-button type="primary" size="medium" @click="$emit('edits',{})" round style="padding:9px 25px">申 请</el-button>
          </div> 
        </div> 
        <s-table
          style="margin-top:0"
          v-loading=loading2
          ref="stable2"
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
    export default {
        data(){
            return {
                trpTypes:[
                  {'key':'qpzz','label':'起批种植'}
                ],
                zldm1:'',
                trpmc1:'',
                zldm2:'',
                trpmc2:'',
                currentTab:1,
                //table参数
                tableHeader1:[
                  {label:'投入品名称',prop:'trpmc'},
                  {label:'规格型号',prop:'ggxh'},
                  {label:'单位',prop:'dw'},
                  {label:'生产单位',prop:'scdw'},
                  {label:'类型',prop:'zlmc'},
                  {label:'备注',prop:'bz'},
                  {label:'操作',prop:'sfky','render-column':this.renderTrpEdit}
                ],
                loading1:false,
                totalCount1:1,
                tableData1: [],
                tableHeader2:[
                  {label:'申请时间',prop:'createTimestamp',width:'180'},
                  {label:'投入品名称',prop:'agriProdName'},
                  {label:'规格型号',prop:'model'},
                  {label:'单位',prop:'unit',width:'100'},
                  {label:'生产单位',prop:'scdw'},
                  //{label:'类型',prop:'dlMc'},
                  {label:'状态',prop:'spzt',formatter:(val)=>{return val==1?'待审批':val==2?'通过':'不通过'},width:'150'},
                  {label:'操作',prop:'sfky',width:'150'}
                ],
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
          this.getTableData1();
          this.getTableData2();
          this.getTypes();  //获取类别
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
              <el-button size="mini" type="danger" onClick={()=>{
                    this.$confirm("此操作将删除该条投入品信息, 是否继续?", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      cancelButtonClass:'is-round',
                      confirmButtonClass:'is-round',
                      type: "warning"
                    }).then(() => {
                      this.$fetch.api_base.trp_trqdelete({zttrpId:row.zttrpId}).then(res=>{
                        let infos = ['删除成功','存在种植记录或者进货记录','存在子投入品']
                        this.$message({"type":res.bean==0?'success':'error',message:infos[res.bean]})
                        if(res.bean==0) this.$refs.stable1.getDataByPage();
                      }).catch(res=>{
                        this.$message.error(res.errorMess);  
                      }) 
                    }).catch(() => {});
                }}>删除</el-button>  
          )
        },
        renderXzEdit(h,row){
          return (
              <el-button size="mini" type="danger" onClick={()=>{
                    this.$confirm("此操作将删除该条新增投入品申请信息, 是否继续?", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      cancelButtonClass:'is-round',
                      confirmButtonClass:'is-round',
                      type: "warning"
                    }).then(() => {
                      this.$fetch.api_base.trp_xzdelete({id:row.id}).then(res=>{
                        this.$message({"type":'success',message:'删除成功！'})
                        if(res.bean==0) this.$refs.stable2.getDataByPage();
                      }).catch(res=>{
                        this.$message.error(res.errorMess);  
                      }) 
                    }).catch(() => {});
                }}>删除</el-button>  
          )
        },
       /*render-column结束*/
      
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        getTableData1(obj={}){
          this.loading = true;
          let {trpmc1,zldm1} = this;
          let {scjyztId} =  this.userInfo;
          let params = {
            scjyztId,
            zldm:zldm1,
            trpmc:trpmc1
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_base.trp_list(params).then(res=>{
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
          let {trpmc2,zldm2} = this;
          let params = {
            bizId:this.userInfo.scjyztId,
			lx:1,
            key:trpmc2,
            zldm:zldm2
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_base.trp_xzlist(params).then(res=>{
            let {data,pageNo,totalCount} = res.list;
            this.tableData2 = data;
            this.totalCount2 = totalCount;
            this.currentPage2 = pageNo;
            this.loading2 = false;
          }).catch(()=>{
            this.loading2 = false;
          })
        },
        search1(){
          this.$refs.stable1.pageNo=1;
          this.$refs.stable1.getDataByPage();
        },
        search2(){
          this.$refs.stable2.pageNo=1;
          this.$refs.stable2.getDataByPage();
        },
        getTypes(){
          var params = {
            sjzdLxbm:'TRPLX',
            hy:this.userInfo.hydm
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



