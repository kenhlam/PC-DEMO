<template>
  <div class="demo">
    <div class="menuWrap">
      <TableMenu @addNode="addNode" :menuList="menuList" :nodeList="nodeList" />
    </div>
    <div class="dragAreaWrap">
      <DragSvgArea
        ref="dragSvgArea"
        @setNodeList="setNodeList"
        @openRelationshipModal="openRelationshipModal"
      />
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