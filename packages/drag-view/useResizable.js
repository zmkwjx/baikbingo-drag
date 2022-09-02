import { ref } from 'vue'

/**
 * 旋转之后的八点坐标
 * @param {*} item
 */
const transform = item => {
  const { x, y, w, h } = item
  const r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) / 2
  const a = Math.round((Math.atan(h / w) * 180) / Math.PI)
  const tlbra = 180 - item.r - a
  const trbla = a - item.r
  const ta = 90 - item.r
  const ra = item.r
  // 获取中位
  const halfWidth = w / 2
  const halfHeight = h / 2
  // 获取中心点坐标
  const middleX = x + halfWidth
  const middleY = y + halfHeight
  // 获取八点坐标
  const topLeft = {
    x: middleX + r * Math.cos((tlbra * Math.PI) / 180),
    y: middleY - r * Math.sin((tlbra * Math.PI) / 180)
  }
  const top = {
    x: middleX + halfHeight * Math.cos((ta * Math.PI) / 180),
    y: middleY - halfHeight * Math.sin((ta * Math.PI) / 180)
  }
  const topRight = {
    x: middleX + r * Math.cos((trbla * Math.PI) / 180),
    y: middleY - r * Math.sin((trbla * Math.PI) / 180)
  }
  const right = {
    x: middleX + halfWidth * Math.cos((ra * Math.PI) / 180),
    y: middleY + halfWidth * Math.sin((ra * Math.PI) / 180)
  }
  const bottomRight = {
    x: middleX - r * Math.cos((tlbra * Math.PI) / 180),
    y: middleY + r * Math.sin((tlbra * Math.PI) / 180)
  }
  const bottom = {
    x: middleX - halfHeight * Math.sin((ra * Math.PI) / 180),
    y: middleY + halfHeight * Math.cos((ra * Math.PI) / 180)
  }
  const bottomLeft = {
    x: middleX - r * Math.cos((trbla * Math.PI) / 180),
    y: middleY + r * Math.sin((trbla * Math.PI) / 180)
  }
  const left = {
    x: middleX - halfWidth * Math.cos((ra * Math.PI) / 180),
    y: middleY - halfWidth * Math.sin((ra * Math.PI) / 180)
  }
  // 找到最小/大的X/Y坐标值
  const minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x)
  const maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x)
  const minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y)
  const maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y)
  return {
    point: [
      topLeft,
      top,
      topRight,
      right,
      bottomRight,
      bottom,
      bottomLeft,
      left
    ],
    width: maxX - minX,
    height: maxY - minY,
    left: minX,
    right: maxX,
    top: minY,
    bottom: maxY
  }
}

function getScaledRect (params, baseIndex) {
  var { x, y, w, h, r, scale } = params
  var offset = {
    x: 0,
    y: 0
  }
  var deltaXScale = scale.x - 1
  var deltaYScale = scale.y - 1
  var deltaWidth = w * deltaXScale
  var deltaHeight = h * deltaYScale
  var newWidth = w + deltaWidth
  var newHeight = h + deltaHeight
  var newX = x - deltaWidth / 2
  var newY = y - deltaHeight / 2
  if (baseIndex) {
    var points = [
      { x, y },
      { x: x + w, y },
      { x: x + w, y: y + h },
      { x, y: y + h }
    ]
    var newPoints = [
      { x: newX, y: newY },
      { x: newX + newWidth, y: newY },
      { x: newX + newWidth, y: newY + newHeight },
      { x: newX, y: newY + newHeight }
    ]
    offset.x = points[baseIndex].x - newPoints[baseIndex].x
    offset.y = points[baseIndex].y - newPoints[baseIndex].y
  }
  return {
    x: newX + offset.x,
    y: newY + offset.y,
    w: newWidth,
    h: newHeight,
    r
  }
}

/**
 * 根据缩放基点和缩放比例取得新的rect
 * @param  {[type]} oPoint               [description]
 * @param  {[type]} scale            [description]
 * @param  {[type]} oTransformedRect [description]
 * @param  {[type]} baseIndex        [description]
 * @return {[type]}                  [description]
 */
