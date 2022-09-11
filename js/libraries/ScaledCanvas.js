import { Rectangle } from "./spatial/Rectangle.js";

export class ScaledCanvas {
    constructor(container) {
        this.canvas = null;
        this.context = null;
        this.container = container;
        this.bounds = new Rectangle()
    }
    
    clearFrame() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    init() {
        this.canvas = document.createElement("canvas");
        this.container.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        let ratio = this.getPixelRatio();
        this.bounds = new Rectangle(0, 0, this.canvas.width / ratio, this.canvas.height / ratio);
        window.addEventListener("resize", this.onResize);
        this.onResize();
    }

    setImageSmoothing(flag) {
        this.context.imageSmoothingEnabled = flag
    }
        
    getPixelRatio() {
        let dpr = window.devicePixelRatio || 1;
        let bsr = this.context.webkitBackingStorePixelRatio ||
            this.context.mozBackingStorePixelRatio ||
            this.context.msBackingStorePixelRatio ||
            this.context.oBackingStorePixelRatio ||
            this.context.backingStorePixelRatio || 1;
    
        return dpr / bsr;
    }
    
    onResize = () => {
        let ratio = this.getPixelRatio();
        let bounds = this.canvas.getBoundingClientRect();
        this.bounds.x = bounds.x
        this.bounds.y = bounds.y
        this.bounds.width = bounds.width
        this.bounds.height = bounds.height

        this.canvas.width = bounds.width * ratio;
        this.canvas.height = bounds.height * ratio;
        this.context.scale(ratio, ratio);
    }

    getContext() {
        return this.context;
    }

    get pixelWidth() {
        return this.canvas.width;
    }

    get pixelHeight() {
        return this.canvas.height;
    }

    get center() {
        return this.bounds.center;
    }

    getBounds() {
        return this.bounds
    }
}