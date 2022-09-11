import { ScaledCanvas } from './ScaledCanvas.js'

export class CanvasRenderer {
    constructor() {
        this.context = null
    }

    init(container, scene) {
        this.scaledCanvas = new ScaledCanvas(container)
        this.scaledCanvas.init()
        this.scaledCanvas.setImageSmoothing(false)
        this.context = this.scaledCanvas.getContext()
        this.setScene(scene)
    }

    animate() {
        this.scaledCanvas.clearFrame()
        let canvas = this.getCanvas()
        this.scene.draw(canvas.getContext(), canvas)
        requestAnimationFrame(this.animate.bind(this))
    }

    setScene(scene) {
        this.scene = scene
    }

    start() {
        this.animate()
    }

    getCanvas() {
        return this.scaledCanvas
    }
}