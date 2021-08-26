
import { jsPlumb } from 'jsplumb'
export default {
  props: {
    nodes: {
      default: () => [],
      type: Array
    },
    zoom:{
      default: 1,
      type: Number || String
    }
  },
  data() {
    return {
     
      nodeList: [],
      jsPlumb: null,
      // 连线样式
      connectConfig: {
        Container: "container_svg", //窗口id
        source: '',//起点DOM
        target: '',//终点DOM
        endpoint: ["Dot", {
          radius: 1
        }],
        paintStyle: { stroke: '#bfbfbf', strokeWidth: 1 },//连线样式
        endpointStyle: {
          fill: '#bfbfbf',
          alwaysRespectStubs: true,
        },//端点样式
        overlays: [
          ["Arrow", {
            location: 1,
            width: 10,
            length: 10,
            visible: false,
            id: "ARROW",

          }]
        ],
        detachable: false,
        reattach: false
      }
    }
  },
  watch: {
    nodes: {
      deep: true,
      immediate: true,
      handler(val) {
        this.renderConnect(val);
      }
    }
  },
  mounted() {
    this.jsPlumb = jsPlumb.getInstance();
    jsPlumb.ready(() => {

    })
  },
  beforeDestroy() {
  },
  methods: {
    handleClickNode(i) {
      this.$emit('clickNode', {
        hasChildrenNode: this.nodeList.some((v) => v.parentId == i.id),
        node: i
      })
    },

    // 初始化渲染 所有节点连线
    async renderConnect(val) {
      // 清空之前的连线
      if (!this.jsPlumb) {
        this.jsPlumb = jsPlumb.getInstance();
        jsPlumb.ready(() => {
        })
      } else {
        this.jsPlumb.deleteEveryConnection()
        this.jsPlumb.deleteEveryEndpoint()
      }
      this.nodeList = val;
      await this.$nextTick();
      // 连线
      this.nodeList.forEach(v => {
        if (v.parentId) {
          // const { dragNode, targetNode } = options;
          this.connectNode({
            dragNode: v,
            targetNode: this.nodeList.find(item => item.id == v.parentId)
          })
        }
      });
    },
    //两端点连线
    connectNode(options) {
      const { dragNode, targetNode } = options;
      const overlays = [
        ...this.connectConfig.overlays,
      ]
      const connectConfig = Object.assign({}, this.connectConfig, {
        source: 'data_' + targetNode.id,//起点DOM
        target: 'data_' + dragNode.id,//终点DOM,
        connector: ['Flowchart'],//Bezier  StateMachine Straight
        overlays,
        anchors: this.getAnchors(targetNode, dragNode),//连接点位置
      })
      this.jsPlumb.connect(connectConfig)
      // this.setDragable(dragNode);
    },
    // 计算端点位置
    getAnchors(targetNode, dragNode) {
      let startPos, endPos;

      const dragNodeX = dragNode.x;//終点坐标x
      const dragNodeY = dragNode.y;//終点坐标y
      const targetNodeX = targetNode.x;//起点坐标x
      const targetNodeY = targetNode.y;//起点坐标y

      const targetDom = document.querySelector("#data_" + targetNode.id);//父节点DOM
      const w = targetDom.offsetWidth;//
      const h = targetDom.offsetHeight;
      const xShift = Math.abs(dragNodeX - targetNodeX);//子节点相对父节点x偏移
      const yShift = Math.abs(dragNodeY - targetNodeY);//子节点相对父节点y偏移
      // x偏移大于父节点宽度，连线从左右方向画出  否则从上下方向画出
      if (xShift - w > 0) {
        startPos = dragNodeX > targetNodeX ? 'RightMiddle' : 'LeftMiddle';
      } else {
        startPos = dragNodeY > targetNodeY ? 'Bottom' : 'Top';
      }
      // y方向偏移大于父节点高度，连线从上下方向发出
      if (yShift - h > 0) {
        endPos = dragNodeY > targetNodeY ? 'Top' : 'Bottom';
      } else {
        endPos = dragNodeX > targetNodeX ? 'LeftMiddle' : 'RightMiddle';
      }
      return [startPos, endPos]//连接点位置
    },
    delNode(id) {
      this.nodeList = this.nodeList.filter(v => v.id != id);
      // 删除当前id-----删除所有parentId==id的子节点
      this.jsPlumb.remove('data_' + id);
      const subNodes = this.nodeList.filter(v => v.parentId == id);
      subNodes.forEach(v => {
        this.delNode(v.id);
      });
    },
    delAllNode() {
      const node = this.nodeList[0];
      node && this.delNode(node.id);
    }

  },

}