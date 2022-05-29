/*sf*/
<template>
    <ul class="time-axis" v-if="timelineData.length">
<li class="time-axis-item" v-for="(item,index) in timelineData" :key="index">
  <div class="time-axis-date"> 
    {{item.fsrq && (index>0 && item.fsrq===timelineData[index-1].fsrq?' ':item.fsrq.split('-').splice(1).join('-'))}}
    <span></span>
  </div>
  <div class="f-df">
    <div style="width:80px;">
      {{item.tp}}
    </div>
  <div class="f-f1">
    <div class="time-axis-content">
    {{item.nr}}
    </div>
    <p class="time-axis-images" v-if="item.imglists && item.imglists.length">
        <img :src="src" alt="" v-for="(src,index) in item.imglists.slice(0,3)" :key="index">
        <span v-if="item.imglists.length>3" @click="moreImg(item.imglists)">全部图片</span>
    </p>
    <div class="f-mb20" v-else></div>
  </div>
  </div>
</li>
<el-dialog
  title="提示"
  :visible.sync="moreimgDialog"
  width="900px">
  <div>
    <img :src="src" class="more-imgs" alt="" v-for="(src,index) in curImglist" :key="index">
    <!-- <img :src="src" class="more-imgs" alt="" v-for="(src,index) in curImglist.slice(4)" :key="index"> -->
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="moreimgDialog = false">取 消</el-button>
    <el-button type="primary" @click="moreimgDialog = false">确 定</el-button>
  </span>
</el-dialog>
</ul>

</template>

<script>
import { mapGetters } from "vuex";
import fetch from "fetch/axios/";
export default {
  inject: ["zzpc"],
  data() {
    return {
      //table参数
      loading: false,
      totalCount: 0,
      curImglist:[],
      moreimgDialog:false,
      timelineData:[]
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    }),
    lxtext(val){
        return val
    }
  },
  created() {
    this.getData();
  },
  methods: {
    /*
     *获取table的数据
     */
    getData() {
      var query = {
        method: "get",
        url: "/scgl/ns/GetSjz/",
        data: {
          zzpc: this.zzpc
        }
      };
      fetch(query)
        .then(res => {
          if(res.list){
            res.list.forEach(item=>{
              item.imglists = item.imagesUrl ? item.imagesUrl.split(',') : [];
            })
            this.timelineData = res.list;
          }
        })
    },
    moreImg(imglists){
      this.moreimgDialog=true;
      this.curImglist = imglists    
    }
  }
};
</script>


<style scoped lang="scss">
.time-axis {
    margin: 20px 40px;
    width:1000px;
    padding: 0;
    position: relative;
}
.time-axis:before {
    content: '';
    position: absolute;
    left: 117px;
    top: 15px;
    width: 4px;
    height: 100%;
    background-color: #a9cd06;
}
.time-axis-item {
    list-style: none;
    padding-left: 150px;
    position: relative;
    line-height: 30px;
    font-size: 14px;
    color: #141414;
}
.time-axis-images{
    vertical-align:middle;
}
.time-axis-images img,.time-axis-images span{
    width:100px;
    height:100px;
    margin-right:10px;
    margin-bottom:10px;
    display:inline-block;
    background:#ededed;
    line-height: 100px;
    text-align: center;
    vertical-align:middle;
}
.more-imgs{
    width:100px;
    height:100px;
    margin-right:10px;
    margin-bottom:10px;
}
.time-axis-date {
    position: absolute;
    width:80px;
    text-align:right;
    font-size:18px;
    padding-top:2px;
    color:#417f04 !important;
    left: 0;
    top: 0;
    color: #666;
}
.time-axis-date span {
    position: absolute;
    right: -49px;
    top: 20%;
    display: block;
    width: 13px;
    height: 13px;
    border: 4px solid #417f04;
    border-radius: 100%;
    background-color: #417f04;
}
.time-axis-date span:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 7px;
    height: 7px;
    margin: auto;
    background-color: #a9cd06;
    border: 2px solid #a9cd06;
    border-radius: 100%;
}
</style>