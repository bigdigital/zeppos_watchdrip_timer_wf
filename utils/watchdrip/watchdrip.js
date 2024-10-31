import {getGlobal} from "../../shared/global";
import {
    WATCHDRIP_APP_ID, WATCHDRIP_INFO_DEFAULTS,
    WF_INFO_FILE, WF_STATUS_FILE,
} from "../config/global-constants";
import {
    DATA_AOD_TIMER_UPDATE_INTERVAL_MS,
    DATA_AOD_UPDATE_INTERVAL_MS,
    DATA_STALE_TIME_MS,
    DATA_TIMER_UPDATE_INTERVAL_MS,
    DATA_UPDATE_INTERVAL_MS,
    GRAPH_LIMIT,
    MMOLL_TO_MGDL,
    XDRIP_UPDATE_INTERVAL_MS
} from "../config/constants";
import {WatchdripData} from "./watchdrip-data";
import {gotoSubpage} from "../../shared/navigate";
import {Graph} from "./graph/graph";
import {Viewport} from "./graph/viewport";
import {Path} from "../path";
import {InfoStorage} from "./infoStorage";

/*
typeof DebugText
*/
var debug = null;
/*
typeof Watchdrip
*/
var watchdrip = null;

export class Watchdrip {
    constructor() {
        this.screenType = hmSetting.getScreenType();

        this.globalNS = getGlobal();
        debug = this.globalNS.debug;
        this.timeSensor = hmSensor.createSensor(hmSensor.id.TIME);
        this.watchdripData = new WatchdripData(this.timeSensor);

        this.lastInfoUpdate = 0;
        this.lastUpdateAttempt = null;
        this.intervalTimer = null;
        this.resumeCall = false;
        /*
        typeof Graph
        */
        this.graph = new Graph(0, 0, 0, 0);
        this.infoFile = new Path("data", WF_INFO_FILE, WATCHDRIP_APP_ID);
        this.statusStorage = new InfoStorage(
            new Path("data", WF_STATUS_FILE, WATCHDRIP_APP_ID), WATCHDRIP_INFO_DEFAULTS
        );
    }

    //call before any usage of the class instance
    prepare() {
        watchdrip = this.globalNS.watchdrip;
    }

