<template>
  <div :id="connectConfig.Container">
    <div style="width: 100%; height: 100%">

      <div
        :id="i.id"
        class="item"
        v-for="i in nodeList"
        :key="i.id"
        :style="{
          left: i.left + 'px',
          top: i.top + 'px',
          width: nodeStyle.width + 'px',
          height: nodeStyle.height + 'px',
        }"
      >
        <div class="name" :title='i.originName + "."+ i.name'><a-icon type="table" />{{i.name }}</div>
        <div class="del"  @click="delNode(i.id)">X</div>
      </div>
    </div>
    
  </div>
</template>
<script>
import bussiness from './bussiness';
export default Object.assign({}, bussiness);
</script>
<style lang="less" scoped>
@import url(./style.less);
</style>
