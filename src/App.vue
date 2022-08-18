<template>
  <draw-board height="400" width="650">
    <drag-view v-model="dragList">
      <input />
    </drag-view>
  </draw-board>
  <button @click="handleAdd">添加</button>
</template>
<script setup>
import DrawBoard from '@packages/draw-board'
import DragView from '@packages/drag-view'
import { ref } from 'vue'

const handleAdd = () => {
  dragList.value.push({
    x: 10,
    y: 10,
    w: 200,
    h: 160,
    z: 1,
    r: 0,
    selected: true
  })
}

const dragList = ref([
  {
    x: 10,
    y: 10,
    w: 200,
    h: 160,
    z: 1,
    r: 0,
    selected: true,
    draggable: false
  }
])
</script>
<style lang="scss" scoped></style>
