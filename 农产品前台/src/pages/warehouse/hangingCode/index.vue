/*产品维护*/
<template>
   <div>
       <page-name v-model="isEdit"></page-name>
       <v-table v-show="!isEdit" @edit=edit ref="table" @csedit="csedit"></v-table>
        <v-edit class="editFzr"  v-if="isEdit" :isCs=isCs :form=editRow  @closeForm=closeForm></v-edit>
   </div>
</template>

<script>
	import vEdit  from './components/edit';
    import vTable from './components/table';
	import timeFormat from 'common/tools/timeFormat';
    export default {
        name:'hangingCode',
        components:{
            vEdit,
            vTable
        },
        data(){
            return {
               isEdit:false,   // 判断显示table 还是 编辑弹框
               isCs:false,
               editRow:''
            }
        },
        watch:{
            //从导航处点击返回
            isEdit(val){
                if(!val){
                    this.isCs = false;
                }
            }
        },
       methods:{
           edit(row,isCs){
               if(row.id){
                    var imglists = row.attaUrl?row.attaUrl.split(','):[];
                    imglists.forEach((item,index)=>{
                         imglists[index]={"name":index+'.jpg',"url":item};
                    })
                    if(row.gmlx==1){
                        if(isCs){
                            row.zzpcshow = String(row.zzpc)+'-'+row.remark;
                        }else{
                            row.zzpcshow = String(row.zzpc)+'-'+row.cspch+'-'+row.remark;
                        }
                    }else{
                        row.zzpcshow = row.zzpc || row.batchno;      
                    }
                    row.imglists = imglists;
                    this.editRow = row;

               }else{
                   this.editRow = {
                        id:'',
                        zzpc:'',
                        zzpcshow:'',
                        codeStart:'',
                        codeEnd:'',
                        codeTotalNum:'',
                        remark:'',
                        bz:'',
                        hcNcpid:'',
                        hcNcpmc:'',
                        gmrq:timeFormat.one(new Date()),
                        gmlx:'1',
                        pic:'',
                        cspch:'',
                        attaUrl:'',
                        imglists:[]
                   }
               } 
               this.isEdit = true
           },
           csedit(row){
               this.isCs = true;
               this.edit(row,true);
           },
           closeForm(isRefresh){
               this.isEdit = !this.isEdit;
               if(isRefresh){
                    //更新table的数据
                   var childRef = this.isCs?'table2':'table1'
                   this.$refs.table.$refs[childRef].getDataByPage();
               }  
               this.isCs = false;
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



