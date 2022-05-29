/*编辑*/
<template>
  <el-form ref="form" :model="form" label-width="100px" class="form cpwh-edit" :rules="rules" status-icon>
    <div class="form-title f-fs18  f-tac f-mb30 f-mt30">新增投入品申请信息</div>
      <el-form-item label="类型" prop="nzdl">
        <el-select v-model="form.nzdl" placeholder="请选择类别" @change="getType">
          <el-option
            v-for="item in zldms"
            :key="item.sjzdBm"
            :label="item.sjzdMc"
            :value="item.sjzdBm"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="农资分类" prop="fenlei" class="f-pr f4">
        <el-input  v-model.trim="form.fenlei" @focus="open" placeholder="请选择农资分类" >
          <span slot="suffix" class="f-fs24 f-pr10">···</span>
        </el-input>
        <!-- <div class="f-pa" @click="open()" style="top:0;right:0;left:0;bottom:0;opacity:0;"></div> -->
      </el-form-item>
        <!-- <el-form-item label="农资分类"
                    prop="classification"
                    class="f-pr f4">
        <el-input v-model.trim="form.classification">
          <span slot="suffix"
                class="f-fs24 f-pr10">···</span>
        </el-input>
        <div class="f-pa"
             @click="chooseDialogVisable=true"
             style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item> -->

    <el-form-item label="商品名称" prop="spmc">
      <el-input v-model.trim="form.spmc"   :disabled="true"></el-input>
    </el-form-item>
      <el-form-item label="生产企业" prop="scdw">
          <el-autocomplete
              v-model="form.scdw"
              value-key="qymc"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearch1"
			        :disabled="true"
          >
          </el-autocomplete>
      </el-form-item>
    <el-form-item label="登记证号" prop="djzh">
      <el-input v-model.trim="form.djzh" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="规格型号" prop="spgg">
      <el-input v-model.trim="form.spgg" placeholder="请输入" :maxlength="16" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="单位" prop="unitId">
      <el-select v-model="form.unitId" placeholder="请选择单位" @change="getUnit">
        <el-option v-for="item in dwList" :key="item.id" :label="item.unitName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="品牌">
      <el-input v-model.trim="form.ppsb" placeholder="请输入" :maxlength="32" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="商品条码">
      <el-input v-model.trim="form.codes" placeholder="请输入" :maxlength="32" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="保质期（天）">
      <el-input v-model.trim="form.yxq" placeholder="请输入" type="number" :maxlength="32" ></el-input>
    </el-form-item>
    <el-form-item label="图片" prop="imgPaths">
      <el-upload :http-request="uploadImg" :before-upload="beforeAvatarUpload" :limit="9" action="''" :auto-upload="true" name="clientFile" :file-list="form.imgPathList" v-model="form.imgPaths" :on-preview="handlePictureCardPreview"   :before-remove="beforeRemove" multiple list-type="picture-card">
        <i class="el-icon-plus"></i>
      </el-upload>
      备注：最多上传9张，支持jpg，png格式图片
    </el-form-item>
    <el-form-item label="备注">
      <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model.trim="form.bz" placeholder="请输入" :maxlength="100" show-word-limit></el-input>
    </el-form-item>
    <el-form-item>
      <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
      <el-button round @click="closeForm(false)">取 消</el-button>
    </el-form-item>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible"  title="图片预览" width="800px" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
    <!-- 选择所属分类 -->
    <el-dialog title="选择农资分类" :append-to-body="true" :visible.sync="chooseDialogVisable" width="800px">
      <choose style="margin:0 auto;" :agriProdCode="form.nzdl" @selsup="selsup"></choose>
    </el-dialog>
  </el-form>
</template>
<script>
import { mapGetters } from 'vuex'
import { exec } from 'common/tools'
// import selSample from './selSample.vue'
import fetch from 'fetch/axios'
import choose from "./choose";

