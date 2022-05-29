/*编辑*/
<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      inline
      class="eidtform"
    >
      <div class="form-title f-fs18 f-tac f-mt10 f-mb10">进货订单</div>
      <div class="f-tar" style="margin-right:25px;">
        <el-form-item label="录单日期" style="margin-bottom:5px;">{{form.addTime &&form.addTime.split(' ')[0]}}</el-form-item>
        <el-form-item label="订单号" style="margin-bottom:5px;">{{form.saleSno}}</el-form-item>
      </div>
      <el-form-item label="供应商" prop="khmc" class="f-pr f3">
        <el-input readonly v-model.trim="form.khmc">
        </el-input>
      </el-form-item>
      <el-form-item label="进货日期" prop="saleDate" class="f3">
        <el-date-picker
		  readonly
          v-model.trim="form.saleDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="联系人" class="f3">
        <el-input readonly v-model.trim="form.contanct" ></el-input>
      </el-form-item>
	        <el-form-item label="联系电话" class="f3">
        <el-input readonly v-model.trim="form.tel" ></el-input>
      </el-form-item>
      <!-- 以上是订单的基础信息 -->
      <el-table :data="form.listDetail" empty-text="无商品" style="width: 100%;margin-bottom:10px;">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <!--<el-table-column label="商品编号" prop="trpdm" ></el-table-column>-->
        <el-table-column label="投入品名称" prop="agriName" ></el-table-column>
        <el-table-column label="规格型号" prop="model" ></el-table-column>
        <el-table-column label="单位" prop="unit" width="100"></el-table-column>
        <el-table-column label="数量" prop="saleNum" width="100">
          <template slot-scope="scope">
            <el-input type="number" v-positiveNumber v-model.number="scope.row.saleNum"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单价（元）" prop="salePrice" width="100">
          <template readonly slot-scope="scope">
            <el-input type="number" v-positiveNumber v-model.number="scope.row.salePrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="金额（元）" prop="num" width="100">
          <template readonly slot-scope="scope">{{((scope.row.salePrice || 0)*(scope.row.saleNum || 0)).toFixed(2)}}</template>
        </el-table-column>
        <el-table-column label="生产批次" width="200" prop="pch">
          <template slot-scope="scope">
            <el-input readonly type="number" v-positiveNumber v-model.number="scope.row.pch"></el-input>
          </template>
        </el-table-column>
      </el-table>
       <el-form-item label="折扣率（%）" prop="zklv" class="f-pr f4">
        <el-input readonly v-model.trim="form.zklv">
        </el-input>
      </el-form-item>
       <el-form-item label="折扣金额" prop="zkje" class="f-pr f4">
        <el-input readonly v-model.trim="form.zkje">
        </el-input>
      </el-form-item>
      <el-form-item label="折前价总额" class="f4">
        <el-input readonly v-model.trim="form.zhjze" ></el-input>
      </el-form-item>
      <el-form-item label="折后价总额" class="f4">
        <el-input readonly v-model.trim="form.zhjze" ></el-input>
      </el-form-item>
      <div class="f-m10">制单人：{{form.zdr || userInfo.yhxm}}</div>
      <div class="f-mt20 f-tac">
        <el-button
          round
          type="primary"
          @click="submitForm"
          :disabled="disabled"
        >{{disabled?'提取中':'提 取'}}</el-button>
         <el-button
          round
          type="danger"
          @click="invalidOperate"
          :disabled="invalidDisabled"
        >{{invalidDisabled?'作废中':'作 废'}}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import fetch from "fetch/axios/";
import timeFormat from "common/tools/timeFormat";
export default {
  data() {
    return {
      disabled: false,
      invalidDisabled:false,
      form: {}
    };
  },
  props: {
    id: {
      type: [Number,String],
      default: ''
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  watch:{
    id:{
      handler:function(){
        this.getOrderInfo()
      },
      immediate:true
    }
  },
  methods: {
    getOrderInfo() {
      fetch({
        url: '/nzsySale/getSaleInfoById/',
        method: "get",
        data: {
          id: this.id,
		  type:0
        }
      })
        .then(res => {
          //获取到的数据给form赋值
          this.form = res.bean;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //提取函数，与作废类似
    submitForm() {
      this.disabled = true;
      fetch({
        url: "/cggl/cg/tqSaleInfotoPurch/",
        method: "POST",
        data: {
          saleId: this.id,
		  scjyztId:this.userInfo.scjyztId,
		  createUserId:this.userInfo.userId,
        }
      })
        .then(res => {
            //提取成功

                //告诉上一页，需要关闭页面了
                this.$message.success('提取成功！')
                this.$emit('close')

            this.disabled = false;
            // if(res.bean ==1){
            //     //告诉上一页，需要关闭页面了
            //     this.$message.success('提取成功！')
            //     this.$emit('close')
            // } else if('其他的可能性'){
            //     //其他可能性的处理
            // }
          
        })
        .catch(() => {
          this.disabled = false;
        });  
    },
      //请求后台，作废单子
    invalidOperate() {
      this.invalidDisabled=true;
      fetch({
        url: "/nzsySale/updateSaleInfoById/",
        method: "POST",
        data: {
          saleId: this.id,
		  zt:4,
        }
      })
        .then(res => {
            //提取成功

                //告诉上一页，需要关闭页面了
                this.$message.success('作废成功！')
                this.$emit('close')

            // if(res.bean ==1){
            //     //告诉上一页，需要关闭页面了
            //     this.$message.success('提取成功！')
            //     this.$emit('close')
            // } else if('其他的可能性'){
            //     //其他可能性的处理
            // }
          this.invalidDisabled=false;
          
        })
        .catch(() => {
          this.invalidDisabled=false;
        }); 
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
.f3 {
  width: calc(25% - 15px);
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



