/*地块负责人*/
<template>
   <div>
       <v-table v-if="!isEdit" @edit=edit ref="table"></v-table>
       <v-edit class="editFzr" v-if="isEdit" :form=editRow  @closeForm=closeForm></v-edit>
   </div>
</template>

<script>
	import vEdit  from './component/edit';
	import vTable from './component/table';
    export default {
        name:'userManage',
        components:{
            vEdit,
            vTable
        },
        data(){
            return {
               isEdit:false,   // 判断显示table 还是 编辑弹框
               editRow: {
                    username: '',
                    yhxm: '',
                    sjhm:'',
                    xb: '1',
                    dz: '',
                    bz: ''
                   }
            }
        },
       methods:{
           edit(row={}){
               this.isEdit = true
               if(row.username){
                    this.editRow = row;
               }else{
                   this.editRow = {
                    username: '',
                    yhxm: '',
                    sjhm:'',
                    xb: '1',
                    dz: '',
                    bz: '',
                    yhdm:'',
                    sfky:1
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
   .editFzr{
       margin-left:150px;
   }
</style>



