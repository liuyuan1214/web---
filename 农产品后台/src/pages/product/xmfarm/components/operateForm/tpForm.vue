/*调批信息编辑*/
<template>
  <el-form
    ref="form"
    :model="form"
    label-width="100px"
    class="form cpwh"
    :rules="rules"
    status-icon
  >
    <div class="form-title f-fs18 f-tac f-mb30 f-mt30">{{form.dpjlId?'编辑':'新增'}}调批信息</div>
    <el-form-item label="场所名称">
      <el-input v-model.trim="pcInfo.cdmc" placeholder="请输入" disabled></el-input>
    </el-form-item>
    <el-form-item label="养殖产品">
      <el-input v-model.trim="pcInfo.ztncpmc" placeholder="请输入" disabled></el-input>
    </el-form-item>
	  	      <el-form-item label="存栏数" prop="cls" class="f4">
        <el-input  v-model.trim="this.pcInfo.cls" type="number"   disabled>
        <template slot="append" v-if="pcInfo.dw">{{pcInfo.dw}}</template>
      </el-input>
    </el-form-item>
    <el-form-item label="调批日期" prop="dbrq">
      <el-date-picker
        v-model.trim="form.dbrq"
        type="date"
        style="width:100%"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="调入场所" prop="drcsmc" class="f-pr f4">
      <el-input v-model.trim="form.drcsmc" :disabled="form.dpjlId?true:false">
        <span slot="suffix" class="f-fs24 f-pr10">···</span>
      </el-input>
      <div
        class="f-pa"
        @click="form.dpjlId?'':trpDialogVisable=true"
        style="top:0;right:0;left:0;bottom:0;opacity:0;"
      ></div>
    </el-form-item>
    <el-form-item label="调入批次" prop="drpc">
      <el-input v-model.trim="form.drpc" disabled></el-input>
    </el-form-item>
		      <el-form-item label="存栏数" prop="cls" class="f4">
        <el-input  v-model.trim="form.drcll"  disabled  >
        <template slot="append" v-if="pcInfo.dw">{{pcInfo.dw}}</template>
      </el-input>
    </el-form-item>	  
			      <el-form-item label="调拨数" prop="dbsl" class="f4">
        <el-input  v-model.trim="form.dbsl"  type="number" v-positiveNumber placeholder="请输入"  >
        <template slot="append" v-if="pcInfo.dw">{{pcInfo.dw}}</template>
      </el-input>
    </el-form-item>	 

<!--<el-form-item :label="pcInfo.dw?`调拨数(${pcInfo.dw})`:`调拨数`" prop="dbsl">
<el-input v-model.trim="form.dbsl" type="number" v-positiveNumber placeholder="请输入"></el-input>
</el-form-item>-->
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
		:maxlength="128"
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
    <el-dialog title="选择调入场所" :append-to-body="true" :visible.sync="trpDialogVisable" width="800px">
      <sel-pc :type="'sf'" style="margin:0 auto;" @selPc="selPc" @close="trpDialogVisable=false"></sel-pc>
    </el-dialog>
  </el-form>
</template>
<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import fetch from "fetch/axios/";
import selPc from "../components/selPc";
  import timeFormat from 'common/tools/timeFormat';
export default {
  inject: ["pcInfo"],
  components: {
    selPc
  },
  data() {
    const commonValidate = {
      required: true,
      message: "必填项",
      trigger: ["blur", "change"]
    };
			const dbslExist = (rule, value, callback)=>{
        //add
        // if(!this.form.dpjlId){
           if(Number(this.form.cls)<Number(value)){
             return callback(new Error('调拨数不能大于存栏数！'));
           }else{
             return callback();
           }
			};
    return {
      trpDialogVisable: false,
      disabled: false,
      olddbsl: 0,
      dialogVisible: false,
      dialogImageUrl: "",
      jcncpDialogVisable: false,
      rules: {
        dbrq: commonValidate,
        dbsl: [commonValidate,{ validator: dbslExist, trigger: 'blur' }],
        cdmc: commonValidate,
        dbrq: commonValidate,
        drcsmc: commonValidate
      }
    };
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          ncpmc: "",
          drcsmc: "",
          dbrq:timeFormat.one(new Date()),
          trpdm: "",
          trpmc: "",
          drcll: "",
          bz: "",
          czr: "",
          pic: "",
          sfr: "",
          imglists: [],
          attaUrl: "",
          zzjlId: "",
          sfjlId: "",
          cls:'',
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
    this.$set(this.form,'cls', Number(this.pcInfo.cls) + Number(this.form.dbsl?this.form.dbsl:0))
    // this.$set(this.form,'drcll', Number(this.form.drcll) - Number(this.form.dbsl?this.form.dbsl:0))
  },
  mounted(){
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //防止二次提交
          this.disabled = true;
          //新增字段
          let {
            dccsdm,
            dccsmc,
            dcpc,
            dcjcrq,
            ncpdm,
            dccll,
            dbrq,
            drcsdm,
            drjcrq,
            drcll,
            dbsl,
            dpjlId,
            ncpmc,
            drcsmc,
            drpc,
            trpdm,
            bz,
            czr,
            pic,
            sfr,
            sfjlId,
            attaUrl
          } = this.form;
          let { zzpc, csmc } = this.pcInfo;
          //用户参数
          let { scjyztId, qydm, userId } = this.userInfo;
          let params = {
            dccsdm: this.pcInfo.csmc,
            dccsmc: this.pcInfo.cdmc,
            dcpc: this.pcInfo.zzpc,
            dcjcrq: this.pcInfo.zzrq,
            ncpdm: this.pcInfo.ztncpId,
            ncpmc: this.pcInfo.ncpmc,
            dccll: this.pcInfo.cls,
            dbrq,
            drcsdm,
            drjcrq,
            drcll,
            dbsl,
            dpjlId,
            drcsmc,
            drpc,
            trpdm,
            bz,
            czr: userId,
            sfr,
            scjyztId,
            pic: attaUrl,
            cjr: userId,
            zzjlId: this.pcInfo.zzjlId,
            zzpc: this.pcInfo.zzpc,
            qydm: this.pcInfo.qydm
          };
          fetch({
            url: "/scgl/ns/saveDpjl/",
            method: "post",
            data: params
          })
            .then(res => {
              this.$message.success("操作成功！");
              //操作本地数据不发起请求更新数据
              this.pcInfo.cls=this.form.cls-this.form.dbsl;
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
    selPc(row) {
      this.trpDialogVisable = false;
      this.form.drcsmc = row.cdmc;
      this.form.drpc = row.zzpc;
      this.form.drcll = row.cls;
      this.form.drjcrq = row.zzrq;
      this.form.drcsdm = row.csmc;
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



