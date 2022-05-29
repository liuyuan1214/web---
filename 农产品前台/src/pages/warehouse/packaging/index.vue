/*产品维护*/
<template>
   <div class="f-pr">
       <page-name v-model="isBack"></page-name>
       <v-table v-show="!isEdit && !isInfo" @edit=edit ref="table" ></v-table>
       <v-edit v-if="isEdit" :form="editRow" @close=close :ly="ly"></v-edit>
       <v-info v-if="isInfo" :form="editRow" @close=close :ly="ly"></v-info>
   </div>
</template>

<script>
	import vEdit  from './components/edit';
	import vInfo  from './components/info';
    import vTable from './components/table';
        import timeFormat from 'common/tools/timeFormat';
    export default {
        name:'packaging',
        components:{
            vEdit,
            vInfo,
            vTable
        },
        data(){
            return {
                isBack:false,
               isEdit:false,   // 判断显示table 还是 编辑弹框
               isInfo:false,   
               editRow:{},
               ly:'1'
            }
        },
        watch:{
            isBack(val){
             if(!val){
                this.isInfo=false;
                this.isEdit=false;
              }  
            }
        },
       methods:{
           edit(row,ly,isInfo){
               if(row.id){
                    row.ncpmc = row.ncpMc;
                    var imglists = row.attaUrl?row.attaUrl.split(','):[];
                    imglists.forEach((item,index)=>{
                         imglists[index]={"name":index+'.jpg',"url":item};
                    })
                    row.imglists = imglists;
                    var editRow = JSON.parse(JSON.stringify(row));
                    this.editRow = editRow;
               }else{
                   this.editRow = {
                    id:'',
                    zzpc:'',
                    csjlId:'',
                    packDate:timeFormat.one(new Date()),
                    packType:1,
                    ncpId:'',
                    ncpmc:'',
                    packNum:'',
                    packToProductNum:'',
                    handleWay:'',
                    produceLevel:'',
                    remark:'',
                    pic:'',
                    yl:'',
                    syl:'',
                    attaUrl:'',
                    imglists:[]
                   }
               }
               this.ly = ly
               isInfo?this.isInfo = true:this.isEdit = true;
               this.isBack = true;
           },
           close(isRefresh){
               this.isEdit = false;
               this.isInfo = false;
               this.isBack = false;
               if(isRefresh){
                    //更新table的数据
                   var childRef = this.ly==1?'table1':'table2'
                   this.$refs.table.$refs[childRef].getDataByPage();
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



