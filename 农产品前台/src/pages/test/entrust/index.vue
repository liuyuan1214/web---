/*往来单位*/
<template>
   <div>
       <page-name v-model="isEdit"></page-name>
       <v-table v-if="!isEdit" @edit=edit  ref="table" ></v-table>
       <v-edit class="editFzr" :sjly="sjly" v-if="isEdit" :form=editRow  @closeForm=closeForm></v-edit>
   </div>
</template>

<script>
	import vEdit  from './component/edit.vue';
	import vTable from './component/table';
	import timeFormat from 'common/tools/timeFormat';
    export default {
        name:'testCommsion',
        components:{
            vEdit,
            vTable
        },
        data(){
            return {
               isEdit:false,   // 判断显示table 还是 编辑弹框
               sjly:'',
               editRow: {
                  jyjcId:'',
                  zzjlId:'',
                  zzpc:'',
                  ncpmc:'',
                  csmc:'',
                  jcxm:'',
                  jcjl:1,
                  bz:'',
                  czsj:'',
                  czr:'',
                  jclx:1,
                  jcr:'',
                  pic:''
                }
            }
        },
       methods:{
           edit(row={}){
               this.isEdit = true
               if(row.id){
                    var imglists = row.attaUrl?row.attaUrl.split(','):[];
                    imglists.forEach((item,index)=>{
                         imglists[index]={"name":index+'.jpg',"url":item};
                    })
                    row.imglists = imglists;
                    this.editRow = row;
               }else{
                   this.editRow = {
                        id:'',
                        scjyztId:'',
                        zzpc:'',
                        testDate:timeFormat.one(new Date()),
                        testSno:'',
                        testCompanyName:'',
                        userId:'',
                        pic:'',
                        jclx:'1',
                        ypmc:'',
                        yply:'1',
                        remark:'',
                        attaUrl:'',
                        imglists:[]
                   }
               }    
           },
           closeForm(isRefresh){
               this.isEdit = !this.isEdit;
               if(isRefresh){
                    //更新table的数据
                   this.$refs.table.$refs.stable.getDataByPage();
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



