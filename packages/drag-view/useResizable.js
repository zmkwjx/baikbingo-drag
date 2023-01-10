import { ref } from 'vue'

// 返回相对于参考点旋转后的坐标
const rotatedPoint = (item, offsetX, offsetY) => {
  const rad = (Math.PI / 180) * item.r
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const originX = item.x + item.w / 2
  const originY = item.y + item.h / 2
  let x = offsetX - originX
  let y = offsetY - originY
  return {
    x: x * cos - y * sin + originX,
    y: x * sin + y * cos + originY
  }
}

// 还原坐标
const restorePoint = (item, local) => {
  const rad = (Math.PI / 180) * item.r
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const originX = item.x + item.w / 2
  const originY = item.y + item.h / 2
  let x = local.x - originX
  let y = local.y - originY
  return {
    x: x * cos + y * sin + originX,
    y: y * cos - x * sin + originY
  }
}

// 拒绝拉伸
const stopResizabl = (item, local, direction) => {
  // 拒绝拉伸
  switch (direction) {
    case 'tm':
      if (restorePoint(item, local[1]).y >= item.y + item.h) return true
      break
    case 'bm':
      if (restorePoint(item, local[1]).y <= item.y) return true
      break
    case 'ml':
      if (restorePoint(item, local[1]).x >= item.x + item.w) return true
      break
    case 'mr':
      if (restorePoint(item, local[1]).x <= item.x) return true
      break
    case 'tl':
      if (restorePoint(item, local[1]).y >= item.y + item.h) return true
      if (restorePoint(item, local[1]).x >= item.x + item.w) return true
      break
    case 'tr':
      if (restorePoint(item, local[1]).y >= item.y + item.h) return true
      if (restorePoint(item, local[1]).x <= item.x) return true
      break
    case 'bl':
      if (restorePoint(item, local[1]).y <= item.y) return true
      if (restorePoint(item, local[1]).x >= item.x + item.w) return true
      break
    case 'br':
      if (restorePoint(item, local[1]).y <= item.y) return true
      if (restorePoint(item, local[1]).x <= item.x) return true
      break
    default:
      break
  }
  return false
}

