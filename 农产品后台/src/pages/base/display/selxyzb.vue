
<template>
<div class="f-pr">
  <div class="f-pa searchinput">
    请输入：<input v-model="searhkey" id="suggestId" class="el-input--mini el-input__inner" style="height:28px;line-height:28px;width:250px" placeholder="请输入地址" />
  </div>
  <div id="allmap"></div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
export default{
  data() {
    return {
      searhkey:'',
      map: null,
      mPoint: null
    }
  },
  props:{
    getpose:{
      type:Boolean,
      default:false
    },
    xy:{
      type:Object,
      default:function(){
        return { x:116.4,y:39.9 }
      }  
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.createMap(); // 引入初始化地图
    });
  },
  methods: {
    createMap() {
      this.map = new BMap.Map("allmap") // 创建Map实例
      this.$emit('map',this.map)
      // if(this.userInfo.areaName){
      //     this.mPoint = this.userInfo.areaName
      // }else{
          this.mPoint = new BMap.Point(this.xy.x || 116.4, this.xy.y|| 39.9) // 设置地图的区域
      // }
      this.$emit('point',this.mPoint)
      this.map.enableContinuousZoom() // 启用地图惯性拖拽，默认禁用
      this.map.addControl(new BMap.MapTypeControl()) // 添加地图类型控件
      this.map.addControl(new BMap.NavigationControl()) // 添加默认缩放平移控件
      this.map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
      this.map.centerAndZoom(this.mPoint,12) // 区域，及滚轮的伸缩
      this.map.addControl(new BMap.OverviewMapControl()) // 添加默认缩略地图控件
      let  that = this;
      function showInfo(e){
            that.$emit('selxyzb',{x:e.point.lng,y:e.point.lat})
      }
      this.map.addEventListener("click", showInfo);
      var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {
          "input" : "suggestId",
          "location" : this.map
        }
      );
      ac.addEventListener("onconfirm", (e)=> {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        this.searhkey= _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        this.setPlace();
      });
    },
    setPlace(){
      this.map.clearOverlays();    //清除地图上所有覆盖物
      var that = this;
      function myFun(){
        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
        that.map.centerAndZoom(pp, 18);
        that.map.addOverlay(new BMap.Marker(pp));    //添加标注
      }
      var local = new BMap.LocalSearch(this.map, { //智能搜索
        onSearchComplete: myFun
      });
      local.search(this.searhkey);
    }
  },
    destoryed(){
      this.map.removeEventListener('click');	
      this.map =null;
  },
}
</script>

<style scoped lang="scss">
#allmap {
  margin-top:10px;
  height: 100%;
}
.searchinput{
  z-index:5000;
  top:-35px;
}
</style>

<style>
  #tangram-suggestion--TANGRAM__1q-main{
  z-index:5000 !important;
}
</style>
