import DragSvgArea from "./DragSvgArea";
const NODES = [

  {
    id: '1',//自动生成
    type: 'a',//节点类型
    dataType: 'abc',//节点具体的表单类型 start action time param..... 
    y: 100,//位置
    x: 100,//位置
    parentId: null,//子节点
    text: '开始1',
  },
  {
    id: '2',//自动生成
    type: 'b',//节点类型
    dataType: 'abc',//节点具体的表单类型 start action time param..... 
    y: 100,//位置
    x: 400,//位置
    parentId: '1',//子节点
    text: '时间2',
    subText: "每日",
    tips: "08:00:00~10:00:00"
  },
  {
    id: '3',//自动生成
    type: 'b',//节点类型
    dataType: 'abc',//节点具体的表单类型 start action time param..... 
    y: 100,//位置
    x: 700,//位置
    parentId: '2',//子节点
    text: '参数3',
    subText: "参数场景1",
    tips: "参数1、参数2"
  },
  {
    id: '4',//自动生成
    type: 'c',//节点类型
    dataType: 'abc',//节点具体的表单类型 start action time param..... 
    y: 100,//位置
    x: 1000,//位置
    parentId: '3',//子节点
    text: '立减活动4',
    subText: "1分钱地铁权益卡活动",
    tips: "20201212"
  },
  {
    id: '5',//自动生成
    type: 'b',//节点类型
    dataType: 'abc',//节点具体的表单类型 start action time param..... 
    y: 500,//位置
    x: 700,//位置
    parentId: '3',//子节点
    text: '参数5',
    subText: "参数场景2",
    tips: "参数3"
  }
]
export default {
  components: { DragSvgArea },
  data() {
    return {
      nodes: NODES,//节点信息
      // isCanZoomAdd: true,//
      // isCanZoomMinus: true,
      zoom: 1,//缩放大小
    }
  },
  directives: {
    // 拖动：自身组件position:relative或absolute  作用组件，内部第一个children;
    flowDrag: {
      bind(el, binding) {
        if (!binding) {
          return;
        }
        el.onmousedown = (e) => {
          if (e.button == 2) {
            // 右键不管
            return;
          }
          //  鼠标按下，计算当前原始距离可视区的高度
          let disX = e.clientX;
          let disY = e.clientY;
          let offsetLeft = el.firstChild.offsetLeft;
          let offsetTop = el.firstChild.offsetTop;
          el.style.cursor = 'move';
          document.onmousemove = function (event) {
            // 移动时禁止默认事件
            event.preventDefault();
            const left = event.clientX - (disX - offsetLeft);
            const top = event.clientY - (disY - offsetTop);
            el.firstChild.style.left = `${left}px`;
            el.firstChild.style.top = `${top}px`;
          };
          document.onmouseup = function (e) {
            el.style.cursor = 'auto';
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
  },
  methods: {
    clickNode(i) {
      console.log(i);
    },
    // 测试节点数据改变
    changeNode() {
      this.resetZoom()
      if (this.nodes.length == 1) {
        this.nodes = NODES;
      } else {
        this.nodes = NODES.slice(0, 1)
      }
    },
    resetZoom() {
      this.zoom = 1;
      //重置所有 绝对定位信息
      const flowContainer = this.$refs.DragSvgArea.$el;
      flowContainer.style.top = 0;
      flowContainer.style.left = 0;
    },
    // 缩放功能
    mouseWheelAction(ev) {
      let scale = this.zoom;
      const deltay = ev.deltaY;
      if (scale <= 0.1 && deltay > 0) {
       return;
      }
      if (scale >= 4 && deltay < 0) {
        return;
      }  
      scale += deltay * -0.01;
      scale = Math.min(Math.max(0.1, scale), 4);
      this.zoom = scale;
     },
  }
}