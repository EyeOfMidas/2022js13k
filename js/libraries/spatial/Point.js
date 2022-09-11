export class Point {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    clone(point) {
        this.x = point.x
        this.y = point.y
        return this
    }

    scale(x, y) {
        this.x *= x;
        this.y *= y;
        return this
    }

    difference(point){
        return new Point(this.x - point.x, this.y - point.y)
    }

    equals(point) {
        return this.x == point.x && this.y == point.y
    }

    offset(point) {
        this.x += point.x
        this.y += point.y
        return this
    }

    angleTo(point) {
        return Math.atan2(point.y - this.y, point.x - this.x)
    }

    vectorTo(point) {
        let angle = this.angleTo(point)
        return new Point(Math.cos(angle), Math.sin(angle))
    }

    distanceTo(point) {
        return Math.hypot(point.y - this.y, point.x - this.x)
    }

    roundTo(point, threshholdX, threshholdY) {
        let diff = this.difference(point)
        if(Math.abs(diff.x) <= threshholdX) {
            this.x = point.x
        }

        if(Math.abs(diff.y) <= threshholdY) {
            this.y = point.y
        }
    }
}