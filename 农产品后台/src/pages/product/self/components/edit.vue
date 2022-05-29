/*编辑*/
<template>
<div>
    <el-form ref="form" :model="form" label-width="100px" class="form" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{oldscmc?'编辑':'新增'}}质检记录</div>
      <el-form-item label="质检人" prop="inspector">
        <el-input v-model="form.inspector" placeholder="请输入" ></el-input>
      </el-form-item>

      <el-form-item label="质检时间" prop="inspectTime" class="f-pr">
           <el-date-picker
            v-model="form.inspectTime"
            type="date"
            value-format="timestamp"
            placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="质检分数" prop="inspectScore">
        <el-input v-model="form.inspectScore" placeholder="请输入" ></el-input>
      </el-form-item>
      <el-form-item label="是否质检通过" prop="pass">
        <el-select v-model="form.pass" placeholder="请选择">
    <el-option label="是" value="true"></el-option>
    <el-option label="否" value="false"></el-option>
  </el-select>
      </el-form-item>
      <el-form-item label="农产品ID" prop="productBlockId" class="f-pr">
          <el-input  v-model="form.productBlockId"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="comment" class="f-pr">
          <el-input  v-model="form.comment"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button  round @click="closeForm(false)">取 消</el-button>
      </el-form-item>
    </el-form>
</div>

</template>
<script>
 import {mapGetters} from 'vuex'
  export default {
    data(){
      return {
        disabled:false,
        dktypes:[],
        selDK:[],
        oldscmc:'',
        fzrDialogVisable:false,
         dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        form:{
          inspector:'',
          inspectScore:'',
          pass:'',
          inspectTime:'',
          comment:'',
          productBlockId:'',
        },
        rules:{
            inspector: [{ required: true, message: '请输入质检人！' }],
            inspectScore:  [{ required: true, message: '请输入质检分数！'}],
            pass:  [{ required: true, message: '请选择是否质检！'}],
            inspectTime: [{ required: true, message: '请输入操作时间！' }],
            comment: [{ required: true, message: '请输入备注！' }],
            //operateImgUrl:  [{ required: true, message: '请输入操作附图！' }],
            productBlockId:  [{ required: true, message: '请输入农产品块ID！' }],
        },
      }
    },
    computed:{
      ...mapGetters({userInfo:'getUserInfo'})
    },
    created(){

    },
    // props:{
    //     form:{
    //         type:Object,
    //         default:function(){
    //             return {
    //                 operator:'',
    //                 operateName:'',
    //                 operateTime:'',
    //                 operateImgUrl:'',
    //                 comment:'',
    //                 productBlockId:'',
    //             }
    //         }
    //     }
    // },
    methods: {
     handleRemove(file) {
        console.log(file);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        console.log(file);
      },

      selDKType(value){
        this.selDK = value.split('/');
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //用户参数
            console.log("提交中")
        
            let paramsAll ={
              inspector: this.form.inspector, 
        inspectScore: this.form.inspectScore, 
        pass: this.form.pass, 
        inspectTime: this.form.inspectTime, 
        comment: this.form.comment ,
        productBlockId:this.form.productBlockId,
             };
            console.log(paramsAll,"paramsAll")
            this.$fetch.api_base.addqualityCheck(paramsAll).then((res)=>{

              this.$message.success('操作成功！')
              this.$router.push({name:'parterInfo'})
              this.disabled=false;
            }).catch(()=>{
               this.$message.success('操作失败！')
               this.closeForm(true);
               this.disabled=false;
               
            })
          } else {
            this.$message.error('请按要求填写!!');
            return false;
          }
        });
      },
      closeForm(fresh=false){
        this.$emit("closeForm",fresh);
      }
    }
  }
</script>

 <style scoped lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
//     .form{
//         width:700px;
//         .form-title{
//             padding-left:180px;
//         }
//     }
</style>
