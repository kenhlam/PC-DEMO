<template>
  <div 
  :style="{
                  '-webkit-transform': `scale(${zoom})`,
                  '-moz-transform': `scale(${zoom})`,
                  '-ms-transform': `scale(${zoom})`,
                  '-o-transform': `scale(${zoom})`,
                  'transform': `scale(${zoom})`,
                }"
  :id="connectConfig.Container" >
    <div style="width: 100%; height: 100%">
      <div
        :id="'data_' + i.id"
        class="item"
        :class="i.type"
        v-for="i in nodeList"
        :key="i.id"
        :style="{
          left: i.x + 'px',
          top: i.y + 'px', 
        }"
        @click="handleClickNode(i)"
      >
       <!-- width: '200px',
          height: '100px', -->
        <a-tooltip placement="top">
          <template slot="title">
            <p style="text-align:center;"> {{ i.subText || i.text }}</p>
            <p style="text-align:center;">{{i.tips}}</p>
          </template>
          <div>
             {{ i.text }}
          </div>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
import bussiness from "./bussiness";
export default Object.assign({}, bussiness);
</script>
<style lang="less" scoped>
@import url(./style.less);
</style>
