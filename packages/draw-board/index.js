import DrawBoard from './DrawBoard.vue'

DrawBoard.install = app => {
  app.component('bk-draw-board', DrawBoard)
}

export default DrawBoard
