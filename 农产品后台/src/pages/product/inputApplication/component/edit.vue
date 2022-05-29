/*编辑*/
<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      inline
      class="eidtform"
      :rules="rules"
      status-icon
    >
      <div class="form-title f-fs18 f-tac f-mt10 f-mb10">新增领用单信息</div>
      <div class="f-tar" style="margin-right:25px;">
        <el-form-item label="录单日期" style="margin-bottom:5px;">{{form.czsj.split(' ')[0]}}</el-form-item>
        <el-form-item label="订单号" style="margin-bottom:5px;">{{form.lydh}}</el-form-item>
      </div>
      <el-form-item label="领用日期" prop="lyrq" class="f4">
        <el-date-picker
          v-model.trim="form.lyrq"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="地块名称" prop="csmc" class="f4">
        <el-input v-model.trim="editrow.cdmc" placeholder="请输入" disabled :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="lxdh" class="f4">
        <el-input v-model.trim="form.lxdh" placeholder="请输入" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="客户地址" prop="xssdz" class="f2">
        <el-input v-model.trim="form.xssdz" placeholder="请输入" :maxlength="60"></el-input>
      </el-form-item>
      <el-form-item label="备注" class="f2">
        <el-input v-model.trim="form.bz" placeholder="请输入" :maxlength="60"></el-input>
      </el-form-item>
      <!-- 以上是订单的基础信息 -->
      <div class="f-df f-mb10">
        <div class="f-f1">
          订单总价：
          <span class="f-red">{{getTotalPrice}}元</span>
        </div>
        <div class="f-f1 f-tar">
          <el-button
            type="primary"
            round
            size="medium"
            @click="selNcpVisable=true"
            style="padding:9px 25px"
            icon="el-icon-plus
