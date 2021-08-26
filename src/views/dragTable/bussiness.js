
import TableMenu from "./TableMenu"
import DragSvgArea from "./DragSvgArea"
export default {
  components:{TableMenu,DragSvgArea},
  data() {
    return {
      nodeList:[],
      menuList:[
        {
          id:'c1',
          name:'name1',
          oId:'t1',
        },
        {
          id:'c2',
          name:'name2',
          oId:'t1',
        },
        {
          id:'c3',
          name:'name3',
          oId:'t1',
        },
        {
          id:'c4',
          name:'name4',
          oId:'t1',
        },
      ]
    }
  },
  methods: {
    addNode(evt,node){
      this.$refs.dragSvgArea.addNode(evt,node);
    },
    setNodeList(nodeList){
      this.nodeList = nodeList;
    },
    openRelationshipModal({dragNode,targetNode,openWay}){
      console.log(dragNode);
    }
  
  }
}