    start() {
        this.updateIntervals = this.getUpdateInterval();
        this.readInfo();
        this.updateWidgets();
        //Monitor watchface activity in order to recreate connection
        if (this.isAOD()) {
            this.widgetDelegateCallbackResumeCall();
        } else {
            hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
                resume_call: () => {
                    this.widgetDelegateCallbackResumeCall();
                },
                pause_call: () => {
                    this.widgetDelegateCallbackPauseCall();
                }
            });
        }
    }

    getUpdateInterval() {
        let interval = DATA_UPDATE_INTERVAL_MS;
        if (this.isAOD()) {
            interval = DATA_AOD_UPDATE_INTERVAL_MS;
        }
        return interval;
    }

    getTimerUpdateInterval() {
        let interval = DATA_TIMER_UPDATE_INTERVAL_MS;
        if (this.isAOD()) {
            interval = DATA_AOD_TIMER_UPDATE_INTERVAL_MS;
        }
        return interval;
    }

    startDataUpdates() {
        if (this.intervalTimer != null) return; //already started
        let interval = this.getTimerUpdateInterval();
        debug.log("startDataUpdates, interval: " + interval);
        this.intervalTimer = this.globalNS.setInterval(() => {
            this.checkUpdates();
        }, interval);
        this.checkUpdates(); //for zepp os3 need to start manually
    }

    stopDataUpdates() {
        if (this.intervalTimer !== null) {
            debug.log("stopDataUpdates");
            this.globalNS.clearInterval(this.intervalTimer);
            this.intervalTimer = null;
        }
    }

    isAOD() {
        return this.screenType === hmSetting.screen_type.AOD;
    }

    isTimeout(time, timeout_ms) {
        if (!time) {
            return false;
        }
        return this.timeSensor.utc - time > timeout_ms;
    }


    handleRareCases() {
        //debug.log("handleRareCases");
        let fetch = false;
        if (this.lastUpdateAttempt == null || this.lastUpdateAttempt == 0 || this.lastUpdateAttempt === undefined) {
            debug.log("initial fetch");
            fetch = true;
        } else if (this.isTimeout(this.lastUpdateAttempt, DATA_STALE_TIME_MS)) {
            debug.log("the side app not responding, force update again");
            fetch = true;
        }
        if (fetch) {
            this.fetchInfo();
        }
    }

    checkUpdates() {
        debug.log("checkUpdates");

        this.updateTimesWidget();
        this.statusStorage.read();

        const lastUpd = this.statusStorage.data.lastUpd;
        debug.log("lastUpd " + lastUpd);
        if (!lastUpd) {
            this.handleRareCases();
        } else {
            if (this.statusStorage.data.lastError === '') {
                if (lastUpd !== 0 && this.lastInfoUpdate !== lastUpd) {
                    //update widgets because the data was modified outside the current scope
                    debug.log("update from remote");
                    this.readInfo();
                    this.lastInfoUpdate = lastUpd;
                    this.updateWidgets();
                    this.updateFinish();
                    return;
                }
                if (this.isTimeout(lastUpd, this.updateIntervals)) {
                    debug.log("reached updateIntervals");
                    this.fetchInfo();
                    return;
                }
                //data not modified from outside scope so nothing to do
                debug.log("data not modified");
            } else {
                this.handleRareCases();
            }
        }
    }


    /*Callback which is called  when watchface is active  (visible)*/
    widgetDelegateCallbackResumeCall() {
        debug.log("resume_call");
        //for some reason the wf can call resume two times
        if (!this.resumeCall) {
            this.resumeCall = true;
            this.readInfo();
            this.updateWidgets();
            this.startDataUpdates();
        } else {
            debug.log("prevent second resume");
        }
    }

    /*Callback which is called  when watchface deactivating (not visible)*/
    widgetDelegateCallbackPauseCall() {
        //debug.log("pause_call");
        this.stopDataUpdates();
        this.resumeCall = false;
        this.updateFinish();
    }

    setUpdateValueWidgetCallback(callback) {
        this.updateValueWidgetCallback = callback;
    }

    setUpdateTimesWidgetCallback(callback) {
        this.updateTimesWidgetCallback = callback;
    }

    setOnUpdateStartCallback(callback) {
        this.onUpdateStartCallback = callback;
    }

    setOnUpdateFinishCallback(callback) {
        this.onUpdateFinishCallback = callback;
    }

    updateWidgets() {
        debug.log("updateWidgets");
        this.updateValuesWidget()
        this.updateTimesWidget()
    }

    updateValuesWidget() {
        if (typeof this.updateValueWidgetCallback === "function") {
            this.updateValueWidgetCallback(this.watchdripData);
        }
        this.drawGraph();
    }

    updateTimesWidget() {
        if (typeof this.updateTimesWidgetCallback === "function") {
            this.updateTimesWidgetCallback(this.watchdripData);
        }
    }

    updateStart() {
        if (typeof this.onUpdateStartCallback === "function") {
            this.onUpdateStartCallback();
        }
    }

    updateFinish() {
        if (typeof this.onUpdateFinishCallback === "function") {
            this.onUpdateFinishCallback(true);
        }
    }

    createGraph(x, y, width, height, lineStyles) {
        this.graph = new Graph(x, y, width, height);
        this.graphLineStyles = lineStyles;
    }

    //draw graph only on normal display
    //the aod mode is glitchy
    drawGraph() {
        if (this.graph == null || this.isAOD()) {
            return;
        }
        if (!this.graph.visibility) {
            this.graph.clear();
            return;
        }

        let graphInfo = this.watchdripData.getGraph();
        if (graphInfo.start === "") {
            this.graph.clear();
            return;
        }
        //debug.log("draw graph");
        let viewportTop = this.watchdripData.getStatus().isMgdl ? GRAPH_LIMIT * MMOLL_TO_MGDL : GRAPH_LIMIT;
        this.graph.setViewport(new Viewport(graphInfo.start, graphInfo.end, 0, viewportTop));
        let lines = {};
        graphInfo.lines.forEach(line => {
            let name = line.name;
            if (name !== "" && name in this.graphLineStyles) {
                let lineStyle = this.graphLineStyles[name];
                //if image not defined, use default line color
                if (lineStyle.color === "" && lineStyle.imageFile === "") {
                    lineStyle.color = line.color;
                }
                let lineObj = {};
                lineObj.pointStyle = lineStyle;
                lineObj.points = line.points;
                lines[name] = lineObj;
            }
        });

        //debug.log("Lines count : " + Object.keys(lines).length);
        this.graph.setLines(lines);
        this.graph.draw();
    }

    resetLastUpdate() {
        debug.log("resetLastUpdate");
        this.lastUpdateAttempt = this.timeSensor.utc;
    }

    fetchInfo() {
        debug.log("fetchInfo");
        this.resetLastUpdate();
        this.updateStart();
        gotoSubpage('update', {},
            WATCHDRIP_APP_ID);
    }

    readInfo() {
        let data = this.infoFile.fetchJSON();
        if (data) {
            debug.log("data was read");
            this.watchdripData.setData(data);
            this.watchdripData.timeDiff = 0;
            data = null;
            return true
        }
        return false;
    }

    /* will check last config updates to sync config with app*/


    destroy() {
        this.stopDataUpdates();
    }
}