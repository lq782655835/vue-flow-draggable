<template>
  <el-aside width="240px"
              class="left">
      <div class="search">
        <el-input placeholder="搜索"
                  size="small"
                  v-model="filterText">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <el-tree :data="nodeData"
               node-key="id"
               :default-expanded-keys="['source','preHandle','sign','learn']"
               icon-class="el-icon-arrow-right"
               :render-content="renderContentFunction"
               :filter-node-method="filterNode"
               @node-contextmenu="handleNodeContextMenu"
               ref="tree2"
               :highlight-current="true"
               :props="defaultProps"></el-tree>
      <el-button class="btn-new" icon="el-icon-plus">新建实验</el-button>
    </el-aside>
</template>

<script lang="tsx">
import Vue, { CreateElement } from 'vue';

export default Vue.extend({
  data() {
    return {
      nodeData: [],
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    };
  },
  watch: {
    filterText(val: string) {
      this.$refs.tree2.filter(val);
    },
  },
  mounted() {
    this.nodeData = [
      {
        label: '我的实验',
        id: 'source',
        children: [{
          label: 'springleo',
          id: 'lq',
          icon: 'el-icon-coin',
          children: [{
            label: '新闻分类_4079',
            id: 'lq1',
            icon: 'el-icon-coin',
          }],
        }, {
          label: '基于对象特征的推荐_539',
          id: 'source1',
          icon: 'el-icon-coin',
        }, {
          label: '新闻分类_4078',
          id: 'source2',
          icon: 'el-icon-coin',
        }],
      },
    ];
  },
  methods: {
    renderContentFunction(h: CreateElement, { node, data }:{node:any, data:any}) {
      const className = node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder';
      const classNameChild = (!data.children && data.icon) ? data.icon : '';
      return h('div', {
        // class: { leafNode: !data.children },
        style: {
          height: '38px',
          lineHeight: '38px',
          fontSize: '12px',
          color: '#1b1c23',
        },
      }, [
        h('el-tooltip', {
          props: {
            openDelay: 300,
          },
          attrs: {
            content: data.label,
            placement: 'top-end',
            disabled: !!data.children,
          },
        }, [
          h('span', {
            attrs: {
              id: data.id,
            },
            class: 'node',
            style: {
              display: 'inline-block',
              marginTop: '4px',
              height: '30px',
              lineHeight: '30px',
              width: '140px',
              borderRadius: '4px',
              position: 'relative',
              outline: 'none',
              border: !data.children ? '1px solid transparent' : 'none',
              'user-select': 'none',
            },
          }, [
            h('i', {
              class: {
                [className]: !!data.children,
                [classNameChild]: !data.children,
              },
              style: {
                color: '#00cdea',
                marginLeft: data.children ? '10px' : '15px',
              },
            }),
            h('span', {
              style: {
                fontSize: '13px',
                marginLeft: '10px',
              },
            }, data.label),
          ]),
        ]),
      ]);
    },
    filterNode(value:string, data:any) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeContextMenu(event: any, data: any) {
      if (data.children) {
        this.openFolderContextMenu(event);
      } else {
        this.openLeafContextMenu(event);
      }
    },
    openFolderContextMenu(event: any) {
      this.$contextmenu({
        items: [
          {
            label: '新建空白实验',
            icon: 'el-icon-circle-plus-outline',
            onClick: () => {
              console.log('打开实验');
            },
          },
          { label: '新建文件夹', icon: 'el-icon-folder-add', disabled: true },
          { label: '重命名', icon: 'el-icon-edit-outline', disabled: true },
          {
            label: '删除', icon: 'el-icon-delete', divided: true, disabled: true,
          },
          { label: '评估对比', icon: 'el-icon-s-ticket', disabled: true },
        ],
        event,
        customClass: 'contentmenu-ctn',
        zIndex: 3,
        minWidth: 200,
      });
      event.preventDefault();
    },
    openLeafContextMenu(event: any) {
      this.$contextmenu({
        items: [
          {
            label: '打开实验',
            icon: 'el-icon-folder-opened',
            onClick: () => {
              console.log('打开实验');
            },
          },
          {
            label: '在新标签页中打开',
            icon: 'el-icon-document-add',
            divided: true,
            onClick: () => {
              console.log('打开实验');
            },
          },
          { label: '复制', icon: 'el-icon-document-copy' },
          { label: '重命名', icon: 'el-icon-edit-outline' },
          { label: '删除', divided: true, icon: 'el-icon-delete' },
          { label: '评估对比', icon: 'el-icon-s-ticket', disabled: true },
          { label: '导出实验', icon: 'el-icon-c-scale-to-original', disabled: true },
        ],
        event,
        customClass: 'contentmenu-ctn',
        zIndex: 3,
        minWidth: 200,
      });
      event.preventDefault();
    },
  },
});
</script>

<style lang="scss" scoped>
.left {
  position: relative;
  .btn-new {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}
</style>
<style>
/* 右键 */
.contentmenu-ctn {
  font-family: "Helvetica Neue", Helvetica, Arial, "Hiragino Sans GB", "PingFang SC",
  "Microsoft YaHei", tahoma, simsun, 宋体, serif;
}
</style>
