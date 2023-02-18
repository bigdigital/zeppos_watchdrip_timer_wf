import {getGlobal} from "../../shared/global";
import {
    WATCHDRIP_ALARM_CONFIG_DEFAULTS,
    WATCHDRIP_APP_ID,
    WATCHDRIP_CONFIG,
    WATCHDRIP_CONFIG_DEFAULTS,
    WATCHDRIP_CONFIG_LAST_UPDATE,
    WF_INFO,
    WF_INFO_LAST_UPDATE
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

let watchdrip, debug

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
        this.configLastUpdate = null;
        this.updatingData = false;
        this.intervalTimer = null;

    }

    //call before any usage of the class instance
    prepare() {
        watchdrip = this.globalNS.watchdrip;
    }

    start() {
        watchdrip.checkConfigUpdate();

        this.updateIntervals = watchdrip.getUpdateInterval();


        watchdrip.readInfo();
        watchdrip.updateValuesWidget();
        //Monitor watchface activity in order to recreate connection
        if (watchdrip.isAOD()) {
            watchdrip.widgetDelegateCallbackResumeCall();
        } else {
            hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
                resume_call: watchdrip.widgetDelegateCallbackResumeCall,
                pause_call: watchdrip.widgetDelegateCallbackPauseCall,
            });
        }
    }

    getUpdateInterval() {
        let interval = DATA_UPDATE_INTERVAL_MS;
        if (watchdrip.isAOD()) {
            interval = DATA_AOD_UPDATE_INTERVAL_MS;
        } else if (watchdrip.isAppFetch()) {
            interval = APP_FETCH_UPDATE_INTERVAL_MS
        }
        return interval;
    }

    getTimerUpdateInterval() {
        let interval = DATA_TIMER_UPDATE_INTERVAL_MS;
        if (watchdrip.isAOD()) {
            interval = DATA_AOD_TIMER_UPDATE_INTERVAL_MS;
        } else if (watchdrip.isAppFetch()) {
            interval = APP_FETCH_TIMER_UPDATE_INTERVAL_MS
        }
        return interval;
    }

    startDataUpdates() {
        if (watchdrip.intervalTimer != null) return; //already started
        let interval = watchdrip.getUpdateInterval();
        debug.log("startDataUpdates, interval: " + interval);
        watchdrip.intervalTimer = watchdrip.globalNS.setInterval(() => {
            watchdrip.checkUpdates();
        }, interval);
    }

    stopDataUpdates() {
        if (watchdrip.intervalTimer !== null) {
            debug.log("stopDataUpdates");
            watchdrip.globalNS.clearInterval(watchdrip.intervalTimer);
            watchdrip.intervalTimer = null;
        }
    }

    isAOD() {
        return watchdrip.screenType === hmSetting.screen_type.AOD;
    }

    isTimeout(time, timeout_ms) {
        return watchdrip.timeSensor.utc - time > timeout_ms;
    }

    readLastUpdate() {
        let lastInfoUpdate = hmFS.SysProGetInt64(WF_INFO_LAST_UPDATE);
        watchdrip.lastUpdateAttempt = hmFS.SysProGetInt64(WF_INFO_LAST_UPDATE_ATTEMPT);
        watchdrip.lastUpdateSucessful = hmFS.SysProGetBool(WF_INFO_LAST_UPDATE_SUCCESS);
        return lastInfoUpdate;
    }

    checkUpdates() {
        watchdrip.updateTimesWidget();
        //debug.log("checkUpdates");
        if (watchdrip.updatingData) {
            // debug.log("updatingData, return");
            return;
        }
        let lastInfoUpdate = this.readLastUpdate();
        if (!lastInfoUpdate) {
            if (watchdrip.lastUpdateAttempt == null) {
                debug.log("initial fetch");
                watchdrip.fetchInfo();
                return;
            }
            if (watchdrip.isTimeout(watchdrip.lastUpdateAttempt, DATA_STALE_TIME_MS)) {
                debug.log("the side app not responding, force update again");
                watchdrip.fetchInfo();
                return;
            }
        } else {
            if (!watchdrip.lastUpdateSucessful) {
                if (watchdrip.lastUpdateAttempt !== null)
                    if (watchdrip.isTimeout(watchdrip.lastUpdateAttempt, DATA_STALE_TIME_MS)) {
                        debug.log("reached DATA_STALE_TIME_MS");
                        watchdrip.fetchInfo();
                        return;
                    } else {
                        return;
                    }
            }
            if (watchdrip.isTimeout(lastInfoUpdate, watchdrip.updateIntervals)) {
                debug.log("reached updateIntervals");
                watchdrip.fetchInfo();
                return;
            }
            if (watchdrip.lastInfoUpdate === lastInfoUpdate) {
                //data not modified from outside scope so nothing to do
                //debug.log("data not modified");
                return;
            }
            //update widgets because the data was modified outside the current scope
            if (watchdrip.isAppFetch()) {
                debug.log("Read Remote Info");
                watchdrip.readInfo();
            }
            watchdrip.updateWidgets();
        }

    }

    update() {
        watchdrip.checkConfigUpdate();
        // debug.log(watchdrip.watchdripConfig)
        // debug.enabled = watchdrip.watchdripConfig.showLog
        if (watchdrip.watchdripConfig.disableUpdates === true) {
            watchdrip.stopDataUpdates();
        } else {
            watchdrip.startDataUpdates();
        }
    }

    //connect watch with side app
    initConnection() {
        if (watchdrip.connectionActive) {
            return;
        }
        debug.log("initConnection");
        watchdrip.connectionActive = true;
        const appId = WATCHDRIP_APP_ID;
        //we need to recreate connection to force start side app
        messageBuilder = new MessageBuilder({appId});
        messageBuilder.connect();
    }

    dropConnection() {
        if (!watchdrip.connectionActive) {
            return;
        }
        debug.log("dropConnection");
        messageBuilder.disConnect();
        watchdrip.connectionActive = false;
    }

    /*Callback which is called  when watchface is active  (visible)*/
    widgetDelegateCallbackResumeCall() {
        debug.log("resume_call");
        watchdrip.readInfo();
        watchdrip.updatingData = false;
        watchdrip.update();
    }

    /*Callback which is called  when watchface deactivating (not visible)*/
    widgetDelegateCallbackPauseCall() {
        //debug.log("pause_call");
        watchdrip.stopDataUpdates();
        watchdrip.updatingData = false;
        if (typeof watchdrip.onUpdateFinishCallback === "function") {
            watchdrip.onUpdateFinishCallback(watchdrip.lastUpdateSucessful);
        }
        watchdrip.dropConnection();
    }


    setUpdateValueWidgetCallback(callback) {
        watchdrip.updateValueWidgetCallback = callback;
    }

    setUpdateTimesWidgetCallback(callback) {
        watchdrip.updateTimesWidgetCallback = callback;
    }

    setOnUpdateStartCallback(callback) {
        watchdrip.onUpdateStartCallback = callback;
    }

    setOnUpdateFinishCallback(callback) {
        watchdrip.onUpdateFinishCallback = callback;
    }

    updateWidgets() {
        debug.log("updateWidgets");
        watchdrip.updateValuesWidget()
        watchdrip.updateTimesWidget()
    }

    updateValuesWidget() {
        if (typeof watchdrip.updateValueWidgetCallback === "function") {
            watchdrip.updateValueWidgetCallback(watchdrip.watchdripData);
        }
    }

    updateTimesWidget() {
        if (typeof watchdrip.updateTimesWidgetCallback === "function") {
            watchdrip.updateTimesWidgetCallback(watchdrip.watchdripData);
        }
    }

    drawGraph() {
    }

    isAppFetch() {
        return watchdrip.watchdripConfig.useAppFetch === true;
    }

    resetLastUpdate() {
        this.lastUpdateAttempt = this.timeSensor.utc;
        hmFS.SysProSetInt64(WF_INFO_LAST_UPDATE_ATTEMPT, this.lastUpdateAttempt);
        this.lastUpdateSucessful = false;
        hmFS.SysProSetBool(WF_INFO_LAST_UPDATE_SUCCESS, this.lastUpdateSucessful);
    }

    fetchInfo() {
        debug.log("fetchInfo");
        watchdrip.resetLastUpdate();
        if (watchdrip.isAppFetch()) {
            gotoSubpage('update', {
                    params: WATCHDRIP_ALARM_CONFIG_DEFAULTS
                },
                WATCHDRIP_APP_ID);
            return;
        }

        watchdrip.initConnection();

        if (messageBuilder.connectStatus() === false) {
            debug.log("No BT Connection");
            return;
        }
        watchdrip.updatingData = true;
        if (typeof watchdrip.onUpdateStartCallback === "function") {
            watchdrip.onUpdateStartCallback();
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

                    watchdrip.watchdripData.setData(dataInfo);
                    watchdrip.watchdripData.updateTimeDiff();

                    watchdrip.lastInfoUpdate = watchdrip.saveInfo(info);
                    watchdrip.updateWidgets();
                } catch (e) {
                    debug.log("error:" + e);
                }
            })
            .catch((error) => {
                debug.log("fetch error:" + error);
            })
            .finally(() => {
                watchdrip.updatingData = false;
                if (typeof watchdrip.onUpdateFinishCallback === "function") {
                    watchdrip.onUpdateFinishCallback(watchdrip.lastUpdateSucessful);
                }
                if (watchdrip.isAOD()) {
                    watchdrip.dropConnection();
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
        watchdrip.watchdripData.setData(data);
    }

    saveInfo(info) {
        hmFS.SysProSetChars(WF_INFO, info);
        watchdrip.lastUpdateSucessful = true;
        let time = this.timeSensor.utc;
        hmFS.SysProSetInt64(WF_INFO_LAST_UPDATE, time);
        hmFS.SysProSetBool(WF_INFO_LAST_UPDATE_SUCCESS, this.lastUpdateSucessful);
        return time;
    }

    /*Read config which is defined in the app. If not defined, init config*/
    readConfig() {
        let configStr = hmFS.SysProGetChars(WATCHDRIP_CONFIG);
        if (!configStr) {
            watchdrip.watchdripConfig = WATCHDRIP_CONFIG_DEFAULTS;
            watchdrip.saveConfig();
        } else {
            try {
                watchdrip.watchdripConfig = str2json(configStr);
            } catch (e) {

            }
        }
    }

    saveConfig() {
        hmFS.SysProSetChars(WATCHDRIP_CONFIG, json2str(watchdrip.watchdripConfig));
        hmFS.SysProSetChars(WATCHDRIP_CONFIG_LAST_UPDATE, watchdrip.timeSensor.utc);
    }

    /* will check last config updates to sync config with app*/
    checkConfigUpdate() {
        let configLastUpdate = hmFS.SysProGetInt64(WATCHDRIP_CONFIG_LAST_UPDATE);
        if (watchdrip.configLastUpdate !== configLastUpdate) {
            watchdrip.configLastUpdate = configLastUpdate;
            watchdrip.readConfig();
            debug.enabled = watchdrip.watchdripConfig.showLog;
        }
    }

    destroy() {
        if (watchdrip.system_alarm_id !== null) {
            hmApp.alarmCancel(watchdrip.system_alarm_id);
        }
        watchdrip.stopDataUpdates();
        watchdrip.dropConnection();
    }
}