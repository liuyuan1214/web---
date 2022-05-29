/*地块负责人*/
<template>
<div class="dkfzr">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
        <div>
            <label>类型</label>
            <el-select v-model.trim="khlx" size="small" class="f-vab" placeholder="请选择" @change="search">
                <el-option v-for="item in khtype" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input placeholder="单位名称" @keyup.enter.native="search" v-model.trim="khmc" class="input-with-select f-vab" size="small"></el-input>
            <el-button type="primary" size="small" style="padding:5px 15px" @click="search">
                <i class="el-icon-search f-fs20"></i>
            </el-button>
            <el-checkbox v-model.trim="sfky" class="f-ml20" @change="search">不显示停用的往来单位</el-checkbox>
        </div>
        <div class="f-f1 f-tar">
            <el-button type="primary" size="medium" @click="$emit('edit')" round style="padding:9px 25px">新 增</el-button>
        </div>
    </div>
    <s-table v-loading="loading" class="table" ref="stable" element-loading-text="拼命加载中" :tableData="tableData" :totalCount="totalCount" :getData="getTableData" :tableHeader="tableHeader"></s-table>
</div>
</template>

<script>
import {
    mapGetters
} from "vuex";
export default {
    data() {
        return {
            sfky: false,
            khlx: "",
            khmc: "",
            khtype: [{
                    label: "全部",
                    value: ""
                },
                {
                    label: "销售商",
                    value: "01"
                },
                {
                    label: "农资供应商",
                    value: "02"
                },
                {
                    label: "原料供应商",
                    value: "04"
                },
            ],
            //table参数
            tableHeader: [{
                    label: "单位名称",
                    prop: "khmc"
                },
                {
                    label: "单位简称",
                    prop: "khjc"
                },
                {
                    label: "类型",
                    prop: "lb",
                    formatter: (val) => {
                        return val == "01" ?
                            "销售商" :
                            val == "02" ?
                            "农资供货商" :
                            "农产品供应商";
                    },
                    width: "150",
                },
                {
                    label: "联系人",
                    prop: "lxr"
                },
                {
                    label: "联系电话",
                    prop: "lxdh"
                },
                {
                    label: "状态",
                    prop: "sfky",
                    width: "120",
                    "render-column": this.renderState,
                },
                {
                    label: "启用",
                    prop: "sfky",
                    width: "120",
                    "render-column": this.renderSfkyBtn,
                },
                {
                    label: "操作",
                    prop: "sfky",
                    width: "120",
                    "render-column": this.renderEdit,
                },
            ],
            loading: false,
            totalCount: 1,
            tableData: [],
        };
    },
    computed: {
        ...mapGetters({
            userInfo: "getUserInfo",
        }),
    },
    created() {
        this.getTableData();
    },
    methods: {
        /*render-column开始*/
        renderState(h, row) {
            return ( <
                span class = {
                    row.sfky == 1 ? "" : "f-red"
                } > {
                    row.sfky == 1 ? "可用" : "停用"
                } <
                /span>
            );
        },
        renderSfkyBtn(h, row) {
            return h("el-switch", {
                attrs: {
                    value: row.sfky == 1 ? true : false,
                    activeColor: "#090",
                },
                on: {
                    change: (value) => {
                        let {
                            khId,
                            sfky
                        } = row;
                        sfky = sfky == 1 ? 0 : 1;
                        this.$fetch.api_base.kh_status({
                            khId,
                            sfky
                        }).then((res) => {
                            row.sfky = sfky;
                        });
                    },
                },
            });
        },
        renderEdit(h, row) {
            return ( <
                el - button size = "mini"
                class = "edit"
                onClick = {
                    () => {
                        this.$emit("edit", row);
                    }
                } >
                编辑 <
                /el-button>
            );
        },
        /*render-column结束*/

        /*
         *获取table的数据
         *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
         *params请求参数
         */
        search() {
            this.$refs.stable.pageNo = 1;
            this.$refs.stable.getDataByPage();
        },
        getTableData(obj = {}) {
            this.loading = true;
            let {
                qyid,
                sfky,
                khmc,
                khlx
            } = this;
            let params = {
                qyid: this.userInfo.qyid,
                khmc: khmc,
            };
            if (sfky) params.sfky = 1;
            if (khlx) params.khlx = khlx;
            //合并组件的pageSize 和 pageNo 参数
            Object.assign(params, obj);
            this.$fetch.api_base
                .kh_list(params)
                .then((res) => {
                    let {
                        data,
                        pageNo,
                        totalCount
                    } = res.list;
                    this.tableData = data;
                    this.totalCount = totalCount;
                    this.currentPage = pageNo;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
    },
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
<style>
/* .table .el-button:hover{
  background:#ecf5ff;
  color:#60acff;
  border:1px solid #60acff;
} */
</style>