// 开始拉伸
const setResizabl = (item, local, direction) => {
  if (stopResizabl(item, local, direction)) return
  // 获取鼠标移动的坐标差
  let deltaX = local[1].x - local[0].x
  let deltaY = local[1].y - local[0].y
  // 四个顶点坐标
  const TL = rotatedPoint(item, item.x, item.y)
  const TR = rotatedPoint(item, item.x + item.w, item.y)
  const BL = rotatedPoint(item, item.x, item.y + item.h)
  const BR = rotatedPoint(item, item.x + item.w, item.y + item.h)
  // 考虑放缩
  let diffX, diffY, scale, scaleB, scaleC, newX, newY, newW, newH
  let Fixed = {} // 固定点
  let BX = {} // 高度边选点
  let CX = {} //  宽度边选点
  let Va = {} // 固定点到鼠标 向量
  let Vb = {} // 固定点到投影边  向量
  let Vc = {} // 另一边投影
  let Vw = {} // 宽度向量
  let Vh = {} // 高度向量
  // 拖动中点
  if (direction.includes('m')) {
    switch (direction) {
      case 'tm':
        diffX = deltaX + (TL.x + TR.x) / 2
        diffY = deltaY + (TL.y + TR.y) / 2
        Fixed = BL
        BX = TL
        CX = BR
        Va = { x: diffX - Fixed.x, y: diffY - Fixed.y }
        Vb = { x: BX.x - Fixed.x, y: BX.y - Fixed.y }
        scale =
          (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2))
        Vw = { x: CX.x - Fixed.x, y: CX.y - Fixed.y }
        Vh = { x: Vb.x * scale, y: Vb.y * scale }
        break
      case 'bm':
        diffX = deltaX + (BL.x + BR.x) / 2
        diffY = deltaY + (BL.y + BR.y) / 2
        Fixed = TL
        BX = BL
        CX = TR
        Va = { x: diffX - Fixed.x, y: diffY - Fixed.y }
        Vb = { x: BX.x - Fixed.x, y: BX.y - Fixed.y }
        scale =
          (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2))
        Vw = { x: CX.x - Fixed.x, y: CX.y - Fixed.y }
        Vh = { x: Vb.x * scale, y: Vb.y * scale }
        break
      case 'ml':
        diffX = deltaX + (TL.x + BL.x) / 2
        diffY = deltaY + (TL.y + BL.y) / 2
        Fixed = BR
        BX = BL
        CX = TR
        Va = { x: diffX - Fixed.x, y: diffY - Fixed.y }
        Vb = { x: BX.x - Fixed.x, y: BX.y - Fixed.y }
        scale =
          (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2))
        Vh = { x: CX.x - Fixed.x, y: CX.y - Fixed.y }
        Vw = { x: Vb.x * scale, y: Vb.y * scale }
        break
      case 'mr':
        diffX = deltaX + (TR.x + TR.x) / 2
        diffY = deltaY + (TR.y + TR.y) / 2
        Fixed = BL
        BX = BR
        CX = TL
        Va = { x: diffX - Fixed.x, y: diffY - Fixed.y }
        Vb = { x: BX.x - Fixed.x, y: BX.y - Fixed.y }
        scale =
          (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2))
        Vh = { x: CX.x - Fixed.x, y: CX.y - Fixed.y }
        Vw = { x: Vb.x * scale, y: Vb.y * scale }
        break
      default:
        break
    }
    // 反推宽高
    newX = Fixed.x + (Vw.x + Vh.x) / 2
    newY = Fixed.y + (Vw.y + Vh.y) / 2
    newW = Math.sqrt(Math.pow(Vw.x, 2) + Math.pow(Vw.y, 2))
    newH = Math.sqrt(Math.pow(Vh.x, 2) + Math.pow(Vh.y, 2))
  } else {
    // 拖动顶点
    switch (direction) {
      case 'tl':
        diffX = deltaX + TL.x
        diffY = deltaY + TL.y
        Fixed = BR
        BX = BL // 高度 TL BL
        CX = TR // 宽度 TL TR
        break
      case 'tr':
        diffX = deltaX + TR.x
        diffY = deltaY + TR.y
        Fixed = BL
        BX = BR
        CX = TL
        break
      case 'bl':
        diffX = deltaX + BL.x
        diffY = deltaY + BL.y
        Fixed = TR
        BX = TL
        CX = BR
        break
      case 'br':
        diffX = deltaX + BR.x
        diffY = deltaY + BR.y
        Fixed = TL
        BX = TR
        CX = BL
        break
      default:
        break
    }
    Va = { x: diffX - Fixed.x, y: diffY - Fixed.y }
    Vb = { x: BX.x - Fixed.x, y: BX.y - Fixed.y }
    Vc = { x: CX.x - Fixed.x, y: CX.y - Fixed.y }
    scaleB =
      (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2))
    scaleC =
      (Va.x * Vc.x + Va.y * Vc.y) / (Math.pow(Vc.x, 2) + Math.pow(Vc.y, 2))
    Vw = { x: Vb.x * scaleB, y: Vb.y * scaleB }
    Vh = { x: Vc.x * scaleC, y: Vc.y * scaleC }
    // 反推宽高
    newX = Fixed.x + (Vw.x + Vh.x) / 2
    newY = Fixed.y + (Vw.y + Vh.y) / 2
    newW = Math.sqrt(Math.pow(Vw.x, 2) + Math.pow(Vw.y, 2))
    newH = Math.sqrt(Math.pow(Vh.x, 2) + Math.pow(Vh.y, 2))
  }
  item.x = newX - newW / 2
  item.y = newY - newH / 2
  item.w = newW
  item.h = newH
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
        if (logDirection.value) {
          setResizabl(logState.value[i], logLocal.value, logDirection.value)
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
