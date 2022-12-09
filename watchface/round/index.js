import {DebugText} from "../../shared/debug";
import {Watchdrip} from "../../utils/watchdrip/watchdrip";
import {img} from "../../utils/helper";
import {
    ANALOG_TIME_SECONDS,
    DAYS_TEXT_IMG,
    DIGITAL_TIME_HOUR,
    DIGITAL_TIME_MINUTES,
    DIGITAL_TIME_SEPARATOR,
    IMG_STATUS_BT_DISCONNECTED,
    NORMAL_DIST_TEXT_IMG,
    NORMAL_HEART_RATE_TEXT_IMG,
    NORMAL_STEPS_TEXT_IMG,
    WEEK_DAYS
} from "../../utils/config/styles";

let imgBg = null;

let digitalClockHour = null;
let digitalClockMinutes = null;
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

        digitalClockSeparator = hmUI.createWidget(hmUI.widget.IMG, DIGITAL_TIME_SEPARATOR);

        normalHeartRateTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, NORMAL_HEART_RATE_TEXT_IMG);

        normalStepsTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, NORMAL_STEPS_TEXT_IMG);

        normalDistTextImg = hmUI.createWidget(hmUI.widget.TEXT_IMG, NORMAL_DIST_TEXT_IMG);

        weekImg = hmUI.createWidget(hmUI.widget.IMG_WEEK, WEEK_DAYS);

        dateDayImg = hmUI.createWidget(hmUI.widget.IMG_DATE, DAYS_TEXT_IMG);

        secondsPointer = hmUI.createWidget(hmUI.widget.TIME_POINTER, ANALOG_TIME_SECONDS);

        btDisconnected = hmUI.createWidget(hmUI.widget.IMG_STATUS, IMG_STATUS_BT_DISCONNECTED);

        batteryCircleArc = hmUI.createWidget(hmUI.widget.ARC);
        paiCircleArc = hmUI.createWidget(hmUI.widget.ARC);

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
                scale_call();
            }),
        });

        watchdrip.initWidgets();

        function scale_call() {
            let valueBattery = battery.current;
            let targetBattery = 100;
            let progressBattery = valueBattery / targetBattery;
            if (progressBattery > 1) progressBattery = 1;
            let progress_cs_normal_battery = progressBattery;

            if (screenType != hmSetting.screen_type.AOD) {
                // initial parameters
                let start_angle_normal_battery = -253;
                let end_angle_normal_battery = -196;
                let center_x_normal_battery = 245;
                let center_y_normal_battery = 234;
                let radius_normal_battery = 222;
                let line_width_cs_normal_battery = 9;
                let color_cs_normal_battery = 0xFFBEFF37;

                // calculated parameters
                let arcX_normal_battery = center_x_normal_battery - radius_normal_battery;
                let arcY_normal_battery = center_y_normal_battery - radius_normal_battery;
                let CircleWidth_normal_battery = 2 * radius_normal_battery;
                let angle_offset_normal_battery = end_angle_normal_battery - start_angle_normal_battery;
                angle_offset_normal_battery = angle_offset_normal_battery * progress_cs_normal_battery;
                let end_angle_normal_battery_draw = start_angle_normal_battery + angle_offset_normal_battery;

                batteryCircleArc.setProperty(hmUI.prop.MORE, {
                    x: arcX_normal_battery,
                    y: arcY_normal_battery,
                    w: CircleWidth_normal_battery,
                    h: CircleWidth_normal_battery,
                    start_angle: start_angle_normal_battery,
                    end_angle: end_angle_normal_battery_draw,
                    color: color_cs_normal_battery,
                    line_width: line_width_cs_normal_battery,
                })
            }

            let valuePAI = pai.totalpai;
            let targetPAI = 100;
            let progressPAI = valuePAI / targetPAI;
            if (progressPAI > 1) progressPAI = 1;
            let progress_cs_normal_pai = progressPAI;

            if (screenType != hmSetting.screen_type.AOD) {
                // initial parameters
                let start_angle_normal_pai = 73;
                let end_angle_normal_pai = 16;
                let center_x_normal_pai = 233;
                let center_y_normal_pai = 235;
                let radius_normal_pai = 222;
                let line_width_cs_normal_pai = 9;
                let color_cs_normal_pai = 0xFFBEFF37;

                // calculated parameters
                let arcX_normal_pai = center_x_normal_pai - radius_normal_pai;
                let arcY_normal_pai = center_y_normal_pai - radius_normal_pai;
                let CircleWidth_normal_pai = 2 * radius_normal_pai;
                let angle_offset_normal_pai = end_angle_normal_pai - start_angle_normal_pai;
                angle_offset_normal_pai = angle_offset_normal_pai * progress_cs_normal_pai;
                let end_angle_normal_pai_draw = start_angle_normal_pai + angle_offset_normal_pai;

                paiCircleArc.setProperty(hmUI.prop.MORE, {
                    x: arcX_normal_pai,
                    y: arcY_normal_pai,
                    w: CircleWidth_normal_pai,
                    h: CircleWidth_normal_pai,
                    start_angle: start_angle_normal_pai,
                    end_angle: end_angle_normal_pai_draw,
                    color: color_cs_normal_pai,
                    line_width: line_width_cs_normal_pai,
                });
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
