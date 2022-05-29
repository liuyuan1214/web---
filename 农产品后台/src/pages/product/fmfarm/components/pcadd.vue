/*畜牧 起批日期 取 zzrq*/
<template>
    <el-form ref="form" :model="form" label-width="120px" class="form cpwh-edit" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.id?'编辑':'新增'}}批次信息</div>
      <el-form-item label="进场日期" prop="qprq" >
            <el-date-picker
              v-model.trim="form.qprq"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="养殖场所" prop="csmc" class="f-pr">
          <el-input placeholder="请选择" v-model.trim=form.csmc><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
          <div class="f-pa" @click="isSeldk=true"  style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
      <el-form-item label="出生日期" prop="csrq" >
            <el-date-picker
              v-model.trim="form.csrq"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="养殖产品" prop="ncpmc" class="f-pr">
          <el-input placeholder="请选择" v-model.trim=form.ncpmc><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
          <div class="f-pa" @click="jcncpDialogVisable=true"  style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
	  <el-form-item label="品种" prop="trpdm">
        <el-input v-model.trim="form.trpdm" placeholder="请输入" :maxlength="10" show-word-limit></el-input>
	  </el-form-item>
	  <el-form-item label="来源" prop="ly">
          <el-radio-group v-model="form.ly">
            <el-radio :label="1">自繁</el-radio>
            <el-radio :label="2">外购</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="蜂箱数量(箱)" prop="zzl">
        <el-input v-model.trim="form.zzl" placeholder="请输入" type="number" :maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="预收日期" prop="ysrq" >
            <el-date-picker
              v-model.trim="form.ysrq"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="图片" prop="attaUrl">
        <el-upload         
        :http-request="uploadImg"
         :before-upload="beforeAvatarUpload"
          :limit="9"
          action="''"
          :auto-upload="true"
          name="clientFile"
          :file-list="form.imglists"
          :on-preview="handlePictureCardPreview"
          :before-remove="beforeRemove"
         
          multiple
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        备注：最多上传9张，支持jpg，png格式图片
      </el-form-item>
      <el-form-item label="备注">
         <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model.trim="form.bz" placeholder="请输入"  :maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button  round  @click="closeForm(false)">取 消</el-button>
      </el-form-item>

      <!-- 选择所属分类 -->
      <el-dialog
        title="选择地块"
        width="900px"
        :visible.sync="isSeldk"
      >
        <sel-dk @seldk="seldk"></sel-dk>
      </el-dialog>
      <!-- 选择农产品 -->
      <el-dialog
        title="选择养殖产品"
        width="900px"
        :visible.sync="jcncpDialogVisable"
      >
        <sel-sample @selSample="selSample"></sel-sample>
      </el-dialog>
    </el-form>
