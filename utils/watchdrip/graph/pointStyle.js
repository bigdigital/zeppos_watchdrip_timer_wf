export class PointStyle {
    constructor(width, height, radius = 0, imageFile = "", color = "") {
        this.width = width;
        this.height = height;
        this.radius = radius
        this.imageFile = imageFile;
        this.color = color;
    }
}