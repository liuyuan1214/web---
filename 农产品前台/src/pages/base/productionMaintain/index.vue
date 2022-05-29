/*地块负责人*/
<template>
   <div>
       <page-name v-model="isEdit"></page-name>

       <v-table v-if="!isEdit" @edit=edit ref="table"></v-table>
       <v-edit v-if="isEdit" :form=editRow  @closeForm=closeForm></v-edit>
       <history-detail v-if="isHistory"   @closeForm=closeForm></history-detail>
   </div>
</template>

<script>
	import vEdit  from './component/edit';
	import vTable from './component/table';
    
    export default {
        name:'landInfo',
        components:{
            vEdit,
            vTable,
           
        },
        data(){
            return {
               isEdit:false,   // 判断显示table 还是 编辑弹框
               editRow:'',
               isHistory:false
            }
        },
        mounted(){
            let { id } = this.$route.query.id
            console.log(this.$route.params,"选中的id号码")
        },
       methods:{
       
           edit(row){
               this.isEdit = true
               if(row.id){
                    
                    this.editRow ={
                        thresholdMax:'',
                    thresholdMin:'',
                    openAlert:'',
                    sensorId:row.id,
                        }
               }else{
                   this.editRow ={
                        thresholdMax:'',
                    thresholdMin:'',
                    openAlert:'',
                    sensorId:row.id,
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