</template>
<script>
  import { mapGetters } from 'vuex' 
  import { exec } from 'common/tools'  
  import selSample from './components/selSample.vue'
  import selDk from './components/selDk.vue'
  import fetch from 'fetch/axios'
  import timeFormat from 'common/tools/timeFormat';

  export default {
    components:{
      selSample,
      selDk
    },
    data(){
      const commonValidate = {required: true, message: '必填项', trigger: 'blur'}
      const commonValidateChange = {required: true, message: '必填项', trigger: 'change'}
      return {
        disabled:false,
        oldncpmc:'',
        dialogVisible:false,
        dialogImageUrl:'',
        jcncpDialogVisable:false,
        isSeldk:false,
        rules:{
            qprq:commonValidateChange,
			csrq:commonValidateChange,
            csmc:commonValidate,
            ncpmc:commonValidate,
            zzl:commonValidateChange,
			ly:commonValidate,
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                  zzjlId:'',
                  csmc:'',
                  zttrpId:'',
                  ztncpId:'',
                  qprq:timeFormat.one(new Date()),
                  csrq:'',
                  qydm:'',
                  sccsid:'',
                  trpdm:'',
                  ncpmc:'',
                  zzmj:'',
                  ly:'',
                  zzl:'',
                  ysl:'',
                  ysrq:'',
                  bz:'',
                  czr:'',
                  cjr:'',
                  pic:'',
                  attaUrl:'',
                  imglists:[]
                }
            }
        }
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    methods: {
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            let { 
              zzjlId,
              zttrpId,
              ztncpId,
              qprq,
              csrq,
              sccsid,
              trpdm,
              ncpmc,
              zzmj,
              ly,
              zzl,
              ysl,
              ysrq,
              bz,
              attaUrl,
              id,
              pic
            } = this.form;
            //用户参数
            let {scjyztId,userId,qydm} = this.userInfo;
            let params =  {
                  zzjlId,
                  zttrpId,
                  ztncpId,
                  qprq,
				  zzrq:qprq,
                  csrq,
                  sccsid,
                  trpdm,
                  ncpmc,
                  zzmj,
				  bb:5,
                  ly,
                  zzl,
                  ysl:0,
				  cls:zzl,
                  ysrq,
                  bz,
                  scjyztId,
                  qydm,
                  czr:userId,
                  cjr:userId,
                  pic:attaUrl
            }
            //编辑参数
            if(id){
              params.id = id;
            }
            fetch({
              method:'post',
              url:'/scgl/ns/saveZzjl/',
              data:params
            }).then((res)=>{
              this.$message.success('操作成功！')
              this.closeForm(true);
              this.disabled=false;
            }).catch((res)=>{
               this.$message.error(res.errorMess)
               this.disabled=false;
            })
          } else {
            this.$message.error('请按要求填写')
            return false;
          }
        });
      },
      closeForm(fresh=false){
        this.$emit("closeForm",fresh);
      },
      handlePictureCardPreview(file){
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
           beforeRemove(file,fileList){
        console.log('删除之前');
        var delIndex = fileList.findIndex(item=>{return item.url===file.url});
        var attaUrl = this.form.attaUrl.split(',');
        attaUrl.splice(delIndex,1);
        this.form.attaUrl=attaUrl.join(',');
        return true;
      },
      beforeAvatarUpload(file){
            const isJPG = file.type==='image/jpeg' || file.type==='image/jpg' ||  file.type==='image/png';
            const isLt3M = file.size / 1024 / 1024 < 3;
            if(!isJPG){
                this.$message.error('请上传图片格式为JPG、JPEG或者JNP！')
            }
            if(!isLt3M){
               this.$message.error('图片大小不能超过3M！')   
            }
             return isJPG && isLt3M;
      },
      //上传图片
      uploadImg(item,callback){
            let formData = new FormData();
            formData.append("clientFile", item.file);
            var query =  {
              url:'/utilmodel/uploadFile/',
              method:'upload',
              data:formData
            }
            fetch(query).then(res=>{
                this.addImg(res);
            })
        }, 
      //上传图片成功
      addImg(response, file){
        this.form.attaUrl = this.form.attaUrl? this.form.attaUrl  +"," + response.bean:response.bean;
      },
      //类别选择好后，填充到页面
      seldk(row){
        this.form.sccsid = row.sccsId;
        this.form.csmc = row.csmc;
        this.$refs.form.validateField('csmc');
        this.isSeldk=false;
      },
      selSample(row){
        this.jcncpDialogVisable=false;
        this.form.ztncpId = row.ztncpId;
        // this.form.zttrpId = row.zttrpId;  
        // this.form.trpmc = row.zttrpmc;  
        this.form.ncpmc = row.ncpmc;  
        // this.form.zzjlId = row.zzjlId;  
        // this.form.trpdm = row.trpdm;  
      }
    }
  }
</script>

<style>
.cpwh-edit .el-upload-list--picture-card .el-upload-list__item {
  width: 110px;
  height: 110px;
}
.cpwh-edit .el-upload--picture-card {
  width: 110px;
  height: 110px;
  line-height: 110px;
}
.cpwh-edit .el-date-editor.el-input, .cpwh-edit .el-date-editor.el-input__inner {
    width: 100%;
}
</style>