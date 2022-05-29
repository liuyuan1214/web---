/*种植业编辑*/
<template>
  <el-form
    ref="form"
    :model="form"
    label-width="100px"
    class="form cpwh"
    :rules="rules"
    status-icon
  >
    <div class="form-title f-fs18 f-tac f-mb30 f-mt30">{{form.bchfzjlId?'编辑':'新增'}}用药信息</div>
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
    <el-form-item label="用药日期" prop="syrq">
      <el-date-picker
        v-model.trim="form.syrq"
        type="date"
        style="width:100%"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      ></el-date-picker>
    </el-form-item>
				      <el-form-item label="发病数" prop="fbs" class="f4">
        <el-input  v-model.trim="form.fbs"  placeholder="请输入" :maxlength="20" type="number" >
        <template slot="append" v-if="pcInfo.dw">{{pcInfo.dw}}</template>
      </el-input>
    </el-form-item>	 
    <el-form-item label="主要症状" prop="zyzz" class="f4">
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 10}"
        v-model.trim="form.zyzz"
        placeholder="请输入"
        :maxlength="120"
        show-word-limit
      ></el-input>
    </el-form-item>
    <el-form-item label="用药名称" prop="trpmc" class="f-pr f4">
      <el-input v-model.trim="form.trpmc">
        <span slot="suffix" class="f-fs24 f-pr10">···</span>
      </el-input>
      <div
        class="f-pa"
        @click="trpDialogVisable=true"
        style="top:0;right:0;left:0;bottom:0;opacity:0;"
      ></div>
    </el-form-item>
    <el-form-item label="用量及用法" prop="yl" class="f4">
      <el-input v-model.trim="form.yl" placeholder="请输入" :maxlength="20" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="处方人" prop="cfr" class="f4">
      <el-input v-model.trim="form.cfr" placeholder="请输入" :maxlength="20" ></el-input>
    </el-form-item>
    <el-form-item label="用药人" prop="syr" class="f4">
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
        :type="'xqyy'"
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
    const validatefbs = (rule, value, callback) => {
      if (Number(value) <= Number(this.pcInfo.cls)) {
        callback();
      } else {
        callback(new Error("超出最大存栏数！"));
      }
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
        fbs: [commonValidate, { validator: validatefbs, trigger: "blur" }],
        zyzz: commonValidate,
        yl: commonValidate,
        cfr: commonValidate,
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
          ncpmc: "",
          tp: "",
          pic: "",
          trpmc: "",
          bchfzjlId: "",
          scjyztId: "",
          czr: "",
          cjr: "",
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
    //this.getFzdxdmlb();
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
            zyzz,
            pic,
            syr,
            cfr,
            fbs,
            yl,
            bchfzjlId,
            cjr,
            attaUrl
          } = this.form;
          //用户参数
          let { scjyztId, userId: czr } = this.userInfo;
          let params = {
            syrq,
            ncpmc: this.pcInfo.ncpmc,
            fzdxdm: 0,
            trpdm,
            aqjgq: 0,
            zyzz,
            yl,
            syr,
            syff: 1,
            cfr,
            fbs,
            cls: 0,
            scjyztId,
            bchfzjlId,
            zzpc: this.pcInfo.zzpc,
            zzjlId: this.pcInfo.zzjlId,
            qydm: this.pcInfo.qydm,
            csmc: this.pcInfo.csmc,
            czr: czr,
            cjr: this.userInfo.userId,
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
    // getFzdxdmlb(){
    //   fetch({
    //      method:'get',
    //      url:'/scgl/ns/pageBhmu/',
    //      data:{
    //        hy:this.userInfo.hydm,
    //       }
    //    }).then((res)=>{
    //      this.fzdxdmlb = res.list.data;
    //    })
    //},
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



