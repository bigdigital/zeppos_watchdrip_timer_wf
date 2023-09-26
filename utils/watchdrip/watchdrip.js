import {getGlobal} from "../../shared/global";
import {
    WATCHDRIP_ALARM_CONFIG_DEFAULTS,
    WATCHDRIP_APP_ID,
    WATCHDRIP_CONFIG,
    WATCHDRIP_CONFIG_DEFAULTS,
    WATCHDRIP_CONFIG_LAST_UPDATE,
    WF_INFO,
    WF_INFO_DIR,
    WF_INFO_FILE,
    WF_INFO_LAST_UPDATE,
    WF_INFO_LAST_UPDATE_ATTEMPT,
    WF_INFO_LAST_UPDATE_SUCCESS
} from "../config/global-constants";
import {json2str, str2json} from "../../shared/data";
import {MessageBuilder} from "../../shared/message";
import {
    APP_FETCH_TIMER_UPDATE_INTERVAL_MS,
    APP_FETCH_UPDATE_INTERVAL_MS,
    Commands,
    DATA_AOD_TIMER_UPDATE_INTERVAL_MS,
    DATA_AOD_UPDATE_INTERVAL_MS,
    DATA_STALE_TIME_MS,
    DATA_TIMER_UPDATE_INTERVAL_MS,
    DATA_UPDATE_INTERVAL_MS,
    GRAPH_LIMIT,
    MMOLL_TO_MGDL,
    USE_FILE_INFO_STORAGE,
    XDRIP_UPDATE_INTERVAL_MS
} from "../config/constants";
import * as fs from "./../../shared/fs";
import {WatchdripData} from "./watchdrip-data";
import {gotoSubpage} from "../../shared/navigate";
import {Graph} from "./graph/graph";
import {Viewport} from "./graph/viewport";

