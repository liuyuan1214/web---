/*地块负责人*/
<template>
  <div class="dkfzr">
    <!-- 搜索头部 -->
    <page-name v-model="isEdit"></page-name>
    <div class="header f-df f-pr20">
      <div>
        <label>日期</label>
        <date-picker style="vertical-align:bottom" @selChange="(val)=>{selDateRange=val}"></date-picker>
        <label class="f-pl10">类型</label>
        <el-select v-model.trim="trplx" style="vertical-align:bottom" size="small" class="f-vab" placeholder="请选择" @change=getTableData clearable>
          <el-option v-for="item in trpTypes" :key="item.sjzdBm" :label="item.sjzdMc" :value="item.sjzdBm">
          </el-option>
        </el-select>
        <!-- </el-input>  -->
        <el-input placeholder="请输入投入品名称" style="vertical-align:bottom" @keyup.enter.native=getTableData v-model.trim=findName class="input-with-select" size="small"></el-input>
        <el-button type="primary" size="small" style="padding:5px 15px" @click=getTableData><i class="el-icon-search f-fs20"></i></el-button>
      </div>
    </div>
    <div class="f-mt20">
      <el-table class="table" :data="tableData" ref="stable" v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
        <el-table-column prop="trpmc" label="投入品名称">
        </el-table-column>
        <el-table-column prop="ggxh" label="规格型号">
        </el-table-column>
        <el-table-column prop="dw" label="单位">
        </el-table-column>
        <el-table-column prop="ghsmg" label="生产单位">
        </el-table-column>
        <el-table-column prop="dtotal" label="进货总量">
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" @prev-click="prevChange(-1)" @next-click="prevChange(1)" :current-page="pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { timeFormat } from 'common/tools'
import fetch from 'fetch/axios/'
export default {
  name: 'countInput',
  data() {
    return {
      isEdit: false,
      sfky: false,
      positCode: '',
      trplx: '',
      year: String(new Date().getFullYear()),  //组件一定要字符串，数字类型不行
      findName: '',
      trpTypes: [
        { label: '全部', value: '' },
        { label: '肥料', value: '1' },
        { label: '农药', value: '2' },
      ],
      pageNo: 1,
      pageSize: 10,
      totalCount: 1,
      tableData: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo',
    })
  },
  created() {
    this.getTableData();
    this.getTypes();
  },
  methods: {
    //获取table的数据
    getTableData() {
      this.loading = true;
      let { trplx, findName, selDateRange } = this;
      //合并组件的pageSize 和 pageNo 参数
      var query = {
        method: 'get',
        url: '/cggl/cg/trpTj/',
        data: {
          trplx,
          findName,
          scjyztId: this.userInfo.scjyztId,
          qydm: this.userInfo.qydm,
          startDate: selDateRange ? selDateRange[0] : '',
          endDate: selDateRange ? selDateRange[1] : '',
          pageSize: this.pageSize,
          pageNo: this.pageNo
        }
      };
      fetch(query).then(res => {
        let { data, pageNo, totalCount } = res.list;
        this.tableData = data;
        this.totalCount = totalCount;
        this.pageNo = pageNo;
        this.loading = false;

      })
    },
    getTypes() {
      var params = {
        sjzdLxbm: 'TRPLX',
        hy: this.userInfo.hydm
      }
      this.$fetch.api_base.cpwh_type(params).then(res => {
        this.trpTypes = res.list;
      })
    },
    //分页条的方法
    handleSizeChange(idx) {
      this.pageSize = idx || 10;
      this.pageNo = 1;
      this.getTableData();
    },
    handleCurrentChange(idx) {
      this.pageNo = idx;
      this.getTableData();
    },
    prevChange(isPrev) {
      if (isPrev > 0) {
        this.pageNo = this.pageNo + 1;
      } else {
        this.pageNo = this.pageNo - 1;
      }
      this.getTableData();
    }
  }
}
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

