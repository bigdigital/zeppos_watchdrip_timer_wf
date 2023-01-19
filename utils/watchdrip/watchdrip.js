import {getGlobal} from "../../shared/global";
import {
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
    Colors,
    Commands,
    DATA_AOD_TIMER_UPDATE_INTERVAL_MS,
    DATA_AOD_UPDATE_INTERVAL_MS,
    DATA_STALE_TIME_MS,
    DATA_TIMER_UPDATE_INTERVAL_MS,
    DATA_UPDATE_INTERVAL_MS
} from "../config/constants";
import {WatchdripData} from "./watchdrip-data";

let {messageBuilder} = getApp()._options.globalData;

export const logger = Logger.getLogger("wf-wathchdrip");

let watchdrip, debug

export class Watchdrip {
    constructor() {
        this.screenType = hmSetting.getScreenType();

        this.updateIntervals = this.isAOD() ? DATA_AOD_UPDATE_INTERVAL_MS : DATA_UPDATE_INTERVAL_MS;

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
        this.checkConfigUpdate();
        this.readInfo();
    }

    start() { 
        watchdrip = this.globalNS.watchdrip;
        this.updateValuesWidget();
        //Monitor watchface activity in order to recreate connection
        if (this.isAOD()) {
            watchdrip.widgetDelegateCallbackResumeCall();
        }
        else {
            hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
                resume_call: watchdrip.widgetDelegateCallbackResumeCall,
                pause_call: watchdrip.widgetDelegateCallbackPauseCall,
            });
        }
    }

    startDataUpdates() {
        if (this.intervalTimer != null) return; //already started
        let interval = this.isAOD() ? DATA_AOD_TIMER_UPDATE_INTERVAL_MS : DATA_TIMER_UPDATE_INTERVAL_MS;
        debug.log("startDataUpdates, interval: " + interval);
        this.checkUpdates(); //start immediately

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

    isAOD(){
        return  this.screenType === hmSetting.screen_type.AOD;
    }

    openAPP(page = "") {
        const obj = {
            appid: WATCHDRIP_APP_ID,
            url: "pages/index",
        }

        if (page !== ""){
            obj.url = "pages/" + page;
        }

        debug.log("openAPP page:" + page );
        hmApp.startApp(obj)
    }

    checkUpdates() {
        this.updateTimesWidget();
        //debug.log("checkUpdates");
        if (this.updatingData) {
            // debug.log("updatingData, return");
            return;
        }
        let lastInfoUpdate = hmFS.SysProGetInt64(WF_INFO_LAST_UPDATE);
        let utc = this.timeSensor.utc;
        if (!lastInfoUpdate) {
            if (this.lastUpdateAttempt == null) {
                debug.log("initial fetch");
                watchdrip.fetchInfo();
                return;
            }
            if (utc - this.lastUpdateAttempt > DATA_STALE_TIME_MS) {
                debug.log("the side app not responding, force update again");
                watchdrip.fetchInfo();
                return;
            }
        } else {
            if (!this.lastUpdateSucessful) {
                if (this.lastUpdateAttempt !== null)
                    if ((utc - this.lastUpdateAttempt > DATA_STALE_TIME_MS)) {
                        debug.log("reached DATA_STALE_TIME_MS");
                        watchdrip.fetchInfo();
                        return;
                    } else {
                        return;
                    }
            }
            if ((utc - lastInfoUpdate > this.updateIntervals)) {
                debug.log("reached DATA_UPDATE_INTERVAL_MS");
                watchdrip.fetchInfo();
                return;
            }
            if (this.lastInfoUpdate === lastInfoUpdate) {
                //debug.log("data not modified");
                return;
            }
            watchdrip.updateWidgets();
        }
    }

    update() {
        this.checkConfigUpdate();
       // debug.log(this.watchdripConfig)
        // debug.enabled = this.watchdripConfig.showLog
        if (this.watchdripConfig.disableUpdates === true) {
            this.stopDataUpdates();
        } else {
            this.startDataUpdates();
        }
    }

    startAppUpdate(isStartNow = false) {
        //debug.log("Update app info now:" + isStartNow);
        const obj = {
            appid: WATCHDRIP_APP_ID,
            url: "pages/index",
            param: "update"
        }
        if (isStartNow) {
            hmApp.startApp(obj)
        } else {
            obj.delay = 5000;
            this.system_alarm_id = hmApp.alarmNew(obj);
        }
        this.lastUpdateAttempt = this.timeSensor.utc;
    }

    //connect watch with side app
    initConnection() {
        debug.log("initConnection");
        watchdrip.connectionActive = true;
        const appId = WATCHDRIP_APP_ID;
        messageBuilder = new MessageBuilder({appId});
        messageBuilder.connect();
    }

    dropConnection(){
        debug.log("dropConnection");
        messageBuilder.disConnect();
        watchdrip.connectionActive = false;
    }

    /*Callback which is called  when watchface is active  (visible)*/
    widgetDelegateCallbackResumeCall() {
        debug.log("resume_call");
        logger.log("resume_call");
        watchdrip.readInfo();
        watchdrip.updatingData = false;
        watchdrip.update();
        debug.log("resume_callend");
        logger.log("resume_callend");
    }

    /*Callback which is called  when watchface deactivating (not visible)*/
    widgetDelegateCallbackPauseCall() {
        //debug.log("pause_call");
        watchdrip.stopDataUpdates();
        watchdrip.updatingData = false;
        if (typeof watchdrip.onUpdateFinishCallback === "function"){
            watchdrip.onUpdateFinishCallback(watchdrip.lastUpdateSucessful);
        }
       watchdrip.dropConnection();
    }


    setUpdateValueWidgetCallback(callback){
        this.updateValueWidgetCallback = callback;
    }

    setUpdateTimesWidgetCallback(callback){
        this.updateTimesWidgetCallback = callback;
    }

    setOnUpdateStartCallback(callback){
        this.onUpdateStartCallback = callback;
    }

    setOnUpdateFinishCallback(callback){
        this.onUpdateFinishCallback = callback;
    }

    updateWidgets() {
        debug.log("updateWidgets");
        this.updateValuesWidget()
        this.updateTimesWidget()
    }

    updateValuesWidget() {
        if (typeof this.updateValueWidgetCallback === "function"){
            this.updateValueWidgetCallback(this.watchdripData);
        }
    }

    updateTimesWidget() {
        if (typeof this.updateTimesWidgetCallback === "function"){
            this.updateTimesWidgetCallback(this.watchdripData);
        }
    }

    drawGraph() {
    }

    fetchInfo() {
        this.lastUpdateAttempt = this.timeSensor.utc;
        this.lastUpdateSucessful = false;

        if (!watchdrip.connectionActive) {
            watchdrip.initConnection();
        }

        debug.log("fetchInfo");
        if (messageBuilder.connectStatus() === false) {
            debug.log("No bt connection");
            return;
        }
        // debug.log("bt connection ok");
        this.updatingData = true;
        if (typeof this.onUpdateStartCallback === "function"){
            this.onUpdateStartCallback();
        }

        messageBuilder
            .request({
                method: Commands.getInfo,
            }, {
                timeout: 10000
            })
            .then((data) => {
                debug.log("received data");
                const {result: info = {}} = data;
                //debug.log(info);
                try {
                    if (info.error) {
                        debug.log("error:" + info.message);
                        return;
                    }
                    let dataInfo = str2json(info);

                    this.watchdripData.setData(dataInfo);
                    this.watchdripData.updateTimeDiff();

                    this.lastInfoUpdate = this.saveInfo(info);
                    this.lastUpdateSucessful = true;
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
                if (typeof this.onUpdateFinishCallback === "function"){
                    this.onUpdateFinishCallback(this.lastUpdateSucessful);
                }
                if (this.isAOD()){
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
        let time = this.timeSensor.utc;
        hmFS.SysProSetInt64(WF_INFO_LAST_UPDATE, time);
        return time;
    }

    /*Read config which is defined in the app. If not defined, init config*/
    readConfig() {
        var configStr = hmFS.SysProGetChars(WATCHDRIP_CONFIG);
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
        hmFS.SysProSetChars(WATCHDRIP_CONFIG_LAST_UPDATE, this.timeSensor.utc);
    }

    /* will check last config updates to sync config with app*/
    checkConfigUpdate() {
        var configLastUpdate = hmFS.SysProGetInt64(WATCHDRIP_CONFIG_LAST_UPDATE);
        if (this.configLastUpdate !== configLastUpdate) {
            this.configLastUpdate = configLastUpdate;
            this.readConfig();
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