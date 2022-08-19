<template>
  <div class="bk-draw-board" :style="drawStyle" :theme="props.theme">
    <slot />
  </div>
</template>
<script setup>
import { computed } from 'vue'

// 传入参数
const props = defineProps({
  height: {
    type: [String, Number],
    default: undefined
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  // 主题
  theme: {
    type: String,
    default: 'default'
  }
})

// 画板样式
const drawStyle = computed(() => {
  const base = {}
  props.height && (base.height = `${props.height}px`)
  props.width && (base.width = `${props.width}px`)
  return base
})
</script>
<style lang="scss">
.bk-draw-board {
  height: 100%;
  width: 100%;
  // user-select: none;
}
.bk-draw-board[theme='default'] {
  // border: 1px dashed #e0e0e0;
  // background-color: antiquewhite;
}
</style>
