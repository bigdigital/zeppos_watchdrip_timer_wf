import {DebugText} from "../../shared/debug";
import {Watchdrip} from "../../utils/watchdrip/watchdrip";
import {WatchdripData} from "../../utils/watchdrip/watchdrip-data";
import {getGlobal} from "../../shared/global";
import {
    ANALOG_TIME_SECONDS,
    BATTERY_ARC,
    BG_DELTA_TEXT,
    BG_STALE_IMG,
    BG_STATUS_HIGHT_IMG,
    BG_STATUS_LOW_IMG,
    BG_STATUS_OK_IMG,
    BG_TIME_TEXT,
    BG_TREND_IMAGE,
    BG_VALUE_NO_DATA_TEXT,
    BG_VALUE_TEXT_IMG,
    DAYS_TEXT_IMG, DIGITAL_TIME, DIGITAL_TIME_AOD,
    DIGITAL_TIME_SEPARATOR,
    DIGITAL_TIME_SEPARATOR_AOD, GRAPH_SETTINGS,
    IMG_LOADING_PROGRESS,
    IMG_STATUS_BT_DISCONNECTED,
    IOB_TEXT,
    NORMAL_DIST_TEXT_IMG,
    NORMAL_HEART_RATE_TEXT_IMG,
    NORMAL_STEPS_TEXT_IMG,
    PAI_ARC,
    PHONE_BATTERY_TEXT,
    TREATMENT_TEXT,
    WEEK_DAYS
} from "./styles";
import {BG_FILL_RECT, BG_IMG} from "../../utils/config/styles_global";
import {PROGRESS_ANGLE_INC, PROGRESS_UPDATE_INTERVAL_MS, TEST_DATA} from "../../utils/config/constants";
import {PointStyle} from "../../utils/watchdrip/graph/pointStyle";

let imgBg, digitalClock, digitalClockHour, digitalClockSeparator, secondsPointer, btDisconnected,
    normalHeartRateTextImg, normalStepsTextImg, normalDistTextImg, weekImg, dateDayImg, batteryCircleArc, paiCircleArc,
    screenType;
let bgValTextWidget, bgValTextImgWidget, bgValTimeTextWidget, bgDeltaTextWidget, bgTrendImageWidget, bgStaleLine,
    phoneBattery, iob, treatment, bgStatusLow, bgStatusOk, bgStatusHight, progress;

let batterySensor, paiSensor;

let globalNS, progressTimer, progressAngle;

let debug, watchdrip;

export const logger = Logger.getLogger("timer-page");

function initDebug() {
    globalNS.debug = new DebugText();
    debug = globalNS.debug;
    debug.setLines(12);
}

function getArcEndByVal(value, start_angle, end_angle) {
    let progress = value / 100;
    if (progress > 1) progress = 1;
    let offset = end_angle - start_angle;
    offset = offset * progress;
    let end_angle_draw = start_angle + offset;
    return {
        end_angle: end_angle_draw
    }
}

function startLoader() {
    progress.setProperty(hmUI.prop.VISIBLE, true);
    progressAngle = 0;
    progress.setProperty(hmUI.prop.MORE, {angle: progressAngle});
    progressTimer = globalNS.setInterval(() => {
        updateLoader();
    }, PROGRESS_UPDATE_INTERVAL_MS);
}

function updateLoader() {
    progressAngle = progressAngle + PROGRESS_ANGLE_INC;
    if (progressAngle >= 360) progressAngle = 0;
    progress.setProperty(hmUI.prop.MORE, {angle: progressAngle});
}

function stopLoader() {
    if (progressTimer !== null) {
        globalNS.clearInterval(progressTimer);
        progressTimer = null;
    }
    progress.setProperty(hmUI.prop.VISIBLE, false);
}

function scale_call() {
    if (screenType !== hmSetting.screen_type.AOD) {
        batteryCircleArc.setProperty(hmUI.prop.MORE, getArcEndByVal(batterySensor.current, BATTERY_ARC.start_angle, BATTERY_ARC.end_angle))
        paiCircleArc.setProperty(hmUI.prop.MORE, getArcEndByVal(paiSensor.totalpai, PAI_ARC.start_angle, PAI_ARC.end_angle))
    }
}

