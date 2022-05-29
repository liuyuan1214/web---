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
    <div class="form-title f-fs18 f-tac f-mb30 f-mt30">{{form.sfjlId?'编辑':'新增'}}施肥信息</div>
    <el-form-item label="地块名称">
      <el-input v-model.trim="this.pcInfo.cdmc" placeholder="请输入" disabled></el-input>
    </el-form-item>
    <el-form-item label="种植作物">
      <el-input v-model.trim="this.pcInfo.ztncpmc" placeholder="请输入" disabled></el-input>
    </el-form-item>
    <el-form-item label="施肥日期" prop="sfrq">
      <el-date-picker
        v-model.trim="form.sfrq"
        type="date"
        style="width:100%"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="施肥名称" prop="trpmc" class="f-pr f4">
      <el-input v-model.trim="form.trpmc">
        <span slot="suffix" class="f-fs24 f-pr10">···</span>
      </el-input>
      <div
        class="f-pa"
        @click="trpDialogVisable=true"
        style="top:0;right:0;left:0;bottom:0;opacity:0;"
      ></div>
    </el-form-item>
    <el-form-item label="施用方法" prop="syff">
      <el-radio-group v-model="form.syff">
        <el-radio :label="1">基肥</el-radio>
        <el-radio :label="2">种肥</el-radio>
        <el-radio :label="3">追肥</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="用量(亩/kg)" prop="yljff">
      <el-input v-model.trim="form.yljff" placeholder="请输入" type="number"></el-input>
    </el-form-item>
    <el-form-item label="施肥人" prop="sfr">
      <el-input v-model.trim="form.sfr" placeholder="请输入" :maxlength="10" ></el-input>
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
      <sel-trp :type="'sf'" style="margin:0 auto;" @selTrp="selTrp" @close="trpDialogVisable=false"></sel-trp>
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
      trpDialogVisable: false,
      disabled: false,
      oldncpmc: "",
      dialogVisible: false,
      dialogImageUrl: "",
      jcncpDialogVisable: false,
      rules: {
        sfrq: commonValidate,
        yljff: commonValidate,
        trpmc: commonValidate,
        sfr: commonValidate,
        syff: commonValidate
      }
    };
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          ncpmc: "",
          csmc: "",
          sfrq:timeFormat.one(new Date()),
          trpdm: "",
          trpmc: "",
          syff: 1,
          yljff: "",
          bz: "",
          czr: "",
          pic: "",
          sfr: "",
          imglists: [],
          attaUrl: "",
          zzjlId: "",
          sfjlId: ""
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
            sfrq,
            trpdm,
            syff,
            yljff,
            bz,
            czr,
            pic,
            sfr,
            sfjlId,
            attaUrl
          } = this.form;
          let { zzpc, ncpmc, csmc } = this.pcInfo;
          //用户参数
          let { scjyztId, qydm, userId } = this.userInfo;
          let params = {
            ncpmc,
            csmc,
            sfrq,
            trpdm,
            syff,
            yljff,
            bz,
            czr: userId,
            pic,
            sfr,
            scjyztId,
            pic: attaUrl,
            sfjlId,
            cjr: userId,
            zzjlId: this.pcInfo.zzjlId,
            zzpc: this.pcInfo.zzpc,
            qydm: this.pcInfo.qydm
          };
          fetch({
            url: "/scgl/ns/saveSfjl/",
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
      // rowlist.map(row=>{
      //   var {trpmc,trpdm,ggxh,dw,trppc,zttrpId} = row;
      //   //判断页面中是否有该商品
      //   if(this.form.listDetail.findIndex(item=>{return item.trpId===zttrpId})!=-1){
      //     return;
      //   }
      //   this.form.listDetail.push({
      //     "trpmc": trpmc,
      //     "trpdm": trpdm,
      //     "zttrpId":zttrpId,
      //     "trpSpec": ggxh,
      //     "trpUnit": dw,
      //     "trpdj":'',
      //     "trpcgsl":'',
      //     "ph":trppc
      //   })
      // })
      // this.
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



