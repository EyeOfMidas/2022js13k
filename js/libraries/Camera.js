import { Point } from "./spatial/Point.js";

export class Camera {
    constructor() {
        this.position = new Point(0, 0)
        this.targetPosition = new Point(0, 0)
        this.angle = 0;
        this.scale = new Point(1, 1)
        this.canvasBounds = null;
        this.speed = 2
    }
    update(delta) {
        if(!this.targetPosition.equals(this.position)) {
            let direction = this.position.vectorTo(this.targetPosition)
            direction.scale(this.speed, this.speed)
            this.position.offset(direction)
            this.position.roundTo(this.targetPosition, this.speed, this.speed)
        }
    }

    drawAtCamera(ctx, scaledCanvas, drawFunc) {
        this.canvasBounds = scaledCanvas.bounds;
        ctx.save();
        ctx.translate(-this.position.x, -this.position.y);
        drawFunc(ctx, scaledCanvas);
        ctx.restore();
    }

    draw(ctx, scaledCanvas, drawFunc) {
        this.canvasBounds = scaledCanvas.bounds;
        ctx.save();
        ctx.translate(-this.position.x + Math.round(this.canvasBounds.width / 2), -this.position.y + Math.round(this.canvasBounds.height / 2));
        ctx.scale(this.scale.x, this.scale.y)
        drawFunc(ctx, scaledCanvas);
        ctx.restore();
    }

    screenToWorld(touchPosition) {
        let position = new Point(touchPosition.x,touchPosition.y)
        position.x += this.position.x - Math.round(this.canvasBounds.width / 2)
        position.y += this.position.y - Math.round(this.canvasBounds.height / 2)
        position.scale(1/this.scale.x, 1/this.scale.y)
        return position
    }

    worldToScreen(charPosition) {
        let position = new Point(charPosition.x, charPosition.y)
        position.scale(this.scale.x, this.scale.y)
        position.x += -this.position.x + Math.round(this.canvasBounds.width / 2)
        position.y += -this.position.y + Math.round(this.canvasBounds.height / 2)
        return position
    }
}