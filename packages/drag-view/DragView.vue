<template>
  <div class="bk-drag-view" @click="handleClear">
    <div
      class="bk-drag-item"
      v-for="(item, index) in modelValue"
      :key="index"
      :style="itemStyle(item)"
      @mousedown="handleMouseDown('move', $event, item, index)"
      @click.stop=""
    >
      <div class="bk-drag-item-box">
        <div v-if="item.selected" class="bk-drag-item-select">
          <div class="rotate-circle" />
          <div class="line line-n" />
          <div class="line line-s" />
          <div class="line line-e" />
          <div class="line line-w" />
          <div class="circle circle-wn" />
          <div class="circle circle-en" />
          <div class="circle circle-es" />
          <div class="circle circle-ws" />
        </div>
        <div class="bk-drag-item-inner">
          <slot :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, toRefs } from 'vue'
import useMove from './useMove'

// 传入参数
const props = defineProps({
  // 双向绑定 x、y、z、w、h
  modelValue: {
    type: Array,
    default: () => []
  }
})
// const emits = defineEmits(['update:modelValue'])
const { modelValue } = toRefs(props)

// 组件样式
const itemStyle = item => {
  const base = {}
  const { x, y, z, w, h } = item
  x && (base.left = `${x}px`)
  y && (base.top = `${y}px`)
  z && (base.zIndex = `${z}px`)
  w && (base.width = `${w}px`)
  h && (base.height = `${h}px`)
  return base
}

// 清空事件
const handleClear = () => {
  triggerState.value = null
  handleSelect()
}

// 鼠标过滤函数: 按下
const triggerState = ref(null)
const handleMouseDown = (action, event, ...params) => {
  switch (action) {
    case 'move':
      handleMoveStart(event, ...params)
      break
    default:
      break
  }
  triggerState.value = action
}

// 鼠标过滤函数: 移动
window.onmousemove = event => {
  switch (triggerState.value) {
    case 'move':
      handleMove(event)
      break
    default:
      break
  }
}

// 鼠标过滤函数: 放开
window.onmouseup = event => {
  switch (triggerState.value) {
    case 'move':
      handleMoveEnd(event)
      break
    default:
      break
  }
}

// 移动
const { handleSelect, handleMoveStart, handleMove, handleMoveEnd } = useMove(
  modelValue
)
</script>
<style src="./style.scss" lang="scss" scoped />
