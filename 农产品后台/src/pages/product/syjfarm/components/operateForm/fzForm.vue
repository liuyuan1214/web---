/*种植业编辑*/
<template>
  <el-form
    ref="form"
    :model="form"
    label-width="150px"
    class="form cpwh"
    :rules="rules"
    status-icon
  >
    <div class="form-title f-fs18 f-tac f-mb30 f-mt30">{{form.bchfzjlId?'编辑':'新增'}}病虫害防治信息</div>
    <el-form-item label="地块名称">
      <el-input v-model.trim="this.pcInfo.cdmc"  disabled></el-input>
    </el-form-item>
    <el-form-item label="种植作物">
      <el-input v-model.trim="this.pcInfo.ztncpmc"  disabled></el-input>
    </el-form-item>
    <el-form-item label="防治日期" prop="syrq">
      <el-date-picker
        v-model.trim="form.syrq"
        type="date"
        style="width:100%"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="防治对象" prop="fzdxdm">
      <el-select
        v-model.trim="form.fzdxdm"
        placeholder="请选择"
        @change="selectGet"
        style="width:100%"
      >
        <el-option
          v-for="(item,index) in fzdxdmlb"
          :key="index"
          :label="item.bhmc"
           :value="String(item.bhmuId)"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="防治药剂" prop="trpmc" class="f-pr f4">
      <el-input v-model.trim="form.trpmc" placeholder="请选择">
        <span slot="suffix" class="f-fs24 f-pr10">···</span>
      </el-input>
      <div
        class="f-pa"
        @click="trpDialogVisable=true"
        style="top:0;right:0;left:0;bottom:0;opacity:0;"
      ></div>
    </el-form-item>

    <el-form-item label="安全间隔期（天）" prop="aqjgq" class="f4">
      <el-input v-model.trim="form.aqjgq" placeholder="请输入" :maxlength="20" type="number"></el-input>
    </el-form-item>
    <el-form-item label="用量（亩/kg）" prop="yl" class="f4">
      <el-input v-model.trim="form.yl" placeholder="请输入" :maxlength="20" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="施药人" prop="syr" class="f4">
      <el-input v-model.trim="form.syr" placeholder="请输入" :maxlength="20" ></el-input>
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
    <el-dialog :visible.sync="dialogVisible"  title="图片预览" width="800px" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
    <el-dialog title="选择投入品" :append-to-body="true" :visible.sync="trpDialogVisable" width="800px">
      <sel-trp
        :type="'bcfz'"
        style="margin:0 auto;"
        @selTrp="selTrp"
        @close="trpDialogVisable=false"
      ></sel-trp>
    </el-dialog>
  </el-form>
</template>
<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import fetch from "fetch/axios/";
import selTrp from "../components/selTrp";
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
    return {
      disabled: false,
      oldncpmc: "",
      dialogVisible: false,
      dialogImageUrl: "",
      fzdxdmlb: [],
      trpDialogVisable: false,
      rules: {
        syrq: commonValidate,
        fzdxdm: commonValidate,
        yl: commonValidate,
        trpmc: commonValidate,
        syr: commonValidate
      }
    };
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          syrq:timeFormat.one(new Date()),
          trpmc: "",
          pic: "",
          id: "",
          syr: "",
		  fzdxdm: "",
          bhmc: "",
          bhmuId: "",
          imglists: [],
          attaUrl: ""
        };
      }
    }
    //getFzdxdmlb:{
    //   type:Array,
    //    default:()=>{
    //        return []
    //   }
    //}
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created() {
    this.oldncpmc = this.form.ncpmc;
    this.getFzdxdmlb();
    //执行放置对象的函数
  },
  methods: {
    selectGet(value) {
      //  let selItem = this.fzdxdmlb.filter(item=>{return item.bhmc==value})
      // this.form.fzdxdm= selItem[0].bhmc
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //防止二次提交
          this.disabled = true;
          //新增字段
          let {
            syrq,
            ncpmc,
            trpdm,
            fzdxdm,
            pic,
            yl,
            aqjgq,
            bchfzjlId,
            syr,
            cjr,
            bhmc,
            attaUrl
          } = this.form;
          if(aqjgq!=""&& aqjgq<1){
            this.$message.error("安全间隔期应大于0");
            this.disabled = false;
            return false;
          }
          //用户参数
          let { scjyztId, userId: czr } = this.userInfo;
          let params = {
            syrq,
            ncpmc: this.pcInfo.ncpmc,
            fzdxdm,
            trpdm,
            aqjgq,
            yl,
            syr,
            syff: 1,
            cfr: 0,
            fbs: 0,
            cls: 0,
            bchfzjlId,
            scjyztId,
            zzpc: this.pcInfo.zzpc,
            zzjlId: this.pcInfo.zzjlId,
            qydm: this.pcInfo.qydm,
            csmc: this.pcInfo.csmc,
            czr: czr,
            cjr: cjr ? cjr : czr,
            pic: attaUrl
          };
          fetch({
            url: "/scgl/ns/saveBhfzjl/",
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
    getFzdxdmlb() {
      fetch({
        method: "get",
        url: "/scgl/ns/pageBhmu/",
        data: {
          hy: this.userInfo.hydm
        }
      }).then(res => {
        this.fzdxdmlb = res.list;
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
    selTrp(row) {
      this.trpDialogVisable = false;
      this.form.trpdm = row.zttrpId;
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



