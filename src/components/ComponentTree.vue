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
               ref="tree2"
               :props="defaultProps"></el-tree>
    </el-aside>
</template>

<script lang="tsx">
import Vue, { CreateElement } from 'vue';
import API from '@/api/index';

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
    API.getMenuData().then((data:any) => {
      this.nodeData = data.data;
    });
  },
  methods: {
    renderContentFunction(h: CreateElement, { node, data }:{node:any, data:any}) {
      const className = node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder';
      const classNameChild = (!data.children && data.icon) ? data.icon : '';
      return h('div', {
        class: { leafNode: !data.children },
        style: {
          height: '38px',
          lineHeight: '38px',
          fontSize: '12px',
          color: '#1b1c23',
        },
      }, [
        h('el-tooltip', {
          attrs: {
            content: data.label,
            placement: 'top-end',
            disabled: !!data.children,
          },
        }, [
          h('span', {
            attrs: {
              draggable: !data.children,
              id: data.id,
            },
            on: {
              dragstart: this.dragHandle,
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
    dragHandle(ev:any) {
      ev.dataTransfer.setData('target', ev.target.id);
    },
  },
});
</script>
