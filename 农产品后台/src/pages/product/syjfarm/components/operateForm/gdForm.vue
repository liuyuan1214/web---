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
    <div class="form-title f-fs18 f-tac f-mb30 f-mt30">{{form.id?'编辑':'新增'}}栽培基质信息</div>
    <el-form-item label="地块名称">
      <el-input v-model.trim="this.pcInfo.cdmc" placeholder="请输入" disabled></el-input>
    </el-form-item>
    <el-form-item label="种植作物">
      <el-input v-model.trim="this.pcInfo.ztncpmc" placeholder="请输入" disabled></el-input>
    </el-form-item>
    <el-form-item label="组成成分名称" prop="zccf">
      <el-input
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 10}"
        v-model.trim="form.zccf"
        placeholder="请输入"
        :maxlength="80"
		show-word-limit
      ></el-input>
    </el-form-item>
    <el-form-item label="比例" prop="bl">
      <el-input v-model.trim="form.bl" placeholder="请输入" :maxlength="50"  show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="来源" prop="ly">
      <el-input v-model.trim="form.ly" placeholder="请输入" :maxlength="50" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="使用量(斤)" prop="sysl">
      <el-input v-model.trim="form.sysl" placeholder="请输入" :maxlength="50"  type="number"></el-input>
    </el-form-item>
    <el-form-item label="塑料袋" prop="sld">
      <el-input v-model.trim="form.sld" placeholder="请输入" :maxlength="50" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="瓶的来源" prop="pdly">
      <el-input v-model.trim="form.pdly" placeholder="请输入" :maxlength="50" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="图片" prop="imgList">
      <el-upload 
                :http-request="uploadImg"
         :before-upload="beforeAvatarUpload"
        :limit="9"
        action="/httpService/utilmodel/uploadFile"
        :auto-upload="true"
        name="clientFile"
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
        v-model.trim="form.summary"
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
    <el-dialog :visible.sync="dialogVisible"  title="图片预览" width="800px" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </el-form>
</template>
<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import fetch from "fetch/axios/";
export default {
  inject: ["pcInfo"],
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
      jcncpDialogVisable: false,
      rules: {
        zccf: commonValidate,
        bl: commonValidate,
        sysl: commonValidate,
        ly: commonValidate,
        sld: commonValidate,
        pdly: commonValidate
      }
    };
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          fsrq: "",
          nr: "",
          tp: "",
          pic: "",
          id: "",
          zt: "1",
          czr: "",
          cjr: "",
          imglists: [],
          attaUrl: ""
        };
      }
    },
    khtype: {
      type: Array,
      default: () => {
        return [];
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
            zccf,
            bl,
            ly,
            sysl,
            sld,
            pdly,
            pic,
            id,
            cjr,
            attaUrl
          } = this.form;
          //用户参数
          let { scjyztId, userId: czr } = this.userInfo;
          let params = {
            zccf,
            bl,
            ly,
            sysl,
            sld,
            pdly,
            pic,
            zzjlId: this.pcInfo.zzjlId,
            id,
            scjyztId,
            czr: czr,
            cjr: cjr ? cjr : czr,
            pic: attaUrl
          };
          fetch({
            url: "/scgl/ns/savezpjz/",
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
    selJcncp(row) {
      this.jcncpDialogVisable = false;
      this.form.jcncpId = row.ncpId;
      this.form.zlmc = row.ncpZlmc;
      this.form.ncpEjZlmc = row.ncpEjZlmc;
      this.form.ncpSjmc = row.ncpMc;
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



