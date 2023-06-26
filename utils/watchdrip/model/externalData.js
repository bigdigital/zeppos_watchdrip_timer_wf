import {TEST_DATA} from "../../config/constants";
import {MINUTE_IN_MS} from "../../../shared/date";

export class ExternalData {
    constructor(statusLine, time) {
        this.statusLine = statusLine;
        this.time = time;
    }

    getStatusLine() { 
        if (this.statusLine === "" || this.statusLine === undefined) {
            return "";
        }
        return this.statusLine;
    }

    getTime() {
        if (this.time === null || this.time === undefined) {
            return -1;
        }
        return this.time;
    }

    static createEmpty() {
        if (TEST_DATA) {
            return new ExternalData("115% 5.43U 28g", Date.now() - (6 * MINUTE_IN_MS));
        }
        return new ExternalData("", null);
    }
}