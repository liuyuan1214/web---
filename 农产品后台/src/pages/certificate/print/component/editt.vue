<template>
  <el-form
    ref="form"
    :model="form"
    label-width="120px"
    class="form cpwh-edit"
    :rules="rules"
    status-icon
  >
    <div class="form-title f-fs18 f-tac f-mb30 f-mt30">新增合格证打印信息</div>
    <el-form-item label="开具日期" prop="kjrq">
      <el-date-picker
        class="input-item"
        v-model.trim="form.kjrq"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="挂码类型" prop="gmlx">
      <el-select v-model="form.gmlx" placeholder="请选择" @change="selgmlx">
        <el-option value="1" label="包装挂码"></el-option>
        <el-option value="2" label="采收挂码"></el-option>
        <el-option value="3" label="采购挂码"></el-option>
        <el-option value="4" label="采购包装挂码"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="种植批次/采购批次" prop="zzpc" class="f-pr">
      <el-input v-model="form.zzpc">
        <span slot="suffix" class="f-fs24 f-pr10">···</span>
      </el-input>
      <div class="f-pa" @click="selzzpc" style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
    </el-form-item>
    <el-form-item
      label="采收批次号"
      prop="cspch"
      class="f-pr"
      v-show="form.gmlx == '1'||form.gmlx == '2'"
    >
      <el-input v-model="form.cspch" disabled></el-input>
    </el-form-item>-->
    <el-form-item
      label="包装批次号"
      prop="bzpc"
      class="f-pr"
      v-show="form.gmlx == '1'||form.gmlx == '4'"
    >
      <el-input v-model="form.bzpc" disabled></el-input>-->
    </el-form-item>
    <el-form-item label="农产品名称" prop="ncpMc" class="f-pr">
      <el-input v-model="form.ncpMc"></el-input>
    </el-form-item>
    <el-form-item label="重量(kg)" prop="zl" class="f-pr">
      <el-input v-model="form.zl" type="number"></el-input>
    </el-form-item>

    <el-form-item label="生产单位" prop="scdw" class="f-pr">
      <el-input v-model="form.scdw"></el-input>
    </el-form-item>
    <el-form-item label="产地" prop="cd" class="f-pr">
      <el-input v-model="form.cd"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" prop="lxfs" class="f-pr">
      <el-input
        v-model="form.lxfs"
        onkeyup="this.value=this.value.replace(/[^\d]/g,'');"
        maxlength="11"
      ></el-input>
    </el-form-item>
    <el-form-item label="安全保障方式" prop="aqbzfs">
      <el-select v-model="form.aqbzfs" placeholder="请选择">
        <el-option
          v-for="item in aqbzfsList"
          :key="item.sjzdBm"
          :label="item.sjzdMc"
          :value="item.sjzdBm"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="打印数量" prop="dysl" class="f-pr">
      <el-input v-model="form.dysl" onkeyup="this.value=this.value.replace(/[^\d]/g,'');"></el-input>
    </el-form-item>
    <el-form-item label="尺寸选择" prop="ccsl">
      <el-select v-model="form.ccsl" placeholder="请选择">
        <el-option value="1" label="60*80"></el-option>
        <el-option value="2" label="60*50"></el-option>
      </el-select>
    </el-form-item>
     <el-form-item label="创建人ID" prop="cjr" class="f-pr">
      <el-input v-model="form.dysl" onkeyup="this.value=this.value.replace(/[^\d]/g,'');"></el-input>
    </el-form-item>ID
     <el-form-item label="打印机维护表ID" prop="dyjwhId" class="f-pr">
      <el-input v-model="form.dysl" onkeyup="this.value=this.value.replace(/[^\d]/g,'');"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        round
        type="primary"
        @click="submitForm"
        :disabled="disabled"
      >{{disabled?'打印中':'打 印'}}</el-button>
      <el-button round @click="closeForm(false)">取 消</el-button>
    </el-form-item>

    <el-dialog title="选择批次" width="900px" :visible.sync="zzpcDialogVisable">
      <sel-sample @selSample="selSample" :sampleType="form.gmlx"></sel-sample>
    </el-dialog>

    <el-dialog
      title="打印"
      width="750px"
      v-if="printDialog"
      :visible.sync="printDialog"
      @close="closeForm(false)"
    >
      <v-print :printBean="printBean"></v-print>
    </el-dialog>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import selSample from "./selSample.vue";
