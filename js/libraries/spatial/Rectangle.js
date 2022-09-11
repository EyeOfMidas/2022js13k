import { Point } from "./Point.js";

export class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    pointWithin(point) {
        return point.x > this.x &&
            point.x < this.x + this.width &&
            point.y > this.y &&
            point.y < this.y + this.height;
    }

    get center() {
        return new Point(this.x + this.width / 2, this.y + this.height / 2);
    }
}