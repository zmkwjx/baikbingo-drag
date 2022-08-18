import { ref } from 'vue'

const useMove = modelValue => {
  // 选中
  const handleSelect = (_, index = -1) => {
    if (moveState.value.length < 1) {
      for (let i = 0; i < modelValue.value.length; i++) {
        modelValue.value[i].selected = i === index
      }
    }
  }

  // 监控数据
  const moveIndex = ref(-1)
  const moveState = ref([])
  const moveLocal = ref([
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ])

  // 移动开始
  const handleMoveStart = (event, value, index) => {
    // 开始先结束
    handleMoveEnd(event)
    // 初始点坐标
    value.draggable ??= true
    moveLocal.value[0].x = event.pageX
    moveLocal.value[0].y = event.pageY
    // 筛出选中
    moveState.value = modelValue.value.filter(item => item.selected)
    // 如果点击其他元素
    if (moveState.value.find(item => item === value)) {
      moveIndex.value = -1
    } else {
      moveState.value = []
      moveIndex.value = index
      handleSelect()
    }
  }

  // 移动
  const moveTimer = ref()
  const handleMove = event => {
    // 如为空则跳出
    if (moveState.value.length < 1) return
    // 获取坐标、移动数据
    moveLocal.value[1].x = event.pageX
    moveLocal.value[1].y = event.pageY
    // 开始移动、防抖
    moveTimer.value && clearTimeout(moveTimer.value)
    moveTimer.value = setTimeout(() => {
      const movementX = moveLocal.value[1].x - moveLocal.value[0].x
      const movementY = moveLocal.value[1].y - moveLocal.value[0].y
      for (let i = 0; i < moveState.value.length; i++) {
        if (moveState.value[i].draggable) {
          moveState.value[i].x += movementX
          moveState.value[i].y += movementY
        }
      }
      moveLocal.value[0].x = moveLocal.value[1].x
      moveLocal.value[0].y = moveLocal.value[1].y
    })
  }

  // 结束移动
  const handleMoveEnd = event => {
    const index = moveIndex.value
    if (index > -1) {
      const flag1 = moveLocal.value[0].x === event.pageX
      const flag2 = moveLocal.value[0].y === event.pageY
      const value = modelValue.value[index]
      flag1 && flag2 && handleSelect(value, index)
    } else {
      moveState.value = []
    }
    moveTimer.value && clearTimeout(moveTimer.value)
  }

  // 返回
  return {
    handleSelect,
    handleMoveStart,
    handleMove,
    handleMoveEnd
  }
}

export default useMove
