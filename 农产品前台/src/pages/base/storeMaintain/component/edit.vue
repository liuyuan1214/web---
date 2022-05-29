/*编辑*/
<template>
  <el-form
    ref="form"
    :model="form"
    label-width="100px"
    class="form stwh"
    :rules="rules"
    status-icon
  >
    <div class="form-title f-fs18 f-tac f-mb30 f-mt30">{{oldncpmc?'编辑':'新增'}}商铺维护</div>
    <el-form-item label="商铺名称" prop="scMc">
      <el-input v-model.trim="form.scMc" placeholder="请输入" :maxlength="10" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="商铺类型" prop="type" class="f-pr">
      <el-select
        v-model.trim="form.type"
        size="small"
        class="f-vab f-mr20"
        style="width:100%;"
        placeholder="请选择"
      >
        <el-option v-for="(item,index) in dptype" :key="index" :label="item" :value="index+1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="商铺网址"  prop="scDz" v-if="form.type!=5">
      <el-input
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 10}"
		:maxlength="500"
		show-word-limit
        v-model.trim="form.scDz"
        placeholder="请输入"
      ></el-input>
    </el-form-item>
    <el-form-item label="logo图" prop="logoImg">
      <el-upload
        action="/utilmodel/uploadFile/"
        :auto-upload="true"
        name="clientFile"
        :http-request="uploadImgLogo"
        :show-file-list="false"
        class="avatar-uploader"
      >
        <img v-if="form.logoImg" :src="form.logoImg" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="小程序码" prop="xcxImg" v-if="form.type==5">
      <el-upload
        action="/utilmodel/uploadFile/"
        :auto-upload="true"
        :http-request="uploadImgXcx"
        name="clientFile"
        class="avatar-uploader"
        :show-file-list="false"
      >
        <img v-if="form.xcxImg" :src="form.xcxImg" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
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
  </el-form>
</template>
<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import fetch from "fetch/axios/";
export default {
  data() {
    //使用了一个input没有的事件select  目的：只在最后提交之前触发客户名称是否存在的校验
    const ncpmcExist = (rule, value, callback) => {
      var params = {
        ncpMc: this.form.ncpmc,
        scjyztId: this.userInfo.scjyztId
      };
      //edit
      if (this.oldncpmc && this.form.ncpmc === this.oldncpmc) {
        callback();
      }
      this.$fetch.api_base.stwh_exist(params).then(res => {
        if (res.bean == 1) {
          callback(new Error("该农产品名称已存在"));
        } else {
          callback();
        }
      });
    };
    const commonValidate = {
      required: true,
      message: "必填项",
      trigger: ["blur", "change"]
    };
    return {
      disabled: false,
      oldncpmc: "",
      rules: {
        scMc: commonValidate,
		logoImg: commonValidate,
		xcxImg: commonValidate,
        type: commonValidate,
        scDz: commonValidate
      },
      dptype: ["京东", "淘宝", "天猫", "微商城", "小程序商城"]
    };
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          type: "",
          scMc: "",
          scDz: "",
          logoImg: "",
          xcxImg: "",
          addUser: "",
          addTime: ""
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
          let { type, scMc, scDz, logoImg, xcxImg, addUser } = this.form;
          //用户参数
          let { qydm, qyid, userId } = this.userInfo;
          let params = {
            type,
            scMc,
            logoImg,
            xcxImg,
            qydm,
            addUser,
            qyId: qyid
          };
          if (type == 5) {
            params.xcxImg = xcxImg;
          } else {
            params.scDz = scDz;
          }
          //编辑的时候传递的参数
          if (this.form.id) {
            params.id = this.form.id;
          } else {
            var date = new Date();
            var czrq =
              date.getFullYear() +
              "-" +
              (date.getMonth() + 1) +
              "-" +
              date.getDate();
            params.addUser = userId;
            params.addTime = czrq;
          }
          this.$fetch.api_base
            .dpwh_save(params)
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
    //上传图片
    uploadImgXcx(item) {
      this.uploadImg(item, res => {
        this.form.xcxImg = res.bean;
      });
    },
    //上传图片
    uploadImgLogo(item) {
      this.uploadImg(item, res => {
        this.form.logoImg = res.bean;
      });
    },
    //上传图片
    uploadImg(item, callback) {
      let formData = new FormData();
      formData.append("clientFile", item.file);
      var query = {
        url: "/utilmodel/uploadFile/",
        method: "upload",
        data: formData
      };
      fetch(query).then(res => {
        callback(res);
        this.$message.success("操作成功！");
      });
    },
    closeForm(fresh = false) {
      this.$emit("closeForm", fresh);
    },
    //上传图片成功
    addLogoImg(response, file, type) {
      this.form.logoImg = response.bean;
    },
    //类别选择好后，填充到页面
    selJcncp(row) {}
  }
};
</script>

<style>
.stwh .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
.stwh .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>



