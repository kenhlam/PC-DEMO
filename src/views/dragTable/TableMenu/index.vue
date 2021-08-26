<template>

  <div class="menu_wrap">
    <div class="dataSourceSelectArea">
      <div class="item">
        <a-input  placeholder="请输入表名" v-model="filterKeyForTableName">
          <a-icon slot="suffix" type="search" />
        </a-input>
      </div>
    </div>
    <draggable
      v-model="menuList"
      @end="end"
      draggable=".draggable"
      v-bind="draggableOptions"
    >
      <div
        class="menu_item"
        :class="{ draggable: i.draggable }"
        v-for="i in showMenuList"
        :key="i.id"
        :data_id="`${i.id}`"
      >
        <a-icon type="table" />
      <span :title="i.name">{{ i.name }}</span>  
      </div>
    </draggable>
  </div>

</template>
<script>
import bussiness from './bussiness';
export default Object.assign({}, bussiness);
</script>
<style lang="less" scoped>
@import url(./style.less);
</style>
