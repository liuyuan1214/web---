/*往来单位*/
<template>
   <div>
       <page-name v-model="isEdit"></page-name>

       <v-table v-if="!isEdit" @edit=edit ref="table" :khtype="khtype"></v-table>
       <v-edit class="editFzr" :khtype="khtype" v-if="isEdit" :form=editRow  @closeForm=closeForm></v-edit>
   </div>
</template>

<script>
	import vEdit  from './component/edit.vue';
	import vTable from './component/table';
    export default {
        name:'parterInfo',
        components:{
            vEdit,
            vTable
        },
        data(){
            return {
               isEdit:false,   // 判断显示table 还是 编辑弹框
               khtype:[
                  {label:'销售商',value:'01'},
                  {label:'农资供应商',value:'02'},
                  {label:'农产品供应商',value:'04'},
                ],
               editRow: {
                    lb: '01',
                    khjc: '',
                    khmc:'',
                    lxr: '',
                    lxdh: '',
                    dz: '',
                    bz: '',
                    sfky:'1'
                   }
            }
        },
       created(){
           //请求数据并赋值给khtype，别忘了引入fetch方法
       },
       methods:{
           edit(row={}){
               this.isEdit = true
               if(row.khmc){
                    this.editRow = row;
               }else{
                   this.editRow = {
                    lb: '01',
                    khjc: '',
                    khmc:'',
                    lxr: '',
                    lxdh: '',
                    dz: '',
                    bz: '',
                    sfky:'1'
                   }
               }    
           },
           closeForm(isRefresh){
               this.isEdit = !this.isEdit;
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