WatchFace({
    initView() {
        screenType = hmSetting.getScreenType();
        if (screenType === hmSetting.screen_type.AOD) {
            imgBg = hmUI.createWidget(hmUI.widget.FILL_RECT, BG_FILL_RECT);
        } else {
            imgBg = hmUI.createWidget(hmUI.widget.IMG, BG_IMG);
        }

        let digitalTimeParam = DIGITAL_TIME;
        let clockSeparatorParam = DIGITAL_TIME_SEPARATOR;
        if (screenType === hmSetting.screen_type.AOD) {
            digitalTimeParam = DIGITAL_TIME_AOD;
            clockSeparatorParam = DIGITAL_TIME_SEPARATOR_AOD;
        }
        digitalClock = hmUI.createWidget(hmUI.widget.IMG_TIME, digitalTimeParam);

        digitalClockSeparator = hmUI.createWidget(hmUI.widget.IMG, clockSeparatorParam);

        normalHeartRateTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, NORMAL_HEART_RATE_TEXT_IMG);

        normalStepsTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, NORMAL_STEPS_TEXT_IMG);

        normalDistTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, NORMAL_DIST_TEXT_IMG);

        weekImg = hmUI.createWidget(hmUI.widget.IMG_WEEK, WEEK_DAYS);

        dateDayImg = hmUI.createWidget(hmUI.widget.IMG_DATE, DAYS_TEXT_IMG);

        btDisconnected = hmUI.createWidget(hmUI.widget.IMG_STATUS, IMG_STATUS_BT_DISCONNECTED);
        batterySensor = hmSensor.createSensor(hmSensor.id.BATTERY);
        paiSensor = hmSensor.createSensor(hmSensor.id.PAI);
        if (screenType !== hmSetting.screen_type.AOD) {
            batteryCircleArc = hmUI.createWidget(hmUI.widget.ARC, BATTERY_ARC);
            paiCircleArc = hmUI.createWidget(hmUI.widget.ARC, PAI_ARC);

            batterySensor.addEventListener(hmSensor.event.CHANGE, scale_call);
            paiSensor.addEventListener(hmSensor.event.CHANGE, scale_call);

            secondsPointer = hmUI.createWidget(hmUI.widget.TIME_POINTER, ANALOG_TIME_SECONDS);
        }

        if (screenType !== hmSetting.screen_type.AOD) {
            //listen delegate only on normal screen
            const widgetDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
                resume_call: (function () {
                    screenType = hmSetting.getScreenType();
                    scale_call();
                })
            });
        }

        //init watchdrip related widgets
        bgValTextWidget = hmUI.createWidget(hmUI.widget.TEXT, BG_VALUE_NO_DATA_TEXT);
        bgValTextImgWidget = hmUI.createWidget(hmUI.widget.TEXT_IMG, BG_VALUE_TEXT_IMG);
        bgValTimeTextWidget = hmUI.createWidget(hmUI.widget.TEXT, BG_TIME_TEXT);
        bgDeltaTextWidget = hmUI.createWidget(hmUI.widget.TEXT, BG_DELTA_TEXT);
        bgTrendImageWidget = hmUI.createWidget(hmUI.widget.IMG, BG_TREND_IMAGE);
        //bgStaleLine = hmUI.createWidget(hmUI.widget.FILL_RECT, BG_STALE_RECT);
        bgStaleLine = hmUI.createWidget(hmUI.widget.IMG, BG_STALE_IMG);
        phoneBattery = hmUI.createWidget(hmUI.widget.TEXT, PHONE_BATTERY_TEXT);
        iob = hmUI.createWidget(hmUI.widget.TEXT, IOB_TEXT);
        treatment = hmUI.createWidget(hmUI.widget.TEXT, TREATMENT_TEXT);
        bgStatusLow = hmUI.createWidget(hmUI.widget.IMG, BG_STATUS_LOW_IMG);
        bgStatusOk = hmUI.createWidget(hmUI.widget.IMG, BG_STATUS_OK_IMG);
        bgStatusHight = hmUI.createWidget(hmUI.widget.IMG, BG_STATUS_HIGHT_IMG);
        progress = hmUI.createWidget(hmUI.widget.IMG, IMG_LOADING_PROGRESS);
        stopLoader();

        scale_call();
    },
    updateStart() {
        bgValTimeTextWidget.setProperty(hmUI.prop.VISIBLE, false);
        startLoader();
    },
    updateFinish(isSuccess) {
        stopLoader();
        bgValTimeTextWidget.setProperty(hmUI.prop.VISIBLE, true);
    },

    /**
     * @param {WatchdripData} watchdripData The watchdrip data info
     */
    updateValuesWidget(watchdripData) {
        if (watchdripData === undefined) return;
        let bgObj = watchdripData.getBg();

        bgStatusLow.setProperty(hmUI.prop.VISIBLE, false);
        bgStatusOk.setProperty(hmUI.prop.VISIBLE, false);
        bgStatusHight.setProperty(hmUI.prop.VISIBLE, false);

        if (bgObj.isHasData()) {
            if (bgObj.isHigh) {
                bgStatusHight.setProperty(hmUI.prop.VISIBLE, true);
            } else if (bgObj.isLow) {
                bgStatusLow.setProperty(hmUI.prop.VISIBLE, true);
            } else {
                bgStatusOk.setProperty(hmUI.prop.VISIBLE, true);
            }
        }
        if (bgObj.isHasData()) {
            bgValTextImgWidget.setProperty(hmUI.prop.TEXT, bgObj.getBGVal());
            bgValTextImgWidget.setProperty(hmUI.prop.VISIBLE, true);
            bgValTextWidget.setProperty(hmUI.prop.VISIBLE, false);
        } else {
            bgValTextWidget.setProperty(hmUI.prop.VISIBLE, true);
            bgValTextImgWidget.setProperty(hmUI.prop.VISIBLE, false);
        }
        bgDeltaTextWidget.setProperty(hmUI.prop.MORE, {
            text: bgObj.delta
        });

        bgTrendImageWidget.setProperty(hmUI.prop.SRC, bgObj.getArrowResource());

        phoneBattery.setProperty(hmUI.prop.MORE, {
            text: watchdripData.getStatus().getBatVal()
        });
        let treatmentObj = watchdripData.getTreatment();
        iob.setProperty(hmUI.prop.MORE, {
            text: treatmentObj.getPredictIOB() + treatmentObj.getPredictBWP()
        });

        if (TEST_DATA) {
            // bgStatusLow.setProperty(hmUI.prop.VISIBLE, true);
            // bgStatusOk.setProperty(hmUI.prop.VISIBLE, true);
            // bgStatusHight.setProperty(hmUI.prop.VISIBLE, true);
            bgValTimeTextWidget.setProperty(hmUI.prop.VISIBLE, true);
        }
    },

    /**
     * @param {WatchdripData} watchdripData The watchdrip data info
     */
    updateTimesWidget(watchdripData) {
        if (watchdripData === undefined) return;
        let bgObj = watchdripData.getBg();
        bgValTimeTextWidget.setProperty(hmUI.prop.MORE, {
            text: watchdripData.getTimeAgo(bgObj.time),
        });

        bgStaleLine.setProperty(hmUI.prop.VISIBLE, watchdripData.isBgStale());

        let treatmentObj = watchdripData.getTreatment();

        let treatmentsText = treatmentObj.getTreatments();
        if (treatmentsText !== "") {
            treatmentsText = treatmentsText + " " + watchdripData.getTimeAgo(treatmentObj.time);
        }

        treatment.setProperty(hmUI.prop.MORE, {
            text: treatmentsText
        });
    },

    onInit() {
        logger.log("wf on init invoke");
    },

    build() {
        try {
            logger.log("wf on build invoke");
            globalNS = getGlobal();
            initDebug();
            debug.log("build");
            this.initView();
            globalNS.watchdrip = new Watchdrip();
            watchdrip = globalNS.watchdrip;
            watchdrip.prepare();
            watchdrip.setUpdateValueWidgetCallback(this.updateValuesWidget);
            watchdrip.setUpdateTimesWidgetCallback(this.updateTimesWidget);
            watchdrip.setOnUpdateStartCallback(this.updateStart);
            watchdrip.setOnUpdateFinishCallback(this.updateFinish);

            //graph configuration
            let lineStyles = {};
            const POINT_SIZE = GRAPH_SETTINGS.point_size
            const TREATMENT_POINT_SIZE = GRAPH_SETTINGS.treatment_point_size
            const LINE_SIZE = GRAPH_SETTINGS.line_size
            lineStyles['predict'] = new PointStyle(POINT_SIZE, POINT_SIZE, POINT_SIZE);
            lineStyles['high'] = new PointStyle(POINT_SIZE, POINT_SIZE, POINT_SIZE);
            lineStyles['low'] = new PointStyle(POINT_SIZE, POINT_SIZE, POINT_SIZE);
            lineStyles['inRange'] = new PointStyle(POINT_SIZE, POINT_SIZE, POINT_SIZE);
            lineStyles['lineLow'] = new PointStyle("", LINE_SIZE);
            lineStyles['lineHigh'] = new PointStyle("", LINE_SIZE);
            lineStyles['treatment'] = new PointStyle(TREATMENT_POINT_SIZE, TREATMENT_POINT_SIZE);

            //watchdrip.createGraph(GRAPH_SETTINGS.x,GRAPH_SETTINGS.y,GRAPH_SETTINGS.w,GRAPH_SETTINGS.h, lineStyles);// uncomment to add graph

            watchdrip.start();
        }
        catch (e) {
            console.log('LifeCycle Error', e)
            e && e.stack && e.stack.split(/\n/).forEach((i) => console.log('error stack', i))
        }
    },

    onDestroy() {
        logger.log("wf on destroy invoke");
        watchdrip.destroy();
        /*if (typeof batterySensor !== 'undefined') {
            batterySensor.removeEventListener(hmSensor.event.CHANGE, scale_call);
        }
        if (typeof paiSensor !== 'undefined') {
            paiSensor.removeEventListener(hmSensor.event.CHANGE, scale_call);
        }*/
        stopLoader();
    },

    onShow() {
        debug.log("onShow");
    },

    onHide() {
        debug.log("onHide");
    },
});
