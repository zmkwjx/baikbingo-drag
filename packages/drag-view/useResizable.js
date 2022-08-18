import { ref } from 'vue'

// 向北拉伸
const setResizableN = (item, local) => {
  const movementY = local[0].y - local[1].y
  if (item.h + movementY > 0) {
    item.y -= movementY
    item.h += movementY
  }
}

// 向东拉伸
const setResizableE = (item, local) => {
  const movementX = local[1].x - local[0].x
  if (item.w + movementX > 0) {
    item.w += movementX
  }
}

// 向南拉伸
const setResizableS = (item, local) => {
  const movementY = local[1].y - local[0].y
  if (item.h + movementY > 0) {
    item.h += movementY
  }
}

// 向西拉伸
const setResizableW = (item, local) => {
  const movementX = local[0].x - local[1].x
  if (item.w + movementX > 0) {
    item.x -= movementX
    item.w += movementX
  }
}

const useResizable = modelValue => {
  // 监控数据
  const logDirection = ref()
  const logState = ref([])
  const logLocal = ref([
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ])

  // 开始
  const handleResizableStart = (event, direction) => {
    // 开始先结束
    handleResizableEnd(event)
    // 初始点坐标
    logDirection.value = direction
    logLocal.value[0].x = event.pageX
    logLocal.value[0].y = event.pageY
    // 筛出选中
    logState.value = modelValue.value.filter(item => item.selected)
  }

  // 拉伸中
  const logTimer = ref()
  const handleResizable = event => {
    // 如为空则跳出
    if (logState.value.length < 1) return
    // 获取坐标、拉伸数据
    logLocal.value[1].x = event.pageX
    logLocal.value[1].y = event.pageY
    // 开始拉伸、防抖
    logTimer.value && clearTimeout(logTimer.value)
    logTimer.value = setTimeout(() => {
      for (let i = 0; i < logState.value.length; i++) {
        switch (logDirection.value) {
          case 'n':
            setResizableN(logState.value[i], logLocal.value)
            break
          case 'e':
            setResizableE(logState.value[i], logLocal.value)
            break
          case 's':
            setResizableS(logState.value[i], logLocal.value)
            break
          case 'w':
            setResizableW(logState.value[i], logLocal.value)
            break
          case 'en':
            setResizableE(logState.value[i], logLocal.value)
            setResizableN(logState.value[i], logLocal.value)
            break
          case 'wn':
            setResizableW(logState.value[i], logLocal.value)
            setResizableN(logState.value[i], logLocal.value)
            break
          case 'es':
            setResizableE(logState.value[i], logLocal.value)
            setResizableS(logState.value[i], logLocal.value)
            break
          case 'ws':
            setResizableW(logState.value[i], logLocal.value)
            setResizableS(logState.value[i], logLocal.value)
            break
          default:
            break
        }
      }
      logLocal.value[0].x = logLocal.value[1].x
      logLocal.value[0].y = logLocal.value[1].y
    })
  }

  // 结束
  const handleResizableEnd = () => {
    logDirection.value = null
    logState.value = []
    logTimer.value && clearTimeout(logTimer.value)
  }

  return {
    handleResizableStart,
    handleResizable,
    handleResizableEnd
  }
}

export default useResizable
