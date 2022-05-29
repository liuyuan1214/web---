/*地块负责人*/
<template>
   <div>
       <page-name v-model="isEdit"></page-name>

       <v-table v-if="isEdit" @edit=edit ref="table"></v-table>
       <v-edit v-if="!isEdit" :form=editRow  @closeForm=closeForm></v-edit>
   </div>
</template>

<script>
	import vEdit  from './components/edit';
	import vTable from './components/table';
    export default {
        name:'landInfo',
        components:{
            vEdit,
            vTable
        },
        data(){
            return {
               isEdit:false,   // 判断显示table 还是 编辑弹框
               editRow:''
            }
        },
       methods:{
           edit(row){
               this.isEdit = true
               if(row.sccsId){
                    let { sccsId,ztdm,csbh,csmc,cslxbh,cslxmc,syjsz,fzr,nhsfzh,nhxm,mj,bz,sfky,positCode,scjyztId}=row;
                    this.editRow = {
                       sccsId, ztdm,csbh,csmc,cslxbh:cslxbh+'/'+cslxmc,cslxmc,syjsz,fzr,nhsfzh,nhxm,mj,bz,sfky,positCode,scjyztId
                    };
               }else{
                   this.editRow = {
                    csmc:'',
                    fzr:'',
                    cslxbh:'',
                    cslxmc:'',
                    mj: '',
                    positCode:'',
                    bz:'',
                    sfky:'1',
                    syjsz:'',
                   }
               }    
           },
           closeForm(isRefresh){
               this.isEdit = !this.isEdit;
               if(isRefresh){
                    //更新table的数据
                   this.$refs.table.getTableData();
               }  
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



