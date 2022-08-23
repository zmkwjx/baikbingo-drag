import { ref } from 'vue'

// 求a\b两点之间的夹角
const calcAngle = (a, b) => {
  const x = b.x - a.x
  const y = b.y - a.y
  const angle = Math.atan2(y, x) * (180 / Math.PI) + 90
  return Math.round(angle < 0 ? 360 + angle : angle)
}

const useRotate = modelValue => {
  // 监控数据
  const logIndex = ref(-1)
  const logState = ref([])
  const logLocal = ref({ x: 0, y: 0 })

  // 开始监听旋转状态
  const handleRotateStart = (event, value) => {
    // 开始先结束
    handleRotateEnd(event)
    // 获取原点
    logLocal.value.x = value.x + value.w / 2
    logLocal.value.y = value.y + value.h / 2
    // 筛出选中
    logState.value = modelValue.value.filter(item => item.selected)
    // 筛查当前
    logIndex.value = modelValue.value.findIndex(item => item === value)
  }

  // 监听旋转中的状态
  const logTimer = ref()
  const handleRotate = event => {
    // 如为空则跳出
    if (logState.value.length < 1) return
    // 开始拉伸、防抖
    logTimer.value && clearTimeout(logTimer.value)
    logTimer.value = setTimeout(() => {
      // 获取旋转角度
      const local = { x: event.pageX, y: event.pageY }
      const rotate = calcAngle(logLocal.value, local)
      // 获取旋转的差值
      const moveR = rotate - modelValue.value[logIndex.value].r
      // 赋值
      for (let i = 0; i < logState.value.length; i++) {
        const r = logState.value[i].r + moveR
        logState.value[i].r = r > 360 ? r - 360 : r
      }
    })
  }

  // 结束
  const handleRotateEnd = () => {
    logIndex.value = -1
    logState.value = []
    logTimer.value && clearTimeout(logTimer.value)
  }

  return {
    handleRotateStart,
    handleRotate,
    handleRotateEnd
  }
}

export default useRotate
