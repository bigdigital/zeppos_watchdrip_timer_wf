import {getGlobal} from "../../../shared/global";
import {Graph} from "./graph";
/*
typeof DebugText
*/
let debug = null;
export class PolylineGraph extends Graph {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.polyline
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


    clear() {
        polyline.clear()
    }
}