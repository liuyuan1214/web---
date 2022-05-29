/*产品维护所属类别选择*/
<template>
  <div style="padding-bottom:70px;min-height:470px;">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
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
      <div class="f-f1 f-tar">
        <el-button
          type="primary"
          size="medium"
          @click="isAddSample=true"
          round
          style="padding:9px 25px"
        >新 增</el-button>
      </div>
    </div>
    <s-table
      v-loading="loading"
      class="table"
      ref="stable"
      element-loading-text="拼命加载中"
      :tableData="tableData"
      :totalCount="totalCount"
      :getData="getTableData"
      :tableHeader="tableHeader"
    ></s-table>
    <el-dialog title="新增种植作物" :append-to-body="true" :visible.sync="isAddSample" width="800px" :before-close="refreshData">
      <add-sample style="margin:0 auto;" v-if="isAddSample" @close="isAddSample"></add-sample>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import fetch from "fetch/axios/";
import addSample from "./addSample.vue";
export default {
  components: {
    addSample
  },
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
        { label: "作物名称", prop: "ncpmc" },
        { label: "大类", prop: "zlmc" },
        { label: "小类", prop: "ncpEjZlmc" },
        {
          label: "操作",
          width: "120",
          "render-column": (h, row) => {
            return (
              <el-button
                size="mini"
                class="edit"
                onClick={() => {
                  this.$emit("selSample", row);
                }}
              >
                选择
              </el-button>
            );
          }
        }
      ],
      loading: false,
      totalCount: 1,
      tableData: [],
      isAddSample: false
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created() {
    this.getTableData();
  },
  methods: {
    /*
     *获取table的数据
     *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
     *params请求参数
     */
    getTableData(obj = { pageSize: 10, pageNo: 1 }) {
      this.loading = true;
      let { searchkey } = this;
      var params = {
        ncpmc: searchkey,
        sfky: 1,
		zt:1,
        type: 1 //1    标记8位农产品代码
      };
      params.scjyztId = this.userInfo.scjyztId;
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      var query = {
        method: "get",
        url: "/jccpwh/cp/pageZtNcp/",
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
    refreshData(done){
        this.$refs.stable.getDataByPage();
        done();
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