export default {
  components: {
    // selSample
	choose
  },
  data() {
    //使用了一个input没有的事件select  目的：只在最后提交之前触发客户名称是否存在的校验
    const ncpmcExist = (rule, value, callback) => {
      var params = {
        ncpMc: this.form.ncpmc,
        scjyztId: this.userInfo.scjyztId
      }
      //edit
      if (this.oldncpmc && this.form.ncpmc === this.oldncpmc) {
          callback();
      }
      this.$fetch.api_base.cpwh_exist(params).then((res) => {
        if (res.bean == 1) {
          callback(new Error('该农产品名称已存在'));
        } else {
          callback();
        }
      })
    };
    const zlmc = (rule, value, callback) => {
      if (this.form.zlmc) {
        callback();
      } else {
        callback(new Error());
      }
    }
      const commonValidate = { required: true, message: '必填项', trigger: 'blur' }
      const commonValidates = { required: true, message: '必填项', trigger: 'focus' }
    // const commonValidate1 = { required: true, message: '必填项', trigger: ['change','blur'] }
  
    return {
      disabled: false,
      oldncpmc: '',
      zldms:[],
      chooseDialogVisable:false,
      chooseDialogVisables:false,
      sjly:1,
      dwList:[],
      dialogVisible: false,
      dialogImageUrl: '',
      jcncpDialogVisable: false,
      testItems: [],
      rules: {
        fenlei: commonValidates,
        nzdl: commonValidate,
        nzdlMc: commonValidate,
        spgg: commonValidate,
        unitId: commonValidate,
        sptm: commonValidate,
        //imgPaths: commonValidate,
      }
    }
  },
  props: {
    form: {
      type: Object,
      default: function () {
        return {
          nzdl: "",
          nzdlMc: "",
          spmc: "",
          spgg: "",
          dw: "",
          unit:'',
          unitId: "",
          scdw: "",
          fl:"",
          djzh: "",
          sptm: "",
          delFlag: 1,
		      cjr: "",
          imgPaths: '',
		      imgPathList:[],
          fenlei:''
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created() {
    this.getType();
    // this.getLx();
    this.getDw();
  },
  components: {
    choose
  },
  methods: {
        querySearch1(queryString, cb) {
          fetch({
            url:'nzsyBizmanagement/listNyscqy/',
            method:'get',
            data:{
              findName:queryString,
              pageSize:20
            }
          }).then(res=>{
            cb(res.list);
          })
      },
    // 获取类型
    getType() {
      fetch({
        url: "/utilmodel/qy/getDataByCy/",
        method: "get",
        data: {
          sjzdLxbm: "TRPLX",
		      hy:this.userInfo.hydm
        }
      }).then(res => {
        this.zldms = res.list;
      });
    },
    getLx(val) {
      // this.getFenlei(val);
      // this.sjbm = val;
    },
    open() {
      if (!this.form.nzdl)  {
        return  this.$message.error("请检查是否选择类型！");
      }
      this.chooseDialogVisable = true;
    },
    // 获取分类
    getFenlei(val) {
      let params = {
        agriProdCode: val
      };
      this.$fetch.api_goods.get_spfl(params).then(res => {
        this.flList = res.list;
      });
    },
    getUnit(val) {
      var obj = {};
      obj = this.dwList.find(item => {
        return item.id === val;
      });
      this.form.unit = obj.unitName;
    },
    // 获取单位
    getDw() {
      fetch({
        url: "/nzsyUnit/listUnit/",
        method: "get",
        data: {
          type: "1"
        }
      }).then(res => {
        this.dwList = res.bean;
      });
    },
    selsup(row) {
      let { agriProdName, agriProdCode,  model,scdw, djzh,codes} = row;
      this.form.fenlei = agriProdName;//分类
	    this.form.spmc = agriProdName;
      this.form.fl = agriProdCode;
	    this.form.scdw = scdw;
	    this.form.djzh  = djzh ;
      this.chooseDialogVisable = false;
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        console.log(valid,this.form)
        if (valid) {
          //防止二次提交
          this.disabled = true;
          //新增字段
          let params = this.form;
          this.form.nzdlMc = this.nzdlMc;
          //用户参数
          let { bizId, bizName, areaCode, userId,ztmc,scjyztId,qyid} = this.userInfo;
          //系统时间
          Object.assign(params, {
            scdw: this.form.scdw,
            fl: this.form.fl, //分类:系统农资库提取10位农资编码
            sysUnitId: this.form.unitId,
            spzt: "1", 
            bizId:qyid,
            bizName:ztmc,
			      scjyztId:scjyztId,
            areaCode,
            agriProdType: this.form.nzdl,
            category: this.form.nzdlMc,
            agriProdName: this.form.spmc,
            model: this.form.spgg,
            unit: this.form.unit,
            djzh: this.form.djzh,
            codes: this.form.sptm,
            comment: this.form.bz,
            delFlag: 1,
            lx: 1,
            cjr:userId,
            createUserId: userId,
            modifyUserId: userId
          });
          // console.log(params);
          // this.disabled = false;
          // return false;
          var query = {
            url: "/nzsyBizAgriLib/saveNzsqb/",
            method: "post",
            data: params
          };
          fetch(query).then(res => {
            this.$message.success("操作成功！");
            this.closeForm(true);
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
    beforeRemove(file, fileList) {
      console.log('删除之前');
      var delIndex = fileList.findIndex(item => { return item.url === file.url });
      var imgPaths = this.form.imgPaths.split(',');
      imgPaths.splice(delIndex, 1);
      this.form.imgPaths = imgPaths.join(',');
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
      this.form.imgPaths = this.form.imgPaths && this.form.imgPaths != "" ? this.form.imgPaths + "," + response.bean : response.bean;
    },
    //类别选择好后，填充到页面
  }
}
</script>

<style>
.cpwh-edit .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
.cpwh-edit .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.cpwh-edit .el-date-editor.el-input,
.cpwh-edit .el-date-editor.el-input__inner {
  width: 100%;
}
</style>
