
/*往来单位*/
<template>
   <div>
    <page-name v-model="isBack"></page-name>
    <div v-show="!isPcEdit">
       <v-table v-show="!isEdit" @edit=edit  ref="table" @pcedit="pcedit"></v-table>
       <v-edit class="editFzr"  v-if="isEdit"   @closeForm=closeForm></v-edit>
    </div>
    <pc-edit  v-if="isPcEdit" ref="pcedit" :form=editRow  page="farm" @closeForm=pcClose></pc-edit>
   </div>
</template>

<script>
    // 新增
    import vEdit  from './components/pcadd.vue';
    // 批次编辑
    import pcEdit  from './components/pcedit.vue';
    // 初始化列表
	import vTable from './components/table';
	import timeFormat from 'common/tools/timeFormat';
    export default {
        name:'nsjl',
        components:{
            vEdit,
            vTable,
            pcEdit
        },
        data(){
            return {
               isEdit:false,   // 判断显示table 还是 编辑弹框
               isPcEdit:false,
               isBack:false,
               sjly:'',
               editRow: {
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
        watch:{
            isBack(val){
              //用户点击返回
              if(!val){
                  if(this.isPcEdit && this.$refs.pcedit.isEditOperate){
                    this.$refs.pcedit.isEditOperate = false;
                    this.isBack=true;
                  }else{
                      this.isPcEdit=false;
                      this.isEdit=false;
                  }
              }  
            }
        },  
       methods:{
           edit(row={}){
               this.isEdit = true;
               this.isBack = true;
               if(row.id){
                    var imglists = row.attaUrl&&!row.ajjlImgs.length?row.attaUrl.split(','):[];
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
           pcedit(row){
            this.isPcEdit = true;
            this.isBack = true;
            this.editRow = row;
           },
           pcClose(){
               this.isPcEdit =!this.isPcEdit;
               this.isBack = false;
           },
           closeForm(isRefresh){
               this.isEdit = !this.isEdit;
               this.isBack = false
               ;
               if(isRefresh){
                    //更新table的数据
                    this.$refs.table.search();
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



