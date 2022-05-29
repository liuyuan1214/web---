// 农事操作初始化

<template>
   <div class="dkfzr">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <label>日期</label>
          <date-picker @selChange="(val)=>{selDateRange=val}"></date-picker> 
          <label>状态</label>
          <el-select  v-model.trim="type" size="small" class=" f-mr20 f-vab" placeholder="请选择"  @change=search>
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="未完结"></el-option>
            <el-option value="2" label="已完结"></el-option>
         </el-select>
          <el-input  placeholder="请输入场所名称\养殖产品\批次号"  @keyup.enter.native=search v-model.trim=searchkey class="input-with-select f-vab"  size="small" clearable>
          </el-input> 
          <el-button type="primary" size="small" style="padding:5px 15px" @click=search><i class="el-icon-search f-fs20"></i></el-button>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="$emit('edit')" round style="padding:9px 25px">新增批次</el-button>
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
    export default {
        data(){
            return {
                searchkey:'',
                type:'',
                selDateRange:null,
                //养殖业
                tableHeader:[
                  {label:'进场日期',prop:'qprq',width:'150'},
                  {label:'场所名称',prop:'cdmc'},
                  {label:'养殖产品',prop:'ztncpmc'},
				          {label:'养殖批次',prop:'zzpc' },
                  {label:'蜂箱数量(箱)',prop:'zzl'},
				           {label:'状态',prop:'zt',width:'150','render-column':this.renderState},
                  {label:'操作',prop:'sfky',width:'200','render-column':this.renderEdit}
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
          return (<span class={row.zt==1?'':'f-red'}>{row.zt==1?'未完结':'已完结'}</span>)
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
			   <el-button size="mini" type="info" plain onClick={()=>{this.$emit('pcedit',row)}}>{row.zt==1?'批次管理':'批次查看'}</el-button>
            )
        },
       /*render-column结束*/
      
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        search(){
          //获取组件当前的pageNo 和 pageSize
          var pageNo = this.$refs.stable.pageNo;
          var pageSize = this.$refs.stable.pageSize;
          this.getTableData({pageNo,pageSize});
        },
        getTableData(obj={pageSize:10,pageNo:1}){
          this.loading = true;
           let {type,searchkey,selDateRange} = this;
          var params =  {
            startDate:selDateRange?selDateRange[0]:'',
            endDate:selDateRange?selDateRange[1]:'', 
            scjyztId:this.userInfo.scjyztId,
            searchkey,
            type
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          var query = {
            method:'get',
            url:'/scgl/ns/pageZzjl/',
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
.table .logoImg{
       width:80px;
       height:80px;
       border-radius:5px;
   }
</style>

