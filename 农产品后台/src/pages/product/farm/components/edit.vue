/*编辑*/
<template>
<div>
    <el-form ref="form" :model="form" label-width="100px" class="form" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{oldscmc?'编辑':'新增'}}培育记录</div>
      <el-form-item label="操作人" prop="operator">
        <el-input v-model="form.operator" placeholder="请输入" ></el-input>
      </el-form-item>
      <el-form-item label="操作名称" prop="operateName" class="f-pr">
          <el-input  v-model="form.operateName"></el-input>
      </el-form-item>
      <el-form-item label="操作时间" prop="operateTime" class="f-pr">
           <el-date-picker
            v-model="form.operateTime"
            type="date"
            value-format="timestamp"
            placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="操作附图" prop="operateImgUrl" class="f-pr">
         <el-upload
  action="#"
  list-type="picture-card"
  :auto-upload="false">
    <i slot="default" class="el-icon-plus"></i>
    <div slot="file" slot-scope="{file}">
      <img
        class="el-upload-list__item-thumbnail"
        :src="file.url" alt=""
      >
      <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleDownload(file)"
        >
          <i class="el-icon-download"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </div>
</el-upload>
<el-dialog :visible.sync="dialogVisible">
  <img width="100%" :src="dialogImageUrl" alt="">
</el-dialog>
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
          operator:'',
          operateName:'',
          operateTime:'',
          operateImgUrl:'',
          comment:'',
          productBlockId:'',
        },
        rules:{
            operator: [{ required: true, message: '请输入操作人！' }],
            operateName:  [{ required: true, message: '请输入操作名称！'}],
            operateTime: [{ required: true, message: '请输入操作时间！' }],
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
              operator: this.form.operator, 
        operateName: this.form.operateName, 
        operateTime: this.form.operateTime, 
        operateImgUrl: this.form.operateImgUrl, 
        comment: this.form.comment ,
        productBlockId:this.form.productBlockId,
             };
            console.log(paramsAll,"paramsAll")
            this.$fetch.api_base.addcultivation(paramsAll).then((res)=>{

              this.$message.success('操作成功！')
               this.$router.push({name:'parterInfo'})
              this.disabled=false;
            }).catch(()=>{
               this.$message.success('操作失败！')
             
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
