
import draggable from "vuedraggable";

const draggableOptions = {
  preventOnFilter: false,
  sort: false,
  disabled: false,
  ghostClass: 'tt',
  // 不使用H5原生的配置
  forceFallback: true,
  // 拖拽的时候样式
  // fallbackClass: 'flow-node-draggable'
};

// import { createNamespacedHelpers } from 'vuex';
// const { mapState } = createNamespacedHelpers(
//     'fastData/testDrag'
// );
var mousePosition = {
  left: -1,
  top: -1,
};

export default {

  props: ["menuList", 'nodeList'],
  data() {
    return {
      draggableOptions,
      currentMenu: `0`,
      filterKeyForTableName: "",
    };
  },

  components: {
    draggable,
  },
  computed: {
    showMenuList() {
      // 根据nodeList添加显示状态字段
      const nodeIds = this.nodeList.map(v => v.id);
      this.menuList.forEach(v => {
        v.draggable = !nodeIds.includes(v.id);
      })
      // 根据搜索字段过滤菜单
      if (this.filterKeyForTableName != '') {
        return this.menuList.filter(v => {
          return v.name.indexOf(this.filterKeyForTableName) != -1
        })
      }

      return this.menuList;
    },
  },

  created() {

    /**
     * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
     * @param event
     */
    if (this.isFirefox()) {
      document.body.ondrop = function (event) {
        // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
        mousePosition.left = event.layerX;
        mousePosition.top = event.clientY - 50;
        event.preventDefault();
        event.stopPropagation();
      };
    }

  },
  mounted() {

  },
  methods: {

    // 拖拽结束时触发
    end(evt) {
      const id = evt.item.getAttribute("data_id");
      const item = this.menuList.find(v => v.id == id);
      //区分excel还是table
      this.$emit("addNode", evt, item);
    },
    // 是否是火狐浏览器
    isFirefox() {
      var userAgent = navigator.userAgent;
      if (userAgent.indexOf("Firefox") > -1) {
        return true;
      }
      return false;
    }

  },
};
