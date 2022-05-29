/*编辑*/
<template>
  <el-form ref="form" :model="form" label-width="100px" class="form cpwh" :rules="rules" status-icon>
    <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.id?'编辑':'新增'}}田间管理信息</div>
    <el-form-item label="地块名称">
      <el-input v-model.trim="this.pcInfo.cdmc" placeholder="请输入" disabled></el-input>
    </el-form-item>
    <el-form-item label="种植作物">
      <el-input v-model.trim="this.pcInfo.ztncpmc" placeholder="请输入" disabled></el-input>
    </el-form-item>
    <el-form-item label="管理日期" prop="fsrq">
      <el-date-picker
        v-model.trim="form.fsrq"
        type="date"
        style="width:100%"
        value-format="yyyy-MM-dd"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="作业描述" prop="nr">
      <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" v-model.trim="form.nr" placeholder="请输入"
                :maxlength="200" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="图片" prop="imgList">
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
    <el-form-item>
      <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
      <el-button round @click="closeForm(false)">取 消</el-button>
    </el-form-item>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible" width="800px" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </el-form>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {exec} from 'common/tools'
  import fetch from 'fetch/axios/';
  import timeFormat from 'common/tools/timeFormat';

  export default {
    inject: ['pcInfo'],
    data() {
      const commonValidate = {required: true, message: '必填项', trigger: ['blur', 'change']}
      return {
        disabled: false,
        oldncpmc: '',
        dialogVisible: false,
        dialogImageUrl: '',
        jcncpDialogVisable: false,
        rules: {
          nr: commonValidate,
          fsrq: commonValidate
        }
      }
    },
    props: {
      form: {
        type: Object,
        default: function () {
          return {
            fsrq: timeFormat.one(new Date()),
            nr: '',
            tp: '',
            pic: '',
            id: '',
            // scjyztId:'',
            lx: '29',
            // zzpch:'',
            // xgpch:'',
            zt: '1',
            czr: '',
            cjr: '',
            imglists: [],
            attaUrl: ''
          }
        }
      },
      khtype: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      })
    },
    created() {
      this.oldncpmc = this.form.ncpmc;
      this.form.attaUrl = this.form.imagesUrl;
    },
    methods: {
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled = true;
            //新增字段 
            let {
              fsrq,
              nr,
              tp,
              pic,
              id,
              // scjyztId,
              lx,
              // zzpch,
              // xgpch,
              zt,
              // czr,
              cjr,
              attaUrl
            } = this.form;
            //用户参数
            let {scjyztId, userId: czr} = this.userInfo;
            let params = {
              fsrq,
              nr,
              tp,
              id,
              scjyztId,
              lx: 29,
              zzpch: this.pcInfo.zzpc,
              xgpch: this.pcInfo.zzpc,
              zt: '1',
              czr: czr,
              cjr: cjr ? cjr : czr,
              pic: attaUrl
            }
            fetch({
              url: '/scgl/ns/savePcczjl/',
              method: 'post',
              data: params
            }).then((res) => {
              this.$message.success('操作成功！')
              this.closeForm(true);
              this.disabled = false;
            }).catch((res) => {
              this.$message.error(res.errorMess)
              this.disabled = false;
            })
          } else {
            this.$message.error('请按要求填写')
            return false;
          }
        });
      },
      closeForm(fresh = false) {
        this.$emit("closeForm", fresh);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      beforeRemove(file, fileList) {
        console.log('删除之前');
        var delIndex = fileList.findIndex(item => {
          return item.url === file.url
        });
        var attaUrl = this.form.attaUrl.split(',');
        attaUrl.splice(delIndex, 1);
        this.form.attaUrl = attaUrl.join(',');
        return true;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!isJPG) {
          this.$message.error('请上传图片格式为JPG、JPEG或者JNP！')
        }
        if (!isLt3M) {
          this.$message.error('图片大小不能超过3M！')
        }
        return isJPG && isLt3M;
      },
      //上传图片
      uploadImg(item, callback) {
        let formData = new FormData();
        formData.append("clientFile", item.file);
        var query = {
          url: '/utilmodel/uploadFile/',
          method: 'upload',
          data: formData
        }
        fetch(query).then(res => {
          this.addImg(res);
        })
      },
      //上传图片成功
      addImg(response, file) {

        this.form.attaUrl = this.form.attaUrl ? this.form.attaUrl + "," + response.bean : response.bean;

      },
      //类别选择好后，填充到页面
      selJcncp(row) {
        this.jcncpDialogVisable = false;
        this.form.jcncpId = row.ncpId;
        this.form.zlmc = row.ncpZlmc;
        this.form.ncpEjZlmc = row.ncpEjZlmc;
        this.form.ncpSjmc = row.ncpMc;
      }
    }
  }
</script>

<style>
  .cpwh .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }

  .cpwh .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
</style>



