import {DebugText} from "../../shared/debug";
import {Watchdrip} from "../../utils/watchdrip/watchdrip";
import {img} from "../../utils/helper";
import {
    ANALOG_TIME_SECONDS, BATTERY_ARC,
    DAYS_TEXT_IMG,
    DIGITAL_TIME_HOUR,
    DIGITAL_TIME_MINUTES,
    DIGITAL_TIME_SEPARATOR,
    IMG_STATUS_BT_DISCONNECTED,
    NORMAL_DIST_TEXT_IMG,
    NORMAL_HEART_RATE_TEXT_IMG,
    NORMAL_STEPS_TEXT_IMG, PAI_ARC,
    TIME_AM_PM,
    WEEK_DAYS
} from "../../utils/config/styles";

let imgBg = null;

let digitalClockHour = null;
let digitalClockMinutes = null;
let timeAM_PM = null;
let digitalClockSeparator = null;
let secondsPointer = null;
let btDisconnected = null;

let normalHeartRateTextImg = null;
let normalStepsTextImg = null;
let normalDistTextImg = null;

let weekImg = null;
let dateDayImg = null;

let batteryCircleArc = null;
let paiCircleArc = null;

let screenType = null;

export const logger = Logger.getLogger("timer-page");

export let watchdrip = null;
export let debug;

function initDebug() {
    debug = new DebugText();
    debug.setLines(12);
}

WatchFace({
    initView() {
        screenType = hmSetting.getScreenType();
        if (screenType == hmSetting.screen_type.AOD) {
            imgBg = hmUI.createWidget(hmUI.widget.FILL_RECT, {
                x: px(0),
                y: px(0),
                w: px(480),
                h: px(480),
                color: 0x000000,
            });
        } else {
            imgBg = hmUI.createWidget(hmUI.widget.IMG, {
                x: px(0),
                y: px(0),
                w: px(480),
                h: px(480),
                src: img("bg/bg.png"),
                show_level: hmUI.show_level.ONLY_NORMAL,
            });
        }

        digitalClockHour = hmUI.createWidget(hmUI.widget.IMG_TIME, DIGITAL_TIME_HOUR);

        digitalClockMinutes = hmUI.createWidget(hmUI.widget.IMG_TIME, DIGITAL_TIME_MINUTES);

        timeAM_PM = hmUI.createWidget(hmUI.widget.IMG_TIME, TIME_AM_PM);

        digitalClockSeparator = hmUI.createWidget(hmUI.widget.IMG, DIGITAL_TIME_SEPARATOR);

        normalHeartRateTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, NORMAL_HEART_RATE_TEXT_IMG);

        normalStepsTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, NORMAL_STEPS_TEXT_IMG);

        normalDistTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, NORMAL_DIST_TEXT_IMG);

        weekImg = hmUI.createWidget(hmUI.widget.IMG_WEEK, WEEK_DAYS);

        dateDayImg = hmUI.createWidget(hmUI.widget.IMG_DATE, DAYS_TEXT_IMG);

        secondsPointer = hmUI.createWidget(hmUI.widget.TIME_POINTER, ANALOG_TIME_SECONDS);

        btDisconnected = hmUI.createWidget(hmUI.widget.IMG_STATUS, IMG_STATUS_BT_DISCONNECTED);

        batteryCircleArc = hmUI.createWidget(hmUI.widget.ARC, BATTERY_ARC);
        paiCircleArc = hmUI.createWidget(hmUI.widget.ARC, PAI_ARC);

        const battery = hmSensor.createSensor(hmSensor.id.BATTERY);
        battery.addEventListener(hmSensor.event.CHANGE, function () {
            scale_call();
        });
        const pai = hmSensor.createSensor(hmSensor.id.PAI);
        pai.addEventListener(hmSensor.event.CHANGE, function () {
            scale_call();
        });

        const widgetDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
            resume_call: (function () {
                screenType = hmSetting.getScreenType();
                scale_call();
            }),
        });

        watchdrip.initWidgets();

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

        function scale_call() {
            if (screenType != hmSetting.screen_type.AOD) {
                batteryCircleArc.setProperty(hmUI.prop.MORE, getArcEndByVal(battery.current, BATTERY_ARC.start_angle, BATTERY_ARC.end_angle ))
                paiCircleArc.setProperty(hmUI.prop.MORE, getArcEndByVal(pai.totalpai, PAI_ARC.start_angle, PAI_ARC.end_angle ))
            }
        }
    },

    onInit() {
        logger.log("wf on init invoke");
    },

    build() {
        logger.log("wf on build invoke");
        watchdrip = new Watchdrip();
        this.initView();
        initDebug();
        debug.log("build");
        watchdrip.start();
    },

    onDestroy() {
        logger.log("wf on destroy invoke");
        watchdrip.destroy();
    },

    onShow() {
        debug.log("onShow");
    },

    onHide() {
        debug.log("onHide");
    },
});
