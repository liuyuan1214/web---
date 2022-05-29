/*产品维护所属类别选择*/
<template>
  <div style="padding-bottom:70px;min-height:470px;">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <el-select
          v-model.trim="zldm"
          size="small"
          class="f-vab f-mr20"
          style="width:150px;"
          placeholder="请选择大类"
          @change="ej='';getTypes('NCPEJFL')"
        >
          <el-option
            v-for="item in zldms"
            :key="item.sjzdBm"
            :label="item.sjzdMc"
            :value="item.sjzdBm"
          ></el-option>
        </el-select>
        <el-select
          v-model.trim="ej"
          size="small"
          class="f-vab f-mr20"
          style="width:150px;"
          placeholder="请选择小类"
          @change="getTableData({pageSize:10,pageNo:1})"
        >
          <el-option
            v-for="item in ejs"
            :key="item.sjzdBm"
            :label="item.sjzdMc"
            :value="item.sjzdBm"
          ></el-option>
        </el-select>
        <el-input
          :placeholder="'农产品名称'"
          style="vertical-align:bottom"
          @keyup.enter.native="getTableData"
          v-model.trim="searchkey"
          class="input-with-select"
          size="small"
        ></el-input>
        <el-button type="primary" size="small" style="padding:5px 15px;" @click="getTableData">
          <i class="el-icon-search f-fs20"></i>
        </el-button>
      </div>
    </div>
    <s-table
      v-loading="loading"
      class="table"
      ref="ncplist"
      element-loading-text="拼命加载中"
      :tableData="tableData"
      :totalCount="totalCount"
      :getData="getTableData"
      :tableHeader="tableHeader"
    ></s-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import fetch from "fetch/axios/";
export default {
  data() {
    return {
      ncpmc: "",
      zldm: "",
      ej: "",
      searchkey: "",
      zldms: [],
      ejs: [],
      //table参数
      tableHeader: [
        { label: "作物名称", prop: "ncpMc" },
        { label: "大类", prop: "ncpZlmc" },
        { label: "小类", prop: "ncpEjZlmc" },
        {
          label: "操作",
          width: "120",
          "render-column": (h, row) => {
            if (row.sftj == 0) {
              return (
                <el-button
                  type="success"
                  size="mini"
                  class="edit"
                  onClick={this.funSelect.bind(this, row)}
                >
                  添加
                </el-button>
              );
            } else if (row.sftj == 1) {
              return (
                <el-button
                  size="mini"
                  class="edit"
                  onClick={this.qxSelect.bind(this, row)}
                >
                  取消
                </el-button>
              );
            }
            return (
              <el-button
                type="success"
                size="mini"
                class="edit"
                onClick={this.tjSelect.bind(this, row)}
              >
                添加
              </el-button>
            );
          }
        }
      ],
      loading: false,
      totalCount: 1,
      tableData: [],
      isAddFzr: false
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created() {
    this.getTableData();
    this.getTypes("NCPLX");
  },
  methods: {
    /*
     *获取table的数据
     *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
     *params请求参数
     */
    getTableData(obj = { pageSize: 10, pageNo: 1 }) {
      this.loading = true;
      let { searchkey, zldm, ej } = this;
      var params = {
        ncpmc: searchkey,
        sfky: 1,
        nyVersion:this.userInfo.nyVersion,
        industryId: this.userInfo.industryId,
        zldm: zldm,
        lx: 0,
        ej: ej
      };
      params.scjyztId = this.userInfo.scjyztId;
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      var query = {
        method: "get",
        url: "/jccpwh/cp/getJcNcp/",
        data: params
      };
      fetch(query)
        .then(res => {
          let { data, pageNo, totalCount } = res.list;
          this.tableData = data;
          this.totalCount = totalCount;
          this.currentPage = pageNo;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //提取农产品
    funSelect(row) {
      this.hasSel = true;
      var query = {
        method: "post",
        url: "/jccpwh/cp/saveZtncpByJcncp/",
        data: {
          trpIds: row.agriProdId,
          scjyztId: this.userInfo.scjyztId,
          zldm: row.ncpZldm,
          zlmc: row.ncpZlmc,
          ncpdm: row.ncpDm,
          ncpmc: row.ncpMc,
          ggxh: row.ncpGgxh,
          dw: row.ncpDw,
          sl: row.ncpSl,
          Mdwzl: row.ncpMdwzl,
          zl: row.ncpZl,
          djfs: row.ncpDjfs,
          sfky: row.sfky,
          bz: row.bz,
		  dwzl: row.dwzl,
          ncpEjZldm: row.ncpEjZldm,
          ncpEjZlmc: row.ncpEjZlmc
        }
      };
      fetch(query)
        .then(res => {
          this.$message.success("提取成功！");
          //this.$emit("close", true);
          this.hasSel = false;
		  this.$refs.ncplist.getDataByPage();
        })
        .catch(() => {
          this.$message.error("提取失败，请联系管理员！");
          this.hasSel = false;
        });
    },
    //取消农产品
    qxSelect(row) {
      this.hasSel = true;
      var query = {
        method: "get",
        url: "/jccpwh/cp/QyJyZtncp/",
        data: {
          ncpdm: row.ncpDm,
          scjyztId: this.userInfo.scjyztId,
          lx: 0
        }
      };
      fetch(query)
        .then(res => {
          this.$message.success("取消成功！");
          //this.$emit("close", true);
          this.hasSel = false;
          this.$refs.ncplist.getDataByPage();
        })
        .catch(() => {
          this.$message.error("取消失败，请联系管理员！");
          this.hasSel = false;
        });
    },
    //再次添加农产品
    tjSelect(row) {
      this.hasSel = true;
      var query = {
        method: "get",
        url: "/jccpwh/cp/QyJyZtncp/",
        data: {
          ncpdm: row.ncpDm,
          scjyztId: this.userInfo.scjyztId,
          lx: 1
        }
      };
      fetch(query)
        .then(res => {
          this.$message.success("提取成功！");
          //this.$emit("close", true);
          this.hasSel = false;
		  this.$refs.ncplist.getDataByPage();
        })
        .catch(() => {
          this.$message.error("提取失败，请联系管理员！");
          this.hasSel = false;
        });
    },

        search(){
          this.$refs.stable.pageNo=1;
          this.$refs.stable.getDataByPage();
        },
    closeForm(isRefresh) {
      this.selSample = !this.selSample;
      if (isRefresh) {
        //更新table的数据
        this.getTableData();
      }
    },
    getTypes(typeText) {
      var params = {
        sjzdLxbm: typeText,
		nyVersion:this.userInfo.nyVersion,
        industryId: this.userInfo.industryId
      };
      if (typeText === "NCPEJFL") {
        params.zldm = this.zldm;
      }
      
      
     
      this.$fetch.api_base.cpwh_type(params).then(res => {
        this[typeText === "NCPLX" ? "zldms" : "ejs"] = res.list;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.input-with-select {
  width: 240px;
}
.ncp-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>



