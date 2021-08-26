/* eslint-disable no-unused-vars */

// 所有数据都在nodeList中，当nodeList变化时，触发父级数据修改。
// 与父级交互只有addNode动作，其余全部放到内部nodeList中处理。

import { jsPlumb } from 'jsplumb'
// import jsPlumbConfig from './mixins'


export default {
  props: {
    
  },
  components: {},
  // mixins: [jsPlumbConfig],
  data() {
    return {
      jsPlumb: null,
      relationShipModalVisible: false,
      relationData: {
        targetNode: {},
        dragNode: {}
      },
      tableRelatedType: "LEFT_JOIN",
      nodeList: [],
      //item尺寸
      nodeStyle: {
        width: 200,
        height: 32
      },

      // 连线样式
      connectConfig: {
        Container: "container_svg", //窗口id
        source: '',//起点DOM
        target: '',//终点DOM
        endpoint: ["Dot", {
          radius: 4
        }],
        paintStyle: { stroke: '#bfbfbf', strokeWidth: 1 },//连线样式
        endpointStyle: {
          fill: '#bfbfbf',
          alwaysRespectStubs: true,

        },//端点样式
        overlays: [
          ["Arrow", {
            location: 0.8,
            width: 10,
            length: 10,
            visible: true,
            id: "ARROW",

          }]
        ],
        anchors: ['RightMiddle', 'LeftMiddle'],//连接点位置
        detachable: false,
        reattach: false
      }
    }
  },
  computed: {
    // ...mapState({
    //     menuList: (state) => state.menuList,
    // }),
   
  },

  watch: {
    nodeList(newVal) {
      this.$emit('setNodeList', newVal)
    }, 
  },
  mounted() {
    this.jsPlumb = jsPlumb.getInstance();
    jsPlumb.ready(() => {

    })

  },
  beforeDestroy() {

    // 202105111134333326090010
  },
  methods: {
    
    // 获取模型信息后  初始化渲染
    async initNodeList(val) {
      this.jsPlumb = jsPlumb.getInstance();
      jsPlumb.ready(() => {

      })
      // 渲染DOM
      this.nodeList = val;
      await this.$nextTick();

      // 连线
      this.nodeList.forEach(v => {
        if (v.pid) {
          // const { dragNode, targetNode } = options;
          this.connectNode({
            dragNode: v,
            targetNode: val.find(item => item.id == v.pid)
          })
        } else {
          this.setDragable(v);
        }
      });
      this.nodeListLengthChange();
    },
    // 碰撞检测  先放置DOM 检测不过在移除（可个性碰撞检测算法，优化渲染，但关联表很少，性能几乎无影响）
    async addNode(evt, node) {
      let screenX = evt.originalEvent.clientX,
        screenY = evt.originalEvent.clientY;
      const canvasContainerRect = document
        .querySelector('#' + this.connectConfig.Container)
        .getBoundingClientRect();
      let left = screenX,
        top = screenY;
      // 计算是否拖入到容器中
      if (
        left < canvasContainerRect.x ||
        left > canvasContainerRect.width + canvasContainerRect.x ||
        top < canvasContainerRect.y ||
        canvasContainerRect.y >
        canvasContainerRect.y + canvasContainerRect.height
      ) {
        this.$message.error('请把节点拖入到画布中');
        return;
      }
      left = left - canvasContainerRect.x - this.nodeStyle.width / 2;
      top = top - canvasContainerRect.y - this.nodeStyle.height / 2;
      // 边缘处理
      const innerPosition = this.edgeInContainer({ left, top });
      node.left = innerPosition.left
      node.top = innerPosition.top


      this.nodeList.push(node);
      await this.$nextTick();
      // this.nodeList只有一条时为主表  否则为关联表，需要检测碰撞
      if (this.nodeList.length > 1) {
        const targetNode = this.getTargetNodeByDragNode(node)
        if (!targetNode) {
          this.$message.error('请把节点放置到关联表上！');
          this.nodeList = this.nodeList.filter(v => v.id != node.id);
        } else {
          await this.resetNodePosition(node, targetNode);
          //模拟弹窗 设置默认关联关系并连线  设置默认关联关系
          node.tableRelatedType = 'LEFT_JOIN'
          node.masterSlaveColumnMappings = [{
            masterTableName: targetNode.tableName,
            masterColumnName: "",
            masterOriginId: targetNode.originId,
            slaveTableName: node.tableName,
            slaveColumnName: "",
            slaveOriginId: node.originId 
          }];
          this.openRelationShipModal(targetNode, node, 'new')
          //弹窗确认时    存值 节点添加pId 及与pNode的关联关系
          node.pid = targetNode.id;
          // 连线
          this.connectNode({
            dragNode: node,
            targetNode: targetNode,
          });
          this.updateRender();
        
        }
      } else {
        this.setDragable(node);
        
      }

    },
    openRelationShipModal(targetNode, dragNode, openWay) {

      this.$emit('openRelationshipModal', {
        targetNode,
        dragNode,
        openWay
      })

    },
    delNode(id) {
      this.nodeList = this.nodeList.filter(v => v.id != id);
      // 删除当前id-----删除所有pId==id的子节点
      this.jsPlumb.remove(id);
      const subNodes = this.nodeList.filter(v => v.pid == id);
      subNodes.forEach(v => {
        this.delNode(v.id);
      });
      
    },
    delAllNode() {
      const node = this.nodeList[0];
      node && this.delNode(node.id); 
    },
    // 业务需求添加，增加fixedNodeIds  部份节点限制删了操作
    allowDel(id){
      return this.fixedNodeIds.indexOf(id) == -1
    },
    //连线
    connectNode(options) {
      const self = this;
      const { dragNode, targetNode } = options;
      const overlays = [
        ...this.connectConfig.overlays,
        ["Label", {
          location: 0.45,
          id: "label",
          label: `<span class='${dragNode.tableRelatedType}'  ></span>`,
          cssClass: "connectRalationShip",
          events: { // 覆盖物回调
            click: function (labelOverlay, originalEvent) {

              self.openRelationShipModal(targetNode, dragNode, 'modify')
              // console.log('click');

              // labelOverlay.setLabel(`<span class='${dragNode.tableRelatedType}'  ></span>`)
            }
          }
        }]
      ]
      const connectConfig = Object.assign({}, this.connectConfig, {
        source: targetNode.id,//起点DOM
        target: dragNode.id,//终点DOM
        overlays
      })

      this.jsPlumb.connect(connectConfig)
      this.setDragable(dragNode);
    },

    updateRelationDom(node) {
      const connectors = this.jsPlumb.getConnections();
      const currentConnector = connectors.find(v => v.targetId == node.id);
      try {
        currentConnector.getOverlay('label').setLabel(`<span class='${node.tableRelatedType}'  ></span>`)
      } catch (e) {
        console.warn('关系节点更新失败！')
      }

    },

    updateRender() {
      // 引用修改  手动触发DOM更新
      this.nodeList = [...this.nodeList]
    },

    // 设置拖动 
    setDragable(node) {
      this.jsPlumb.draggable(node.id, {
        // containment: 'parent',
        containment: true,
        stop: (drag) => {
          const [left, top] = drag.pos;
          node.left = left;
          node.top = top;

          this.updateRender()
        },
        drag: (e, ui) => {

          // jsPlumb.setSuspendDrawing(false, true);
          //   this.jsPlumb.repaintEverything();
        }
      });
    },
    edgeInContainer({ left, top }) {
      const canvasContainerRect = document
        .querySelector('#' + this.connectConfig.Container)
        .getBoundingClientRect();

      // 左边界
      left = Math.max(left, 0);
      top = Math.max(top, 0)
      // 右边界
      left = Math.min(left, canvasContainerRect.width - this.nodeStyle.width);
      top = Math.min(top, canvasContainerRect.height - this.nodeStyle.height);
      return {
        left, top
      }

    },
    // 调整位置(相对targetNode偏移20px) 防止重叠
    async resetNodePosition(node, targetNode) {
      const dropNode = this.nodeList.find(v => v.id == node.id);
      const top = ~~targetNode.top + this.nodeStyle.height + 20;
      const left = ~~targetNode.left + this.nodeStyle.width + 20;

      dropNode.top = top;
      dropNode.left = left;
      this.updateRender();
      await this.$nextTick();
      // 偏移位置还有节点重叠，在偏移
      const overLayNode = this.getTargetNodeByDragNode(dropNode);
      if (overLayNode) {
        await this.resetNodePosition(dropNode, overLayNode)
      } else {
        // 边缘处理
        const innerPosition = this.edgeInContainer({ left: dropNode.left, top: dropNode.top });
        dropNode.top = innerPosition.top;
        dropNode.left = innerPosition.left;
        this.updateRender();
        await this.$nextTick();
      }
    },
    // 如果碰撞了，返回targetNode  否则删除dragNode并提示
    getTargetNodeByDragNode(dragNode) {
      const oldList = this.nodeList.filter(v => v.id != dragNode.id);
      for (var i in oldList) {
        const flag = this.isOverlap(dragNode, oldList[i]);
        if (flag) {
          return oldList[i]
        }
      }
      return null;
    },
    // 碰撞检测(存在DOM实体后，计算位置比较)
    isOverlap: function (node1, node2) {
      const objOne = document.querySelector('#' + node1.id)
      const objTwo = document.querySelector('#' + node2.id)
      var x1 = objOne.offsetLeft;
      var y1 = objOne.offsetTop;
      var x2 = x1 + objOne.clientWidth;
      var y2 = y1 + objOne.clientHeight;
      var x3 = objTwo.offsetLeft;
      var y3 = objTwo.offsetTop;
      var x4 = x3 + objTwo.clientWidth;
      var y4 = y3 + objTwo.clientHeight;
      if (y2 < y3 || x1 > x4 || y1 > y4 || x2 < x3) { // 表示没碰上  
        return false;
      } else {
        return true;
      }
    }
  },

}