const getNewRect = (oPoint, scale, oTransformedRect, baseIndex) => {
  const scaledRect = getScaledRect({ scale, ...oPoint })
  const transformedRotateRect = transform(scaledRect)
  // 计算到平移后的新坐标
  const translatedX =
    oTransformedRect.point[baseIndex].x -
    transformedRotateRect.point[baseIndex].x +
    transformedRotateRect.left
  const translatedY =
    oTransformedRect.point[baseIndex].y -
    transformedRotateRect.point[baseIndex].y +
    transformedRotateRect.top

  // 计算平移后元素左上角的坐标
  const newX = translatedX + transformedRotateRect.width / 2 - scaledRect.w / 2
  const newY = translatedY + transformedRotateRect.height / 2 - scaledRect.h / 2

  // 缩放后元素的高宽
  const newWidth = scaledRect.w
  const newHeight = scaledRect.h

  return {
    x: newX,
    y: newY,
    w: newWidth,
    h: newHeight
  }
}

// 保留n位小数
const toNumberFixed = (value, n = 3) => {
  const num = value.toFixed(n)
  return Number(num)
}

// 计算两个坐标点之间的距离
const getDistance = (a, b) => {
  const x = Math.pow(a.x - b.x, 2)
  const y = Math.pow(a.y - b.y, 2)
  return Math.sqrt(x + y)
}

// 拒绝拉伸
const stopResizabl = (point, local) => {
  // const L1 = getDistance(point, local[0])
  const L2 = getDistance(point, local[1])
  const L3 = getDistance(local[0], local[1])
  return L2 === L3
}

// 开始拉伸
const directionIndex = { wn: 4, n: 5, en: 6, e: 7, es: 0, s: 1, ws: 2, w: 3 }
const setResizabl = (item, local, direction) => {
  const baseIndex = directionIndex[direction]
  // 计算初始状态旋转后的rect
  const transformedRect = transform(item)
  // 取得旋转后的8点坐标
  const { point } = transformedRect
  // 判断是否可以拉伸
  if (stopResizabl(point[baseIndex], local)) return
  // 获取对角线点
  const oppositeX = point[baseIndex].x
  const oppositeY = point[baseIndex].y
  // 鼠标释放点距离当前点对角线点的偏移量
  const offsetWidth = Math.abs(local[0].x - oppositeX)
  const offsetHeight = Math.abs(local[0].y - oppositeY)
  // 记录最原始的状态
  const oPoint = Object.assign({}, item)
  // 判断是根据x方向的偏移量来计算缩放比还是y方向的来计算
  const scale = { x: 1, y: 1 }
  let realScale = 1
  if (offsetWidth > offsetHeight) {
    realScale = Math.abs(local[1].x - oppositeX) / offsetWidth
  } else {
    realScale = Math.abs(local[1].y - oppositeY) / offsetHeight
  }
  if ([0, 2, 4, 6].indexOf(baseIndex) >= 0) {
    scale.x = scale.y = realScale
  } else if ([1, 5].indexOf(baseIndex) >= 0) {
    scale.y = realScale
  } else if ([3, 7].indexOf(baseIndex) >= 0) {
    scale.x = realScale
  }
  // 获取新的坐标
  const { x, y, w, h } = getNewRect(oPoint, scale, transformedRect, baseIndex)
  item.x = toNumberFixed(x)
  item.y = toNumberFixed(y)
  item.w = toNumberFixed(w <= 1 ? 1 : w)
  item.h = toNumberFixed(h <= 1 ? 1 : h)
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
    // logTimer.value && clearTimeout(logTimer.value)
    // logTimer.value = setTimeout(() => {
    for (let i = 0; i < logState.value.length; i++) {
      if (logDirection.value) {
        setResizabl(logState.value[i], logLocal.value, logDirection.value)
      }
    }
    logLocal.value[0].x = logLocal.value[1].x
    logLocal.value[0].y = logLocal.value[1].y
    // })
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
