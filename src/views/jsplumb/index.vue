<template>
  <div>
    <a-button @click="changeNode">测试节点切换</a-button>
    <div
      class="viewContent"
      v-flowDrag
      @mousewheel.stop.prevent="mouseWheelAction($event)"
    >
      <DragSvgArea
        ref="DragSvgArea"
        @clickNode="clickNode"
        :nodes="nodes"
        :zoom="zoom"
      />
      <a-icon title="重置样式" class="reset" type="sync" @click="resetZoom" />
    </div>
  </div>
</template>
<script>
import bussiness from "./bussiness";
export default Object.assign({}, bussiness);
</script>

<style lang="less" scoped>
@import url(./style);
</style>