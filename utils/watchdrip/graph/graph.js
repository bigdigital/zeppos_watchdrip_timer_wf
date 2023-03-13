import {getGlobal} from "../../../shared/global";
/*
typeof DebugText
*/
let debug = null;
export class Graph {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.xBound = this.x + width;
        this.yBound = this.y + height;
        this.widgets = [];
        this.globalNS = getGlobal();
        debug = this.globalNS.debug;
    }

    setLines(lines) {
        this.lines = lines;
    }

    setViewport(viewport) {
        this.viewport = viewport;
    }

    draw() {
        if (typeof this.lines === 'undefined') {
            debug.log("No data");
            return;
        }

        this.clear();

        if (typeof this.viewport === 'undefined') {
            debug.log("viewport not defined");
            return;
        }

        let viewportWidth = this.viewport.right - this.viewport.left;
        let viewportHeight = this.viewport.top - this.viewport.bottom;
        Object.keys(this.lines).forEach(key => {
            let line = this.lines[key];
            line.points.every(point => {
                    let time = point[0];
                    let val = point[1];
                    let diffx = time - this.viewport.left
                    let x = (diffx * this.width) / viewportWidth

                    let diffy = val - this.viewport.bottom
                    let y = (diffy * this.height) / viewportHeight

                    return !this.drawElement(x, y, line.pointStyle, key);
                }
            );
        });
        //debug.log("Graph el created: " + this.widgets.length)
    }

    drawElement(x, y, pointStyle, lineName) {
        let xPos = this.x + x - pointStyle.width / 2;
        let yPos = this.y + this.height - y - pointStyle.height / 2;
        if (lineName.startsWith("line")) {
            this.drawLine(xPos, yPos, pointStyle);
            return true;
        } else {
            this.drawPoint(xPos, yPos, pointStyle);
        }
        return false;
    }

    drawLine(x, y, pointStyle) {
        if (y < this.y || y > this.yBound) {
            return;
        }
        pointStyle.width = this.width;
        this.createWidget(this.x, y, pointStyle);
    }

    drawPoint(x, y, pointStyle) {
        if (x < this.x || x > this.xBound) {
            return;
        }
        if (y < this.y || y > this.yBound) {
            return;
        }
        this.createWidget(x, y, pointStyle);
    }

    createWidget(x, y, pointStyle) {
        let widget;
        if (pointStyle.imageFile === "") {
            let color = parseInt(pointStyle.color, 16);
            widget = hmUI.createWidget(hmUI.widget.FILL_RECT, {
                x: x,
                y: y,
                w: pointStyle.width,
                h: pointStyle.height,
                radius: pointStyle.radius,
                color: color,
                show_level: hmUI.show_level.ONLY_NORMAL,
            })
        } else {
            widget = hmUI.createWidget(hmUI.widget.IMG, {
                x: x,
                y: y,
                src: pointStyle.imageFile,
                show_level: hmUI.show_level.ONLY_NORMAL,
            })
        }
        this.widgets.push(widget);
    }

    clear() {
        this.widgets.forEach(widget => {
            hmUI.deleteWidget(widget);
        });

        this.widgets = [];
        //debug.log("Graph clear");
    }
}