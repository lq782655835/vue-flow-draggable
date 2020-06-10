<template>
  <el-container class="indexWrap">
    <el-aside width="48px"
              class="fy_el-aside">
      <el-menu :default-active="sidebarComponentName"
               background-color="transparent"
               text-color="#9aaeba"
               active-text-color="#9aaeba"
               :collapse="true"
               @select="handleSelect">
        <el-menu-item index="home">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="ExperimentTree">
          <i class="el-icon-takeaway-box"></i>
          <span slot="title">实验</span>
        </el-menu-item>
        <el-menu-item index="ComponentTree">
          <i class="el-icon-magic-stick"></i>
          <span slot="title">组件</span>
        </el-menu-item>
        <el-menu-item index="setting">
          <i class="el-icon-setting"></i>
          <span slot="title">设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <div v-if="sidebarComponentName === 'home'">{{sidebarComponentName}}</div>
      <div v-if="sidebarComponentName === 'setting'">{{sidebarComponentName}}</div>
      <FlowChart v-if="isFlowChartView" :sidebarComponentName="sidebarComponentName"></FlowChart>
    </el-main>
  </el-container>
</template>

<script>
import FlowChart from './FlowChart.vue';

export default {
  components: { FlowChart },
  data() {
    return { sidebarComponentName: 'ExperimentTree' }; // 默认展示组件
  },
  computed: {
    isFlowChartView() {
      return ['ExperimentTree', 'ComponentTree'].includes(this.sidebarComponentName);
    },
  },
  methods: {
    handleSelect(name) {
      this.sidebarComponentName = name;
    },
  },
};
</script>

<style lang="scss">
.indexWrap{
  .fy_el-aside {
    background: #21232b;
    overflow-x: hidden;
    .el-menu--collapse {
      width: 48px;
      .el-menu-item {
        padding-left: 0 !important;
        padding: 0px !important;
        height: 48px;
        text-align: center;
        line-height: 48px;
        &:first-child {
          i {
            color: #fff !important;
          }
        }
        &.is-active {
          .el-tooltip {
            background: #121319;
            &::after {
              content: "";
              width: 3px;
              background: #00c1de;
              height: 48px;
              display: block;
              position: absolute;
              top: 0;
            }
          }
        }
        .el-tooltip {
          padding: 0 !important;
        }
      }
    }
  }
  .el-main{
    padding: 0;
  }
}

</style>
