/*编辑*/
<template>
       <el-dialog
            title="通知详情"
            width="900px"
            :visible.sync="isEdit"
            :append-to-body="true"
           :before-close="beforeClose"
        >
        <div class="f-tac f-fs20" style="line-height:40px;">{{form.title}}</div>
        <div class="f-tac tz-info">
            <span>时间：{{form.sendDate}}</span>
            <span>作者：{{form.yhxm}}</span>
        </div>
        <div v-html="form.content" style="word-break:break-all"></div>
        <div class="f-df mt20" v-if="form.listAtta && form.listAtta.length">
            <div>附件：</div>
            <div class="f-f1" >
                <div v-for="(row,index) in form.listAtta" :key="index">
                    <a style="color:#2196f3" :href="row.attaUrl" :download="row.newAttaName" :title="row.newAttaName">{{row.newAttaName}}</a>
                </div>
            </div>
        </div>
        <div class="f-tac mt20 ">
             <el-button  round  @click="$emit('closeForm',false)">取 消</el-button>
        </div>
      </el-dialog>
</template>
<script>
  export default {
    data(){
    
      return {
        isEdit:true
       }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                  title:'',
                  content:'',
                  sendDate:'',
                  yhxm:'',
                  listAtta:[],
                }
            }
        },
        isread:{
          type:Boolean,
          default:false
        }
    },
    created(){
    },
    methods:{
      beforeClose(done){
         this.$emit("closeForm",false);
         done();
      }
    }
  }
</script>

<style lang="css" scoped>
    .tz-info{
        line-height:30px;
        margin-bottom:30px;
        border-bottom:1px dotted #666;
    }
    .mt20{
        margin-top:20px;
    }
</style>