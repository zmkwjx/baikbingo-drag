import DrawBoard from './drag-draw'
import DragView from './drag-item'

export const install = app => {
  DrawBoard.install(app)
  DragView.install(app)
}

export { DrawBoard, DragView }
