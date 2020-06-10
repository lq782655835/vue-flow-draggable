# vue-flow-draggable

案例预览：https://lq782655835.github.io/vue-flow-draggable/

## Flow设计文档

### 1. 快速开始

```
yarn add vue-flow-draggable
```

``` js
import FlowChart from 'vue-flow-draggable';
import 'vue-flow-draggable/dist/vue-flow-draggable.css';

<template>
    <div id="mainContainer"></div>
</template>
<script>
export default {
    mounted() {
        // 一行代码即可，画布设置完成
        // 即刻支持节点连接、右键、缩放等
        FlowChart.setContainer('mainContainer');

        // 加数据，渲染画布和编辑操作
        FlowChart.loadData(mockdata);

        // flow事件暴露，方便做业务逻辑
        FlowChart.on('selectNode', (nodeId: string) => {
            this.isShowNode = true;
            this.currentNodeId = nodeId;
        });
    }
}
</script>
```

> 一定要在mounted中设置，因为jsPlumbrender需要dom节点已完成

### 2. 架构设计

![image](https://user-images.githubusercontent.com/6310131/84100368-4cb75900-aa3e-11ea-9f40-350e008be138.png)

### 3. Method API设计

#### 1. FlowChart.setContainer(id)

设置容器，同时进行插件初始化

#### 2. FlowChart.loadData(model)

获取model数据，在flow中渲染以及后续编辑。model数据结构见[下方](#4-model数据结构)

#### 3. FlowChart.addNode(position, elId)

在容器内添加节点。参数：
* position：节点位置
* elId：记录生产节点的源节点id，便于传递原节点信息

#### 4. FlowChart.undo()

撤销上一步命令

#### 5. FlowChart.zoomOut()

放大

#### 6. FlowChart.zoomIn()

缩小

#### 7. FlowChart.getModelData()

拿到实时model数据

#### 8. FlowChart.use(plugin, ...args)

插件扩展。详细见下方[插件设计](#6-通用插件设计)

### 4. Event API设计

#### 1. selectNode

当前画布选中的node。回调：function(nodeId)

#### 2. addCommand

添加命令后触发，Command命令类型可以见[下方](#5-command命令类型)。回调：function()

#### 3. commandListEmpty

命令栈为空时触发。回调function()

#### 4. showNodeData

右键菜单，选择“查看数据”时触发。回调function(nodeId)

> TODO: 右键菜单做成通用设计

### 4. Model数据结构

* nodes 数组
    * id（节点唯一ID）
    * points 附着在node上的连接点（ai业务中的输入和输出参数）
        * targets 目标endpoints
        * sources 源endpoints (string数组，存放endpoint的ID)
    * position 画布坐标位置
	    * left
	    * top
    * data 节点信息
        * icon
        * value
        * nodeState
* endpoints 数组
    * id 唯一ID
    * data endpoint信息
        * value
* edges 数组
    * 连线关系，sourceId -> targetId

### 5. Command命令类型

* Node节点命令
    * AddNodeCommand
    * RemoveNodeCommand
    * MoveNodeCommand（移动）
    * PasteNodeCommand（粘贴）
    * RenameNodeCommand(重命名)
* Connector连线命令
    * AddConnectorCommand
    * RemoveConnectorCommand

### 6. 通用插件设计

插件扩展，将底层能力暴露给开发者自定义，从而解耦业务。插件方式参考自MarkdownIt。

参数中args第一个参数是暴露的FlowChart内部对象，具体有：

* instance: jsPlumb底层实例
* editor: 画布操作实例，提供封装的jsPlumb操作
* model: 暴露model模型数据结构和操作
* contentMenu: 暴露右键插件

实现第一个插件，更复杂插件可以看[执行模型插件pluginFlowExec](./src/FlowChart/pluginFlowExec.js):

``` js
FlowChart.use(function({ instance, editor, model, contentMenu}) {
    this.rerender = () => {
        // 会使整个jsPlumb立即重绘。
        instance.setSuspendDrawing(false, true)
        // 重新渲染
        editor.render();
    }
})
```

## 功能点

主要分三个区域：

![](/public/md.png)

#### 菜单节点区域
- [x] 从菜单中拖动一个节点到主设计区域，可放置该节点
- [x] 按节点类型组织节点
- [x] 菜单右键

#### 主设计区域
- [x] 操作可撤销
- [x] 背景的平移和缩放
- [x] 可接收从菜单中拖入的节点
- [x] 拖入的节点会根据当前的节点信息生成对应的端点（用于拖出连线）
- [x] 生成的端点分两种类型：源端点和目标端点，应在样式上作区分
- [x] 源端点放置在节点bottom位置，目标节点防止在节点的top位置（便于从上往下拖出连接线）
- [x] 所有节点可通过拖拽移动位置
- [x] 所有节点和连接线可删除    
- [x] 所有节点和端点在鼠标悬浮需要有tooltip框来提示节点或端点信息
- [x] 所有节点、端点和连接线在鼠标悬浮时需要设置不同的样式
- [x] 所有节点和连接线可被选中
- [x] 导入数据生成流程图
- [ ] 操作实时保存数据
- [ ] 键盘删除快捷键

#### 节点配置区域
- 在设计区域选中节点时，节点配置区域会显示一个对应的节点配置面板
- 不同节点应拥有对应的节点配置面板
- 节点面板用来展示和配置节点属性
#### 右键菜单功能
- 节点：
  - [x] 复制
  - [x] 删除
  - [x] 查看数据
  - [x] 重命名
- 连接线：
  - [x] 删除
- 背景：
  - [x] 粘贴

## 安装依赖
```
npm install
```

## 开发模式
```
npm run serve
```

## 编译生产代码
```
npm run build
```

## 技术细节

1. 使用[panzoom](https://github.com/timmywil/panzoom)缩放画布div
1. 设计Command模式，1. 方便顶层调用 2. undo设计