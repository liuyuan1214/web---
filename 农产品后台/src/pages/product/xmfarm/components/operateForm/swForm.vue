/*编辑*/
<template>
  <el-form
    ref="form"
    :model="form"
    label-width="100px"
    class="form cpwh"
    :rules="rules"
    status-icon
  >
    <div class="form-title f-fs18 f-tac f-mb30 f-mt30">{{form.swjlId?'编辑':'新增'}}死亡信息</div>
    <el-form-item label="场所名称">
      <el-input v-model.trim="this.pcInfo.cdmc" placeholder="请输入" disabled></el-input>
    </el-form-item>
    <el-form-item label="养殖产品">
      <el-input v-model.trim="this.pcInfo.ztncpmc" placeholder="请输入" disabled></el-input>
    </el-form-item>
	  	      <el-form-item label="存栏数" prop="cls" class="f4">
        <el-input  v-model.trim="this.pcInfo.cls" type="number"   disabled>
        <template slot="append" v-if="pcInfo.dw">{{pcInfo.dw}}</template>
      </el-input>
    </el-form-item>
    <el-form-item label="死亡日期" prop="swrq">
      <el-date-picker
        v-model.trim="form.swrq"
        type="date"
        style="width:100%"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      ></el-date-picker>
    </el-form-item>
		      <el-form-item label="死亡数" prop="swsl" class="f4">
        <el-input  v-model.trim="form.swsl"  placeholder="请输入" type="number" :maxlength="13"  >
        <template slot="append" v-if="pcInfo.dw">{{pcInfo.dw}}</template>
      </el-input>
    </el-form-item>	  
    <el-form-item label="死亡原因" prop="swyy">
      <el-input
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 10}"
        v-model.trim="form.swyy"
        placeholder="请输入"
        :maxlength="64"
		show-word-limit
      ></el-input>
    </el-form-item>
    <el-form-item label="处理方法" prop="clff">
      <el-input
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 10}"
        v-model.trim="form.clff"
        placeholder="请输入"
        :maxlength="64"
		show-word-limit
      ></el-input>
    </el-form-item>
    <el-form-item label="处理人" prop="clr">
      <el-input v-model.trim="form.clr" placeholder="请输入" :maxlength="20" show-word-limit></el-input>
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
        :autosize="{ minRows: 3, maxRows: 10}"
        v-model.trim="form.bz"
        placeholder="请输入"
        :maxlength="64"
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
    <el-dialog title="选择投入品" :append-to-body="true" :visible.sync="trpDialogVisable" width="800px">
      <sel-trp style="margin:0 auto;" @selTrp="selTrp" @close="trpDialogVisable=false"></sel-trp>
    </el-dialog>
  </el-form>
</template>
<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import fetch from "fetch/axios/";
import selTrp from "./selTrp";
  import timeFormat from 'common/tools/timeFormat';
export default {
  inject: ["pcInfo"],
  components: {
    selTrp
  },
  data() {
    const commonValidate = {
      required: true,
      message: "必填项",
      trigger: ["blur", "change"]
    };
    const validateswyy = (rule, value, callback) => {
      if (Number(value) <= Number(this.form.cls)) {
        callback();
      } else {
        callback(new Error("超出最大存栏数！"));
      }
    };
    return {
      trpDialogVisable: false,
      disabled: false,
      oldncpmc: "",
      dialogVisible: false,
      dialogImageUrl: "",
      jcncpDialogVisable: false,
      rules: {
        swrq: commonValidate,
        swyy: commonValidate,
        sfr: commonValidate,
        syff: commonValidate,
        clr: commonValidate,
        swsl: [commonValidate, { validator: validateswyy, trigger: "blur" }]
      }
    };
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          swrq:timeFormat.one(new Date()),
          swyy: "",
          swsl: "",
          clr: "",
          clff: "",
          cls: "",
          syff: "",
          bz: "",
          czr: "",
          pic: "",
          imglists: [],
          attaUrl: "",
          zzjlId: ""
        };
      }
    }
    //khtype:{
    //    type:Array,
    //    default:()=>{
    //        return []
    //    }
    //}
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created() {
     this.$set(this.form,'cls', Number(this.pcInfo.cls) + Number(this.form.swsl?this.form.swsl:0))
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //防止二次提交
          this.disabled = true;
          //新增字段
          let {
            swrq,
            swyy,
            swsl,
            clr,
            clff,
            syff,
            bz,
            czr,
            pic,
            swjlId,
            attaUrl
          } = this.form;
          let { zzpc, ncpmc, csmc } = this.pcInfo;
          //用户参数
          let { scjyztId, qydm, userId } = this.userInfo;
          let params = {
            swrq,
            swyy,
            swsl,
            clr,
            clff,
            syff,
            bz,
            swjlId,
            czr: userId,
            cjr: userId,
            scjyztId,
            pic: attaUrl,
            cls: this.form.cls - swsl,
            zzjlId: this.pcInfo.zzjlId,
            zzpc: this.pcInfo.zzpc,
            qydm: this.pcInfo.qydm
          };
          fetch({
            url: "/scgl/ns/saveSwjl/",
            method: "post",
            data: params
          })
            .then(res => {
              this.$message.success("操作成功！");
   
              this.pcInfo.cls =this.form.cls - swsl;
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
    selTrp(row) {
      this.trpDialogVisable = false;
      this.form.trpdm = row.trpdm;
      this.form.trpmc = row.trpmc;
      
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



