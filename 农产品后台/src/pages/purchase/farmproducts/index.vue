/*往来单位*/
<template>
   <div>
       <page-name v-model="isEdit"></page-name>
       <v-table v-if="!isEdit" @edit=edit ref="table" :khtype="khtype"></v-table>
       <v-edit :khtype="khtype" v-if="isEdit" :form=editRow :id="editId"  @closeForm=closeForm></v-edit>
   </div>
</template>

<script>
	import vEdit  from './component/edit.vue';
	import vTable from './component/table';
    export default {
        name:'purchaseFarm',
        components:{
            vEdit,
            vTable
        },
        data(){
            return {
               isEdit:false,   // 判断显示table 还是 编辑弹框
               editId:'',
               khtype:[
                  {label:'销售商',value:'01'},
                  {label:'农资销售商',value:'02'},
                  {label:'农产品供应商',value:'04'},
                ],
               editRow: {
                    nhId: '',
                    nhxm: '',
                    sfzh:'',
                    xb:'1',
                    dz: '',
                    bz: '',
                    lxdh: '',
                    sfky:1
                   }
            }
        },
       methods:{
           edit(row={}){
               this.isEdit = true
               this.editId = row.id || '';
           },
           closeForm(isRefresh){
               this.isEdit = !this.isEdit;
               //if(isRefresh){
               //    //更新table的数据
               //     this.$refs.table.$refs.stable.getDataByPage();
               //}  
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



