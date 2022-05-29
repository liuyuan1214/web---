/*编辑*/
<template>
  <el-form
    ref="form"
    :model="form"
    label-width="120px"
    class="form cpwh"
    :rules="rules"
    status-icon
  >
    <div class="form-title f-fs18 f-tac f-mb30 f-mt30">{{form.id?'编辑':'新增'}}采蜜信息</div>
    <el-form-item label="养殖场所">
      <el-input v-model.trim="this.pcInfo.cdmc" placeholder="请输入" disabled></el-input>
    </el-form-item>
    <el-form-item label="养殖产品">
      <el-input v-model.trim="this.pcInfo.ztncpmc" placeholder="请输入" disabled></el-input>
    </el-form-item>
    <el-form-item label="采蜜开始日期" prop="cmrq">
      <el-date-picker
        v-model.trim="form.cmrq"
        type="date"
        style="width:100%"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="采蜜结束日期" prop="jsrq">
      <el-date-picker
        v-model.trim="form.jsrq"
        type="date"
        style="width:100%"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      ></el-date-picker>
    </el-form-item>	
    <el-form-item label="蜂种来源" prop="fzly" class="f4">
      <el-input v-model.trim="form.fzly" placeholder="请输入" :maxlength="60"  show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="蜂种" prop="fz" class="f4">
      <el-input v-model.trim="form.fz" placeholder="请输入" :maxlength="60"  show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="主要花种" prop="zyhz" class="f4">
      <el-input v-model.trim="form.zyhz" placeholder="请输入" :maxlength="60"  show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="负责人" prop="fzr" class="f4">
      <el-input v-model.trim="form.fzr" placeholder="请输入" :maxlength="32"  ></el-input>
    </el-form-item>

    <el-form-item label="图片" prop="imgList">
      <el-upload 
        :limit="9"
        action="/httpService/utilmodel/uploadFile"
        :auto-upload="true"
        name="clientFile"
        :http-request="uploadImg"
         :before-upload="beforeAvatarUpload"
        :file-list="form.imglists"
        :on-preview="handlePictureCardPreview"
        :before-remove="beforeRemove"
       
        multiple
        list-type="picture-card"
      >
        <i class="el-icon-plus"></i>
      </el-upload>备注：最多上传9张，支持jpg，png格式图片
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 10}"
        v-model.trim="form.bz"
        placeholder="请输入"
        :maxlength="100"
		show-word-limit
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        round
        type="primary"
        @click="submitForm"
        :disabled="disabled"
      >{{disabled?'提交中':'提 交'}}</el-button>
      <el-button round @click="closeForm(false)">取 消</el-button>
    </el-form-item>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible" width="800px" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
    <el-dialog title="选择转入场所" :append-to-body="true" :visible.sync="isSeldk" width="800px">
      <sel-dk @seldk="selDk"></sel-dk>
    </el-dialog>
  </el-form>
</template>
<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import fetch from "fetch/axios/";
import selDk from "../components/selDk.vue";
import timeFormat from 'common/tools/timeFormat';
export default {
  inject: ["pcInfo"],
  components: {
    selDk
  },
  data() {
    const commonValidate = {
      required: true,
      message: "必填项",
      trigger: ["blur", "change"]
    };
    return {
      disabled: false,
      oldncpmc: "",
      dialogVisible: false,
      dialogImageUrl: "",
      isSeldk: false,
      rules: {
        cmrq: commonValidate,
		jsrq: commonValidate,
        fzly: commonValidate,
        fzr: commonValidate,
        fz: commonValidate,
        zyhz: commonValidate
      }
    };
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          cmrq:timeFormat.one(new Date()),
		  jsrq:timeFormat.one(new Date()),
          fzly: "",
          fz: "",
          fzr: "",
          zyhz: "",
          summary: "",
          id: "",
          imglists: [],
          attaUrl: "",
          zzjlId: ""
        };
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
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //防止二次提交
          this.disabled = true;
          //新增字段
          let {
            cmrq,
			jsrq,
            fzly,
            fz,
            fzr,
            zyhz,
            summary,
            id,
            pic,
            zsrq,
            zrcsdm,
            zrcsmc,
            zsjlId,
            attaUrl
          } = this.form;
          let { zzpc, csmc } = this.pcInfo;
          //用户参数
          let { scjyztId, qydm, userId } = this.userInfo;
          let params = {
            cmrq,
			jsrq,
            fzly,
            fz,
            fzr,
            zyhz,
            summary,
            id,
            pic: attaUrl,
            zsjlId,
            scjyztId,
            zzjlId: this.pcInfo.zzjlId,
            zzpc: this.pcInfo.zzpc,
            zzpch: this.pcInfo.zzpc,
            qydm: this.pcInfo.qydm,
            cjr: userId
          };
          fetch({
            url: "/scgl/ns/saveFmCm/",
            method: "post",
            data: params
          })
            .then(res => {
              this.$message.success("操作成功！");
              this.closeForm(true);
              this.disabled = false;
            })
            .catch(res => {
              this.$message.error(res.errorMess);
              this.disabled = false;
            });
        } else {
          this.$message.error("请按要求填写");
          return false;
        }
      });
    },
    close(rowlist) {
      this.trpDialogVisable = false;
    },
    closeForm(fresh = false) {
      this.$emit("closeForm", fresh);
    },
    handlePictureCardPreview(file) {
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
    addImg(response, file) {
      this.form.attaUrl =
        this.form.attaUrl != ""
          ? this.form.attaUrl + "," + response.bean
          : response.bean;
    },
    //类别选择好后，填充到页面
    selDk(row) {
      this.form.zrcsdm = row.sccsId;
      this.form.zrcsmc = row.csmc;
      this.isSeldk = false;
    }
  }
};
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



