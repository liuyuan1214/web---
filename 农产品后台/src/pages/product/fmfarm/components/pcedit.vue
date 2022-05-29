<template>
  <div>
    <div v-if="!isEditOperate">
      <div class="farm-record">
        <!-- 批次信息 -->
        <!--  <div class="subtitle">批次信息</div>-->
        <pc-info :form="form"></pc-info>
        <div class="subtitle f-mt10" v-if="form.zt==1 && page==='farm'">日常操作</div>
        <!-- <div class="farm-operate">
            <el-button @click="operate('fx',{})">蜂 箱</el-button>
            <el-button  @click="operate('my',{})">免 疫</el-button>
            <el-button  @click="operate('cm',{})">采 蜜</el-button>
            <el-button  @click="operate('gm',{})">割 蜜</el-button>
            <el-button  @click="operate('cs',{})">摇 蜜</el-button>
        </div> -->
        <div class="f-df " v-if="form.zt==1 && page==='farm'">
          <div class="base-operate f-cp" @click="operate(item.operate,{})" v-for="(item,index) in operations"
               :key="index">
            <div class="f-fs20"><img :src="`./static/fm/p${index+1}.png`" alt="">{{item.title}}</div>
          </div>
        </div>
        <div class="subtitle f-mt10">养殖档案</div>
        <div class="tabs">
<!--          <div @click="changeTab(1)" :class="[curTab==1?'tab-active':'']">时间轴</div>-->
          <div @click="changeTab(2)" :class="[curTab==2?'tab-active':'']">档案详情</div>
        </div>
        <div v-show="curTab==1">
          <timeline></timeline>
        </div>
        <div v-show="curTab==2" class="table-container">
          <fx-table @operate="operate" ref="fx">蜂箱记录</fx-table>
          <my-table @operate="operate" ref="my">免疫记录</my-table>
          <cm-table @operate="operate" ref="cm">采蜜记录</cm-table>
          <gm-table @operate="operate" ref="gm">割蜜记录</gm-table>
          <cs-table @operate="operate" ref="cs">摇蜜记录</cs-table>
        </div>
      </div>
    </div>
    <div v-if="isEditOperate">
      <operate-farm :edittype="edittype" :form="operateRow" @closeForm="closeForm"></operate-farm>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  //引入页面的组件
  import pcInfo from './components/pcInfo';
  import operateFarm from './operateForm/index.vue'


  import fxTable from './pcTable/fxTable.vue'
  import cmTable from './pcTable/cmTable.vue'
  import myTable from './pcTable/myTable.vue'
  import gmTable from './pcTable/gmTable.vue'
  import csTable from './pcTable/csTable.vue'

  import timeline from './components/timeline.vue'

  export default {
    //将批次号注入所有子组件
    provide() {
      return {
        zzpc: this.form.zzpc,
        pcInfo: this.form,
        checkRow: this.checkRow,
        pageName: this.page,
      }
    },
    components: {
      pcInfo,
      operateFarm,
      fxTable,
      csTable,
      cmTable,
      gmTable,
      myTable,
      timeline
    },
    data() {
      return {
        operations: [
          {title: "蜂 箱", operate: 'fx'},
          {title: "免 疫", operate: 'my'},
          {title: "采 蜜", operate: 'cm'},
          {title: "割 蜜", operate: 'gm'},
          {title: "摇 蜜", operate: 'cs'}
        ],
        curTab: 2,
        edittype: 'fx',
        isEditOperate: false,
        operateRow: {}
      }
    },
    props: {
      form: {
        type: Object,
        default: function () {
          return {}
        }
      },
      checkRow: {
        type: Object,
        default: function () {
          return {};
        }
      },
      page: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      })
    },
    methods: {
      operate(info, row = {}) {
        this.edittype = info;
        if (JSON.stringify(row) != '{}') {
          console.log(row);
          if (info == 'gm') {
            var imglists = row.imagesUrl ? row.imagesUrl.split(',') : [];
          } else {
            var imglists = row.attaUrl ? row.attaUrl.split(',') : [];
          }
          imglists.forEach((item, index) => {
            imglists[index] = {"name": index + '.jpg', "url": item};
          })
        }
        row.imglists = imglists;
        this.operateRow = row;
        this.isEditOperate = true;
      },
      closeForm() {
        this.isEditOperate = !this.isEditOperate;
      },
      changeTab(val) {
        this.curTab = val;
      }
    }
  }
</script>
<style scoped lang="scss">
  .subtitle {
    height: 35px;
    margin: 20px 0 20px 0;
    line-height: 35px;
    font-size: 18px;
    color: #fff;
    padding: 0 20px;
    display: inline-block;
    background: #417f04;
    border-top-right-radius: 18px;
  }

  .base-operate {
    border-radius: 10px;
    height: 60px;
    line-height: 60px;
    width: 170px;
    margin-right: 20px;
    color: #fff;
    text-align: center;
    font-size: 20px;
    width: 130px;
    background: #a9cd06;

    img {
      vertical-align: middle;
      width: 35px;
      margin-right: 5px;
    }
  }

  .farm-operate button {
    padding-right: 20px;
    padding-left: 20px;
  }

  .tabs {
    width: 150px;
    /*width: 300px;*/
    display: flex;
    background: aliceblue;
    line-height: 40px;
    text-align: center;
    cursor: pointer;

    & > div {
      flex: 1;
    }

    .tab-active {
      background: #679936;
      color: #fff;
    }
  }
</style>