let {messageBuilder} = getApp()._options.globalData;

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
        this.lastUpdateSucessful = false;
        this.configLastUpdate = 0;
        this.updatingData = false;
        this.intervalTimer = null;
        this.firstRun = true;
        this.resumeCall = false;
        /*
        typeof Graph
        */
        this.graph = new Graph(0, 0, 0, 0);
    }

    //call before any usage of the class instance
    prepare() {
        watchdrip = this.globalNS.watchdrip;
    }

    start() {
        this.checkConfigUpdate();
        this.createWatchdripDir();
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
        } else if (this.isAppFetch()) {
            interval = APP_FETCH_UPDATE_INTERVAL_MS
        }
        return interval;
    }

    getTimerUpdateInterval() {
        let interval = DATA_TIMER_UPDATE_INTERVAL_MS;
        if (this.isAppFetch()) {
            interval = APP_FETCH_TIMER_UPDATE_INTERVAL_MS
        } else if (this.isAOD()) {
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

    readLastUpdate() {
        let lastInfoUpdate = hmFS.SysProGetInt64(WF_INFO_LAST_UPDATE);
        this.lastUpdateAttempt = hmFS.SysProGetInt64(WF_INFO_LAST_UPDATE_ATTEMPT);
        this.lastUpdateSucessful = hmFS.SysProGetBool(WF_INFO_LAST_UPDATE_SUCCESS);
        return lastInfoUpdate;
    }

    handleRareCases() {
        //debug.log("handleRareCases");
        let fetch = false;
        if (this.lastUpdateAttempt == null || this.lastUpdateAttempt === undefined) {
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
        //debug.log("checkUpdates");
        if (this.checkConfigUpdate()) {
            return; //restart
        }
        this.updateTimesWidget();

        if (this.watchdripConfig.disableUpdates) {
            debug.log("disableUpdates, return");
            return;
        }
        if (this.updatingData) {
            debug.log("updatingData, return");
            return;
        }
        let lastInfoUpdate = this.readLastUpdate();
        if (!lastInfoUpdate) {
            this.handleRareCases();
        } else {
            if (this.lastUpdateSucessful) {
                if (this.lastInfoUpdate !== lastInfoUpdate) {
                    //update widgets because the data was modified outside the current scope
                    debug.log("update from remote");
                    this.readInfo();
                    this.lastInfoUpdate = lastInfoUpdate;
                    this.updateWidgets();
                }
                if (this.isTimeout(lastInfoUpdate, this.updateIntervals)) {
                    debug.log("reached updateIntervals");
                    this.fetchInfo();
                    return;
                }
                const bgTimeOlder = this.isTimeout(this.watchdripData.getBg().time, XDRIP_UPDATE_INTERVAL_MS);
                const statusNowOlder = this.isTimeout(this.watchdripData.getStatus().now, XDRIP_UPDATE_INTERVAL_MS);
                if (bgTimeOlder || statusNowOlder) {
                    if (!this.isTimeout(this.lastUpdateAttempt, DATA_STALE_TIME_MS)) {
                        debug.log("wait DATA_STALE_TIME");
                        return;
                    }
                    debug.log("data older than sensor update interval");
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

    //connect watch with side app
    initConnection() {
        if (this.connectionActive) {
            return;
        }
        debug.log("initConnection");
        this.connectionActive = true;
        const appId = WATCHDRIP_APP_ID;
        //we need to recreate connection to force start side app
        messageBuilder = new MessageBuilder({appId});
        messageBuilder.connect();
    }

    dropConnection() {
        if (!this.connectionActive) {
            return;
        }
        debug.log("dropConnection");
        messageBuilder.disConnect();
        this.connectionActive = false;
    }

    /*Callback which is called  when watchface is active  (visible)*/
    widgetDelegateCallbackResumeCall() {
        debug.log("resume_call");
        //for some reason the wf can call resume two times
        if (!this.resumeCall) {
            this.resumeCall = true;
            //prevent two reading(useful for AOD)
            if (this.firstRun) {
                this.firstRun = false;
                this.readInfo();
            }
            this.updatingData = false;
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
        this.updatingData = false;
        this.updateFinish();
        this.dropConnection();
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
            this.onUpdateFinishCallback(this.lastUpdateSucessful);
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
            if (name && name in this.graphLineStyles) {
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

    isAppFetch() {
        return this.watchdripConfig.useAppFetch === true;
    }

    resetLastUpdate() {
        this.lastUpdateAttempt = this.timeSensor.utc;
        hmFS.SysProSetInt64(WF_INFO_LAST_UPDATE_ATTEMPT, this.lastUpdateAttempt);
        this.lastUpdateSucessful = false;
        hmFS.SysProSetBool(WF_INFO_LAST_UPDATE_SUCCESS, this.lastUpdateSucessful);
    }

    fetchInfo() {
        debug.log("fetchInfo");
        this.resetLastUpdate();
        if (this.isAppFetch()) {
            gotoSubpage('update', {
                    params: WATCHDRIP_ALARM_CONFIG_DEFAULTS
                },
                WATCHDRIP_APP_ID);
            return;
        }

        this.initConnection();

        if (messageBuilder.connectStatus() === false) {
            debug.log("No BT Connection");
            return;
        }
        this.updatingData = true;
        this.updateStart();
        var params = WATCHDRIP_ALARM_CONFIG_DEFAULTS.fetchParams;
        messageBuilder
            .request({
                method: Commands.getInfo,
                params: params
            }, {
                timeout: 5000
            })
            .then((data) => {
                debug.log("received data");
                let {result: info = {}} = data;
                try {
                    if (info.error) {
                        debug.log("Error");
                        debug.log(info);
                        return;
                    }
                    //debug.log(info);
                    this.lastInfoUpdate = this.saveInfo(info);
                    let dataInfo = str2json(info);
                    info = null;
                    this.watchdripData.setData(dataInfo);
                    this.watchdripData.updateTimeDiff();
                    dataInfo = null;
                    this.updateWidgets();
                } catch (e) {
                    debug.log("error:" + e);
                }
            })
            .catch((error) => {
                debug.log("fetch error:" + error);
            })
            .finally(() => {
                this.updatingData = false;
                if (typeof this.onUpdateFinishCallback === "function") {
                    this.onUpdateFinishCallback(this.lastUpdateSucessful);
                }
                if (this.isAOD()) {
                    this.dropConnection();
                }
            });
    }

    createWatchdripDir() {
        if (USE_FILE_INFO_STORAGE && !this.isAOD()) {
            if (!fs.statSync(WF_INFO_DIR)) {
                fs.mkdirSync(WF_INFO_DIR);
            }
            // const [fileNameArr] = hmFS.readdir("/storage");
            // debug.log(fileNameArr);
        }
    }

    readInfo() {
        let info = "";
        if (USE_FILE_INFO_STORAGE) {
            info = fs.readTextFile(WF_INFO_FILE);
        } else {
            info = hmFS.SysProGetChars(WF_INFO);
        }
        if (info) {
            let data = {};
            try {
                data = str2json(info);
                info = null;
                debug.log("data was read");
                this.watchdripData.setData(data);
                this.watchdripData.timeDiff = 0;
            } catch (e) {

            }
            data = null;
            return true
        }
        return false;
    }

    saveInfo(info) {
        if (USE_FILE_INFO_STORAGE) {
            fs.writeTextFile(WF_INFO_FILE, info);
        } else {
            hmFS.SysProSetChars(WF_INFO, info);
        }
        this.lastUpdateSucessful = true;
        let time = this.timeSensor.utc;
        hmFS.SysProSetInt64(WF_INFO_LAST_UPDATE, time);
        hmFS.SysProSetBool(WF_INFO_LAST_UPDATE_SUCCESS, this.lastUpdateSucessful);
        return time;
    }

    /*Read config which is defined in the app. If not defined, init config*/
    readConfig() {
        let configStr = hmFS.SysProGetChars(WATCHDRIP_CONFIG);
        if (!configStr) {
            this.watchdripConfig = WATCHDRIP_CONFIG_DEFAULTS;
            this.saveConfig();
        } else {
            try {
                this.watchdripConfig = str2json(configStr);
            } catch (e) {

            }
        }
    }

    saveConfig() {
        hmFS.SysProSetChars(WATCHDRIP_CONFIG, json2str(this.watchdripConfig));
        hmFS.SysProSetInt64(WATCHDRIP_CONFIG_LAST_UPDATE, this.timeSensor.utc);
    }

    /* will check last config updates to sync config with app*/
    checkConfigUpdate() {
        let configLastUpdate = hmFS.SysProGetInt64(WATCHDRIP_CONFIG_LAST_UPDATE);
        if (this.configLastUpdate !== configLastUpdate) {
            debug.log("detected config change");
            this.configLastUpdate = configLastUpdate;
            this.readConfig();
            debug.setEnabled(this.watchdripConfig.showLog);
            //restart timer (the fetch mode can be changed)
            this.stopDataUpdates();
            this.startDataUpdates();
            return true;
        }
        return false
    }

    destroy() {
        this.stopDataUpdates();
        this.dropConnection();
    }
}