"
          >商 品</el-button>
        </div>
      </div>
      <el-table :data="form.listDetail" empty-text="请添加商品" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column label="产品名称" prop="trpmc"></el-table-column>
        <el-table-column label="规格" prop="ggxh"></el-table-column>
        <el-table-column label="单位" width="100" prop="dw"></el-table-column>
        <el-table-column label="数量" prop="sl" width="150">
          <template slot-scope="scope">
            <el-input-number
              :min="0"
              style="width:130px;text-align:left;"
              :controls="false"
              v-model.number="scope.row.sl"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="单价（元）" width="140" prop="dj">
          <template slot-scope="scope">
            <el-input-number
              :min="0"
              style="width:130px;text-align:left;"
              :controls="false"
              v-model.number="scope.row.dj"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="金额（元）" prop="num" width="120">
          <template slot-scope="scope">{{((scope.row.dj || 0)*(scope.row.sl || 0)).toFixed(2)}}</template>
        </el-table-column>
        <el-table-column label="批次信息" prop="zzpc"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deleteNcp(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="f-m10">制单人：{{form.zdr || userInfo.yhxm}}</div>
      <div class="f-mt20 f-tac">
        <el-button
          round
          type="primary"
          @click="submitForm"
          :disabled="disabled"
        >{{disabled?'提交中':'提 交'}}</el-button>
        <el-button round @click="closeForm(false)">取 消</el-button>
      </div>
    </el-form>
    <el-dialog title="选择投入品" :append-to-body="true" :visible.sync="selNcpVisable" width="950px">
      <sel-ncp
        style="margin:0 auto;"
        :selIds="selIds"
        v-if="selNcpVisable"
        @selNcp="selNcp"
        @close="selNcpVisable=false"
      ></sel-ncp>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import selNcp from "./selNcp";
import selSupname from "./selSupname";
import fetch from "fetch/axios/";
import timeFormat from "common/tools/timeFormat";
export default {
  components: {
    selNcp,
    selSupname
  },
  data() {
    function checkPhone(rule, value, callback) {
      if (!value) {
        return callback();
      }
      if (!/^1[34578]\d{9}$/.test(value)) {
        callback(new Error("手机号有误，请重新填写"));
      } else {
        callback();
      }
    }
    const commonValidate = {
      required: true,
      message: "必填项",
      trigger: "blur"
    };
    return {
      disabled: false,
      selNcpVisable: false,
      khmcDialogVisable: false,
      oldkhmc: "",
      tableData2: [],
      selIds: [],
      lyrq: null,
      rules: {
        lyrq: commonValidate,
        lxdh: { validator: checkPhone, trigger: "blur" }
      },
      form: {
        czsj: timeFormat.one(new Date()),
		zzjlId:'',
        lydh:'',
        sccsId:'',
        sccsMc:'',
        ztyhId:'',
        lyje:'',
        lyrq: timeFormat.one(new Date()),
        czy:'',
        czrq:'',
        bz:'',
        listDetail: []
      }
    };
  },
  props: {
    id: {
      type: [String, Number],
      default: ""
    },
    editrow:{
      type: Object,
      default: function(){
        return {};
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    }),
    getTotalPrice: function() {
      var array = this.form.listDetail || [];
      var totalPrice = 0;
      for (var item of array) {
        totalPrice += Number(((item.dj || 0) * (item.sl || 0)).toFixed(2));
      }
      return totalPrice.toFixed(2);
    }
  },
  created() {
    this.getPurchNo();
  },
  methods: {
    //初始化数据
    getOrderInfo(firstLoad) {
      fetch({
        url: "/Xsd/xs/getXsInfoById/",
        method: "get",
        data: {
          id: this.id
        }
      })
        .then(res => {
          res.bean ? (this.form = res.bean) : "";
          if (firstLoad) {
            this.form.listDetail.map(item => {
              this.selIds.push({ id: item.id });
              //请求数据获得余量

              this.getYl(item);
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //获取余量
    getYl(row) {
      fetch({
        url: "/Xsd/xs/getPckcbById/",
        method: "get",
        data: {
          id: row.sfsc,
          scjyztId: this.userInfo.scjyztId
        }
      }).then(res => {
        this.$set(row, "yl", Number(res.bean.yl) + Number(row.sl));
      });
    },
    //获取领用单号
    getPurchNo() {
      fetch({
        url: "/jcwldw/kh/getPch/",
        method: "get",
        data: {
          type: "lypch",
          year: new Date().getFullYear(),
          scjyztId: this.userInfo.scjyztId
        }
      }).then(res => {
        this.form.lydh = res.bean;
      });
    },
    //删除商品
    deleteNcp(index) {
      this.selIds.splice(index, 1);
      this.form.listDetail.splice(index, 1);
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.listDetail.length) {
            this.$message.error("请添加商品！");
            return false;
          }
          //防止二次提交
          this.disabled = true;
          //新增字段
          let {
            lydh,
			zzjlId,
            sccsId,
            sccsMc,
            ztyhId,
            lyje,
            lyrq,
            czy,
            czrq,
            bz,
            listDetail
          } = this.form;
          //用户参数
          let { scjyztId, userId, yhxm } = this.userInfo;
            var wareIds=[];
            var buyPrices=[];
            var buyNums=[];

            listDetail.forEach(item => {
                wareIds.push(item.wareId);
                buyPrices.push(item.dj);
                buyNums.push(item.sl);

            });
          let params = {
            scjyztId,
            lydh,
            sccsId:this.editrow.csmc,
            sccsMc:this.editrow.cdmc,
            ztyhId:userId,
            lyje:this.totalPrice,
            lyrq,
			czrq:lyrq,
            czy:yhxm,
            bz,
			zzjlId:this.editrow.zzjlId,
            wareIds:String(wareIds),
            buyPrices:String(buyPrices),
            buyNums:String(buyNums),
            
          };
          fetch({
            method: "post",
            url: "/cggl/cg/saveTrplyd/",
            data: params
          })
            .then(res => {
              this.$message.success("操作成功！");
              this.closeForm(true);
              this.disabled = false;
            })
            .catch(() => {
              this.$message.error("操作失败！");
              this.disabled = false;
            });
        } else {
          this.$message.error("请按要求填写");
          return false;
        }
      });
    },
    selNcp(rowlist) {
      rowlist.map(row => {
        var { trpmc, ncpid, ggxh, xgpc, dw, zttrpId, yl } = row;
        //判断页面中是否有该商品
        if (
          this.form.listDetail.findIndex(item => {
            return item.wareId === zttrpId;
          }) != -1
        ) {
          return;
        }
        this.selIds.push({ zttrpId: zttrpId });
        this.form.listDetail.push({
          trpmc: trpmc,
          wareId: zttrpId,
          ggxh: ggxh,
          zzpc: this.editrow.zzpc,
          dw: dw,
          dj: "",
          sl: ""
        });
      });
    },
    selsup(row) {
      let { khId, khmc, lxr, lxdh, dz } = row;
      this.form.khId = khId;
      this.form.khmc = khmc;
      this.form.lxr = lxr;
      this.form.lxdh = lxdh;
      this.form.xssdz = dz;
      this.khmcDialogVisable = false;
      this.$refs.form.validateField("khmc");
    },
    closeForm(fresh = false) {
      this.$emit("closeForm", fresh);
    }
  }
};
</script>

<style scoped lang="scss">
.eidtform {
  // width:100%;
  margin: 0 30px;
  box-sizing: border-box;
}
.f4 {
  width: calc(33.33% - 15px);
  box-sizing: border-box;
}
.f2 {
  width: calc(50% - 15px);
  box-sizing: border-box;
}
</style>

<style>
.eidtform .el-form-item .el-form-item__content {
  width: calc(100% - 100px);
}
.eidtform .el-date-editor.el-input,
.eidtform .el-date-editor.el-input__inner {
  width: 100%;
}
</style>

<style>
.border-red input {
  border-color: orangered !important;
}
</style>



