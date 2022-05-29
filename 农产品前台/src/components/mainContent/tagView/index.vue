<template>
  <div class="tags-view-container" style="position:relative;">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <!-- <router-link ref='tag' class="tags-view-item f-pr" :class="isActive(homePage)?'active':''" 
        :to="homePage.path">
        <span>{{homePage.title}}</span>
      </router-link> -->
      <router-link ref='tag' class="tags-view-item f-pr" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)"
        :to="tag" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
        <span>{{tag.title}}</span>
        <span   @click.prevent.stop='closeSelectedTag(tag)' class="f-pa close-ps">
            <i class="el-icon-close f-fs14" v-if="tag.title!=='首页'"></i>  
        </span>
      </router-link>
    </scroll-pane>
    <div class="contextmenus">
      <el-dropdown trigger="click" @command="handleCommand">

        <span class="el-dropdown-link dropdown cursor-pointer" style="display:inline-block;">
          <!-- 标签选项<i class="el-icon-arrow-down el-icon--right"></i> -->
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a"><span @click="closeSelectedTag">关闭当前</span></el-dropdown-item>
          <el-dropdown-item command="b"><span @click="closeOthersTags">关闭其他</span></el-dropdown-item>
          <el-dropdown-item command="c"><span @click="closeAllTags">关闭所有</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {Message, MessageBox} from 'element-ui';
import scrollPane from 'components/scrollPane'
export default {
  data() {
    return {
      homePage:{
        title:'首页',
        path:'/home',
      },
      visible: true,
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  components:{
    scrollPane,
  },
  computed: mapGetters({
    visitedViews:'getvisitedViews',
  }),
  watch: {
    $route() {
      // if(this.$route.path!=='/home'){
        this.addViewTags();
      // }
    }
  },
  mounted() {
    this.addViewTags()
  },
  methods: {
    generateRoute() {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    addViewTags() {
      const route = this.generateRoute()
      if (!route || route.path == '/manage/index') {
        return this.selectedTag = {}
      }
      this.selectedTag = route;
      this.$store.dispatch('addVisitedViews', route)
      this.$nextTick(()=>{
        this.$refs.scrollPane.moveToTarget(this.$refs.tag[this.$refs.tag.length-1].$el);
      })
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el)
            break
          }
        }
      })
    },
    closeSelectedTag(tag) {
      const view = tag || this.selectedTag
      if(view.path == '/manage/index' || view.path == undefined){
        return Message('请选择标签页关闭')
      }
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    closeOthersTags() {
      if(this.$route.path == '/home'){
        this.$store.dispatch('delAllViews')
        return 
      }
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/home')
    },
    openMenu(tag, e) {
      this.visible = true
      this.selectedTag = tag
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      this.left = e.clientX - offsetLeft + 15 // 15: margin right
      this.top = e.clientY
    },
    closeMenu() {
      this.visible = false
    },
      handleCommand(type){
      if(type == 'a'){
        this.closeSelectedTag()
        this.$nextTick(()=>{
          this.$refs.scrollPane.moveToTarget(this.$refs.tag[this.$refs.tag.length-1].$el);
        })
      }
      if(type == 'b'){
        this.closeOthersTags()
        this.$nextTick(()=>{
        this.$refs.scrollPane.moveToTarget(this.$refs.tag[0].$el);
      })
      }
      if(type == 'c'){
        this.closeAllTags()
        this.$nextTick(()=>{
        this.$refs.scrollPane.moveToTarget(this.$refs.tag[0].$el);
      })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.tags-view-container {
  display:flex;
  border-bottom: 2px solid #ff8800;
  background: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    display:flex;
    height: 45px;
    padding-top:8px;
    box-sizing:border-box;
    background:#ebebeb;
    .tags-view-item {
      display: inline-block;
      position: relative;
      text-decoration: none;
      line-height: 37px;
      padding:0 40px 0 15px;
      box-sizing:border-box;
      font-size:16px;
      color:#333333;
      margin-right:1px;
      overflow:hidden;
      background: #fff;
      &:first-of-type {
        margin-left: 15px;
        width:100px;
        padding:0;
        text-align:center;
      }
      &.active {
        background-color: #ff8800;
        color: #fff;
        .close-ps:hover .el-icon-close{
          background: #efb573;
        }
      }
    }
  }
  .contextmenus{
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    // background:#ff8800
    box-shadow: -2px 0 15px 2px rgba(0,0,0,.1);
    .dropdown{
      background:#ff8800;
      color:#fff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 16px;
      cursor:pointer;
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }

}
</style>

<style lang="scss">
.tags-view-wrapper {
  .tags-view-item {
    .close-ps{
      top:0;
      right:10px;
      .el-icon-close {
        width: 19px;
        height: 19px;
        vertical-align: 3px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        &:before {
          display: inline-block;
          vertical-align: -3px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
}

</style>
