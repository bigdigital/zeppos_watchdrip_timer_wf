import {getGlobal} from "../../shared/global";
import {
    WATCHDRIP_ALARM_CONFIG_DEFAULTS,
    WATCHDRIP_APP_ID,
    WATCHDRIP_CONFIG,
    WATCHDRIP_CONFIG_DEFAULTS,
    WATCHDRIP_CONFIG_LAST_UPDATE,
    WF_INFO,
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
    DATA_UPDATE_INTERVAL_MS
} from "../config/constants";
import {WatchdripData} from "./watchdrip-data";
import {gotoSubpage} from "../../shared/navigate";

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

        this.system_alarm_id = null;
        this.lastInfoUpdate = 0;
        this.lastUpdateAttempt = null;
        this.lastUpdateSucessful = false;
        this.configLastUpdate = 0;
        this.updatingData = false;
        this.intervalTimer = null;
    }

    //call before any usage of the class instance
    prepare() {
        watchdrip = this.globalNS.watchdrip;
    }

    start() {
        this.checkConfigUpdate();
        this.updateIntervals = this.getUpdateInterval();
        this.readInfo();
        this.updateValuesWidget();
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
        if (this.isAOD()) {
            interval = DATA_AOD_TIMER_UPDATE_INTERVAL_MS;
        } else if (this.isAppFetch()) {
            interval = APP_FETCH_TIMER_UPDATE_INTERVAL_MS
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
        return this.timeSensor.utc - time > timeout_ms;
    }

    readLastUpdate() {
        let lastInfoUpdate = hmFS.SysProGetInt64(WF_INFO_LAST_UPDATE);
        this.lastUpdateAttempt = hmFS.SysProGetInt64(WF_INFO_LAST_UPDATE_ATTEMPT);
        this.lastUpdateSucessful = hmFS.SysProGetBool(WF_INFO_LAST_UPDATE_SUCCESS);
        return lastInfoUpdate;
    }

    checkUpdates() {
        //debug.log("checkUpdates");
        this.checkConfigUpdate();
        this.updateTimesWidget();

        if (this.watchdripConfig.disableUpdates) {
            return;
        }

        if (this.updatingData) {
            // debug.log("updatingData, return");
            return;
        }
        let lastInfoUpdate = this.readLastUpdate();
        if (!lastInfoUpdate) {
            if (this.lastUpdateAttempt == null) {
                debug.log("initial fetch");
                this.fetchInfo();
                return;
            }
            if (this.isTimeout(this.lastUpdateAttempt, DATA_STALE_TIME_MS)) {
                debug.log("the side app not responding, force update again");
                this.fetchInfo();
                return;
            }
        } else {
            if (!this.lastUpdateSucessful) {
                if (this.lastUpdateAttempt !== null)
                    if (this.isTimeout(this.lastUpdateAttempt, DATA_STALE_TIME_MS)) {
                        debug.log("reached DATA_STALE_TIME_MS");
                        this.fetchInfo();
                        return;
                    } else {
                        return;
                    }
            }
            if (this.isTimeout(lastInfoUpdate, this.updateIntervals)) {
                debug.log("reached updateIntervals");
                this.fetchInfo();
                return;
            }
            if (this.lastInfoUpdate === lastInfoUpdate) {
                //data not modified from outside scope so nothing to do
                //debug.log("data not modified");
                return;
            }
            //update widgets because the data was modified outside the current scope
            debug.log("update from remote");
            this.readInfo();
            this.lastInfoUpdate = lastInfoUpdate;
            this.updateWidgets();
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
        this.readInfo();
        this.updatingData = false;
        this.startDataUpdates();
    }

    /*Callback which is called  when watchface deactivating (not visible)*/
    widgetDelegateCallbackPauseCall() {
        //debug.log("pause_call");
        this.stopDataUpdates();
        this.updatingData = false;
        if (typeof this.onUpdateFinishCallback === "function") {
            this.onUpdateFinishCallback(this.lastUpdateSucessful);
        }
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
    }

    updateTimesWidget() {
        if (typeof this.updateTimesWidgetCallback === "function") {
            this.updateTimesWidgetCallback(this.watchdripData);
        }
    }

    drawGraph() {
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
        if (typeof this.onUpdateStartCallback === "function") {
            this.onUpdateStartCallback();
        }
        var params = '';
        messageBuilder
            .request({
                method: Commands.getInfo,
                params: params
            }, {
                timeout: 5000
            })
            .then((data) => {
                debug.log("received data");
                const {result: info = {}} = data;
                try {
                    if (info.error) {
                        debug.log("Error");
                        debug.log(info);
                        return;
                    }
                    let dataInfo = str2json(info);

                    this.watchdripData.setData(dataInfo);
                    this.watchdripData.updateTimeDiff();

                    this.lastInfoUpdate = this.saveInfo(info);
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

    readInfo() {
        let info = hmFS.SysProGetChars(WF_INFO);
        let data = {};
        if (info) {
            try {
                data = str2json(info);
            } catch (e) {

            }
        }
        this.watchdripData.setData(data);
    }

    saveInfo(info) {
        hmFS.SysProSetChars(WF_INFO, info);
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
        debug.log("checkConfigUpdate");
        let configLastUpdate = hmFS.SysProGetInt64(WATCHDRIP_CONFIG_LAST_UPDATE);
        debug.log(configLastUpdate);
        debug.log(this.configLastUpdate);
        if (this.configLastUpdate !== configLastUpdate) {
            debug.log("detected config change");
            this.configLastUpdate = configLastUpdate;
            this.readConfig();
            debug.setEnabled(this.watchdripConfig.showLog);
            //restart timer (the fetch mode can be changed)
            this.stopDataUpdates();
            this.startDataUpdates();
        }
    }

    destroy() {
        if (this.system_alarm_id !== null) {
            hmApp.alarmCancel(this.system_alarm_id);
        }
        this.stopDataUpdates();
        this.dropConnection();
    }
}