import vPrint from "./print.vue";
import fetch from "fetch/axios";
import timeFormat from "common/tools/timeFormat";

export default {
  components: {
    selSample,
    vPrint
  },
  data() {
    const commonValidate = {
      required: true,
      message: "必填项",
      trigger: "blur"
    };
    const commonValidateChange = {
      required: true,
      message: "必选项",
      trigger: "change"
    };

    return {
      disabled: false,
      zzpcDialogVisable: false,
      printDialog: false,
      aqbzfsList: [],
      printBean: {},
      isDisable: false,
      rules: {
        zzpc: commonValidateChange,
        gmlx: commonValidateChange,
        cspch: commonValidateChange,
        bzpc: commonValidateChange,
        ncpMc: commonValidate,
        kjrq: commonValidateChange,
        zl: commonValidate,
        scdw: commonValidate,
        cd: commonValidate,
        lxfs: commonValidate,
        aqbzfs: commonValidateChange,
        dysl: commonValidate,
        ccsl: commonValidateChange,
        cjr: commonValidate,
        dyjwhID: commonValidate
      }
    };
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          zzpc: "",
          gmlx: "",
          cspch: "",
          bzpc: "",
          ncpMc: "",
          kjrq: timeFormat.one(new Date()),
          zl: "",
          scdw: "",
          cd: "",
          lxfs: "",
          aqbzfs: "",
          dysl: "",
          ccsl: "",
          cjr: "",
          dyjwhID: ""
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
    this.getAqbzfsList();
    this.form.scdw = localStorage.getItem("ztmc");
    this.form.cd = localStorage.getItem("dz");
    this.form.lxfs = localStorage.getItem("lxdh");
    this.form.ccsl = "1";
    this.form.aqbzfs = "4";
  },
  methods: {
    getAqbzfsList() {
      fetch({
        url: "/utilmodel/qy/getAllData/",
          method: "get",
          data: {
            lxbm: "AQBZFS",
        }
      }).then(res => {
        this.aqbzfsList = res.list;
      });
    },
    selgmlx() {
      this.form.zzpc = "";
      this.form.ncpMc = "";
      this.form.cspch = "";
      this.form.bzpc = "";
      this.form.zl = "";
      this.form.scdw = '';
      this.form.cd = '';
      this.form.lxfs = '';
    },
    selzzpc() {
      console.log(this.form.gmlx);
      if (this.form.gmlx == undefined) {
        this.$message.error("请选择挂码类型");
        return false;
      } else {
        this.zzpcDialogVisable = true;
      }
    },

    selSample(row) {
      this.zzpcDialogVisable = false;
      if (this.form.gmlx == "1") {
        this.form.zzpc = row.zzpc;
        this.form.ncpMc = row.ncpMc;
        this.form.cspch = row.cspch;
        this.form.bzpc = row.packSno;
      } else if (this.form.gmlx == "2") {
        this.form.zzpc = row.zzpc;
        this.form.ncpMc = row.csncpmc;
        this.form.cspch = row.cspch;
       this.form.cd = row.sccsmc;
      } else if (this.form.gmlx == "3") {
        this.form.zzpc = row.batchno;
        this.form.ncpMc = row.wareName;
        this.form.scdw = row.companyName;
      } else {
        this.form.zzpc = row.zzpc;
        this.form.ncpMc = row.ncpMc;
        this.form.bzpc = row.packSno;
      }
    },

    submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          //防止二次提交
          this.disabled = true;
          let {
             zzpc,
             gmlx,
             cspch,
             bzpc,
             ncpMc,
             kjrq,
             zl,
             scdw,
             cd,
             lxfs,
             aqbzfs,
             dysl,
             ccsl
          } = this.form;
          if (Number(dysl) > 100) {
            this.$message.error("打印数量不能超过100张");
            this.disabled = false;
            return false;
          }
          //用户参数
          let { userId } = this.userInfo;
          let params = {
             zzpc,
             gmlx,
             cspch,
             bzpc,
             ncpMc,
             kjrq,
             zl,
             scdw,
             cd,
             lxfs,
             aqbzfs,
             dysl,
             ccsl,
             dyjwhID: dyjmc,
             cjr: userId
          };
          if (gmlx == "1") {
            params.cspch = this.form.cspch;
            params.bzpc = this.form.bzpc;
          } else if (gmlx == "2") {
            params.cspch = this.form.cspch;
          } else if (gmlx == "4") {
            params.bzpc = this.form.bzpc;
          }
          // params = {
          //   aqbzfs:"1",
          //   aqbzfsMc:"委托检测合格",
          //   bzpc:"24",
          //   ccsl:2,
          //   cd:"委托检测合格委托检测合格委托检测合格委托检测合格",
          //   cjr:112722,
          //   cjsj:"2020-04-03 10:15:20",
          //   codeEnd:"331125000000000002",
          //   codeStart:"331125000000000001",
          //   cspch:"1",
          //   dysl:2,
          //   ewm:null,
          //   ewmlist:[
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000001&m=484A8315AB31614D',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000002&m=FB2F837BBA31C288',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000021&m=E41FAD4F44946A74',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000054&m=DJ82IH29IHF28982',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000001&m=484A8315AB31614D',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000002&m=FB2F837BBA31C288',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000021&m=E41FAD4F44946A74',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000001&m=484A8315AB31614D',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000002&m=FB2F837BBA31C288',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000021&m=E41FAD4F44946A74',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000001&m=484A8315AB31614D',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000002&m=FB2F837BBA31C288',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000001&m=484A8315AB31614D',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000002&m=FB2F837BBA31C288',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000021&m=E41FAD4F44946A74',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000054&m=DJ82IH29IHF28982',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000001&m=484A8315AB31614D',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000002&m=FB2F837BBA31C288',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000021&m=E41FAD4F44946A74',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000001&m=484A8315AB31614D',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000002&m=FB2F837BBA31C288',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000021&m=E41FAD4F44946A74',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000001&m=484A8315AB31614D',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000002&m=FB2F837BBA31C288',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000001&m=484A8315AB31614D',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000002&m=FB2F837BBA31C288',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000021&m=E41FAD4F44946A74',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000054&m=DJ82IH29IHF28982',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000001&m=484A8315AB31614D',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000002&m=FB2F837BBA31C288',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000021&m=E41FAD4F44946A74',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000001&m=484A8315AB31614D',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000002&m=FB2F837BBA31C288',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000021&m=E41FAD4F44946A74',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000001&m=484A8315AB31614D',
          //     'http://127.0.0.1:8083/ncpwz3.1/sales/code-trace!orCodeTraceMa.action?c=331125000000000002&m=FB2F837BBA31C288',
          //   ],
          //   gmlx:1,
          //   id:0,
          //   kjrq:"2020-04-03 00:00:00",
          //   lxfs:"12344334455",
          //   ncpId:90932,
          //   ncpMc:"赤豆",
          //   qyId:176,
          //   qyLogo:null,
          //   qydm:"331125105",
          //   scdw:"12",
          //   scjyztId:70131,
          //   zl:123,
          //   zt:1,
          //   zzpc:"1331125014-18-015"
          // }
          //
          // var timearr = params.kjrq.replace(" ", ":").replace(/\:/g, "-").split("-");
          // var timestr = timearr[0]+"年"+ Number(timearr[1])+ "月" + timearr[2]+"日";
          // params.kjrq = timestr;
          //
          // this.printBean = params;
          // this.disabled=false;
          // this.printDialog=true;
          // return;
          fetch({
            method: "post",
            url: "/hgzdy/saveHgzdy/",
            data: params
          })
            .then(res => {
              var timearr = res.bean.kjrq
                .replace(" ", ":")
                .replace(/\:/g, "-")
                .split("-");
              var timestr =
                timearr[0] +
                "年" +
                Number(timearr[1]) +
                "月" +
                timearr[2] +
                "日";
              res.bean.kjrq = timestr;
              this.printBean = res.bean;
              this.printDialog = true;
              this.disabled = false;
            })
            .catch(res => {
              this.$message.error(res.errorMess);
              this.disabled = false;
            });
        } else {
          this.$message.error("请按要求填写");
          this.disabled = false;
          return false;
        }
      });
    },

    closeForm(fresh = false) {
      this.$emit("closeForm", fresh);
    }
  }
};
</script>

<style scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
