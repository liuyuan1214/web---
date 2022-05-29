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
      <div class="form-title f-fs18 f-tac f-mt10 f-mb10">{{id?'编辑':'新增'}}投入品采购订单</div>
      <div class="f-tar" style="margin-right:25px;">
        <el-form-item label="录单日期" style="margin-bottom:5px;">{{form.cjsj &&form.cjsj.split(' ')[0]}}</el-form-item>
        <el-form-item label="订单号" style="margin-bottom:5px;">{{form.jhdh}}</el-form-item>
      </div>
      <el-form-item label="供应商单位" prop="ghsmc" class="f-pr f4">
        <el-input v-model.trim="form.ghsmc">
          <span slot="suffix" class="f-fs24 f-pr10">···</span>
        </el-input>
        <div
          class="f-pa"
          @click="ghsmcDialogVisable=true"
          style="top:0;right:0;left:0;bottom:0;opacity:0;"
        ></div>
      </el-form-item>
      <el-form-item label="采购日期" prop="jhrq" class="f4">
        <el-date-picker
          v-model.trim="form.jhrq"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="联系人" class="f4">
        <el-input v-model.trim="form.jbr" placeholder="请输入" :maxlength="30" ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" class="f4">
        <el-input v-model.trim="form.lxdh" placeholder="请输入" :maxlength="30" ></el-input>
      </el-form-item>
      <el-form-item label="供应商地址" class="f2">
        <el-input v-model.trim="form.dz" placeholder="请输入" :maxlength="60" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="备注" class="f2">
        <el-input v-model.trim="form.bz" placeholder="请输入" :maxlength="60" show-word-limit></el-input>
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
          >投入品</el-button>
        </div>
      </div>
      <el-table :data="form.listDetail" empty-text="请添加商品" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <!--<el-table-column label="商品编号" prop="trpdm" ></el-table-column>-->
        <el-table-column label="农产品名称" prop="trpmc" ></el-table-column>
        <el-table-column label="规格" prop="ggxh" ></el-table-column>
        <el-table-column label="单位" prop="dw" width="100"></el-table-column>
        <el-table-column label="数量" prop="sl" width="100">
          <template slot-scope="scope">
            <el-input type="number" v-positiveNumber v-model.number="scope.row.sl"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单价（元）" prop="trpdj" width="100">
          <template slot-scope="scope">
            <el-input type="number" v-positiveNumber v-model.number="scope.row.trpdj"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="金额（元）" prop="num" width="100">
          <template slot-scope="scope">{{((scope.row.trpdj || 0)*(scope.row.sl || 0)).toFixed(2)}}</template>
        </el-table-column>
        <el-table-column label="生产批次" width="200" prop="ph">
          <template slot-scope="scope">
            <el-input type="number" v-positiveNumber v-model.number="scope.row.ph"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
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
    <el-dialog title="选择商品" :append-to-body="true" :visible.sync="selNcpVisable" width="950px">
      <sel-ncp
        style="margin:0 auto;"
        :selIds="selIds"
        @selNcp="selNcp"
        v-if="selNcpVisable"
        @close="selNcpVisable=false"
      ></sel-ncp>
    </el-dialog>
    <el-dialog
      title="选择供应商"
      :append-to-body="true"
      :visible.sync="ghsmcDialogVisable"
      width="950px"
    >
      <sel-supname  style="margin:0 auto;" @selsup="selsup"></sel-supname>
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
      ghsmcDialogVisable: false,
      oldkhmc: "",
      tableData2: [],
      selIds: [],
	  delIds:[],
      jhrq: null,
      rules: {
        jhrq: commonValidate,
        ghsmc: commonValidate,
        supTel: { validator: checkPhone, trigger: "blur" }
      },
      form: {
        jhzbId: "",
        cjsj:timeFormat.one(new Date()),
        jhrq:timeFormat.one(new Date()),
        ghsdm: "",
        ghsmc: "",
        jbr: "",
        zje: "",
        zt: "1",
        bz: "",
        cjr: "",
        zdr: "",
        jhdh: "",
        lxdh: "",
        dz: "",
        listDetail: []
      }
    };
  },
  props: {
    id: {
      type: [String, Number],
      default: ""
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
    }),
    getTotalPrice: function() {
      var array = this.form.listDetail || [];
      var totalPrice = 0;
      for (var item of array) {
		totalPrice += Number(((item.trpdj || 0) * (item.sl|| 0)).toFixed(2));
      }
      return totalPrice.toFixed(2);
    }
  },
  created() {
    if (this.id) {
      this.getOrderInfo();
    } else {
      this.getPurchNo();
    }
  },
  methods: {
    //初始化数据
    getOrderInfo() {
      fetch({
        url: "/cggl/cg/getJhInfoById/",
        method: "get",
        data: {
          id: this.id
        }
      })
        .then(res => {
          res.bean ? (this.form = res.bean) : "";
          for (var item of res.bean.listDetail) {
            this.selIds.push({ zttrpId: item.zttrpId });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getPurchNo() {
      fetch({
        url: "/cggl/cg/getTrpPurchSno/",
        method: "get",
        data: {
          date: new Date().getFullYear(),
          companyId: this.userInfo.scjyztId
        }
      }).then(res => {
        this.form.jhdh = res.bean;
      });
    },
    //删除商品
    deleteNcp(index) {
      this.selIds.splice(index, 1);
        var delItem = this.form.listDetail.splice(index,1);
		if(delItem [0] && delItem[0].jhjlId){
		this.delIds.push(delItem[0].jhjlId)	;	
		}
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.listDetail.length) {
            this.$message.error("请添加商品！");
            return false;
          }
          for (var item of this.form.listDetail) {
            
            if (item.sl <= 0 || item.trpdj <= 0) {
              this.$message.error(
                item.sl < 1 ? "商品数量不能小于0！" : "商品价格不能小于0！"
              );
              return false;
            }
            if (item.ph==''||item.ph==null) {
              this.$message.error(
                "请输入生产批次！"
              );
              return false;
            }
          }
          //防止二次提交
          this.disabled = true;
          //新增字段
          let {
            jhzbId,
            jhrq,
            ghsdm,
            ghsmc,
            jbr,
            zje,
            zt,
            bz,
            cjr,
            zdr,
            lxdh,
            dz,
            jhdh,
            trpdm,
            ggxh,
            dw,
            listDetail
          } = this.form;
          //用户参数
          let { scjyztId, ztdm, userId, yhxm } = this.userInfo;
          var trpIds = [];
          var trpdjs = [];
          var trpcgsls = [];
		  var detailIds=[];
          var trppcs = [];
          listDetail.forEach(item => {
            trpIds.push(item.zttrpId);
            trpdjs.push(item.trpdj);
			detailIds.push(item.jhjlId);
            trpcgsls.push(item.sl);
            trppcs.push(item.ph);
          });
          let params = {
            jhzbId,
            jhdh,
            jhrq,
            ghsdm,
            ghsmc,
            jbr,
            lxdh,
            dz,
            zt: 1,
            bz,
            cjr: cjr ? cjr : userId,
            zdr: zdr ? zdr : yhxm,
            zje: this.getTotalPrice,
			delIds:String(this.delIds),
			detailIds:String(detailIds),
            trpIds: String(trpIds),
            trpdjs: String(trpdjs),
            trpcgsls: String(trpcgsls),
            trppcs: String(trppcs),
            trpdm,
            scjyztId,
            ztdm,
          };
          fetch({
            method: "post",
            url: "/cggl/cg/saveJhzb",
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
        var { trpmc, jhjlId, trpdm, ggxh, dw, ph, sl, zttrpId } = row;
        //判断页面中是否有该商品
        if (
          this.form.listDetail.findIndex(item => {
            return item.zttrpId === zttrpId;
          }) != -1
        ) {
          return;
        }
        this.selIds.push({ zttrpId: zttrpId });
        this.form.listDetail.push({
          trpmc: trpmc,
          trpdm: trpdm,
          zttrpId: zttrpId,
          jhjlId: 0,
          ggxh: ggxh,
          dw: dw,
          trpdj: "",
          trpcgsl: sl,
          sl: "",
          trppc: ph
        });
      });
    },
    selsup(row) {
      let { khId, khmc, lxr, lxdh, dz } = row;
      this.form.ghsdm = khId;
      this.form.ghsmc = khmc;
      this.form.jbr = lxr;
      this.form.lxdh = lxdh;
      this.form.dz = dz;
      this.$refs.form.validateField("ghsmc");
      this.ghsmcDialogVisable = false;
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
  width: calc(25% - 15px);
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



