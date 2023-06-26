import {img,range} from "../../utils/helper";
import {Colors} from "../../utils/config/constants";

let bgNumArr = range(10).map((v) => {
    return img(`bgNum/${v}.png`);
});

let weekEnArray = range(1, 8).map((v) => {
    return img(`week_en/${v}.png`);
});

let bigNumArr = range(10).map((v) => {
    return img(`bigNum/${v}.png`);
});

let bigNumArrAOD = range(10).map((v) => {
    return img(`bigNumAOD/${v}.png`);
});

let smallNumArr = range(10).map((v) => {
    return img(`smallNum/${v}.png`);
});

let smallNumAccentArr = range(10).map((v) => {
    return img(`smallNumAccent/${v}.png`);
});

export const DIGITAL_TIME = {
    hour_startX: px(130),
    hour_startY: px(50),
    hour_zero: true,
    hour_space: 2,
    hour_align: hmUI.align.CENTER_H,
    hour_array: bigNumArr,
    minute_startX: px(240),
    minute_startY: px(50),
    minute_zero: true,
    minute_space: 2,
    minute_align: hmUI.align.CENTER_H,
    minute_array: bigNumArr,
    am_x: px(334),
    am_y: px(98),
    am_sc_path: img('bigNum/am.png'),
    am_en_path: img('bigNum/am.png'),
    pm_x: px(334),
    pm_y: px(98),
    pm_sc_path: img('bigNum/pm.png'),
    pm_en_path: img('bigNum/pm.png'),
};

export const DIGITAL_TIME_AOD = {
    ...DIGITAL_TIME,
    hour_array: bigNumArrAOD,
    minute_array: bigNumArrAOD,
    am_sc_path: img('bigNumAOD/am.png'),
    am_en_path: img('bigNumAOD/am.png'),
    pm_sc_path: img('bigNumAOD/pm.png'),
    pm_en_path: img('bigNumAOD/pm.png'),
};

export const DIGITAL_TIME_SEPARATOR = {
    x: px(224),
    y: px(73),
    src: img( `bigNum/sp.png`)
};

export const DIGITAL_TIME_SEPARATOR_AOD = {
    x: px(224),
    y: px(73),
    src: img( `bigNumAOD/sp.png`)
};

export const ANALOG_TIME_SECONDS = {
    second_centerX: px(228),
    second_centerY: px(228),
    second_posX: px(6),
    second_posY: px(229),
    second_path: img("point/sec.png")
};

export const NORMAL_HEART_RATE_TEXT_IMG = {
    x: px(95),
    y: px(191),
    w: px(63),
    padding: false,
    h_space: 1,
    align_h: hmUI.align.RIGHT,
    type: hmUI.data_type.HEART,
    show_level: hmUI.show_level.ONLY_NORMAL,
    font_array: smallNumArr
}

export const NORMAL_STEPS_TEXT_IMG = {
    x: px(300),
    y: px(191),
    w: px(133),
    padding: false,
    h_space: 1,
    align_h: hmUI.align.CENTER_H,
    type: hmUI.data_type.STEP,
    show_level: hmUI.show_level.ONLY_NORMAL,
    font_array: smallNumArr
}

export const NORMAL_DIST_TEXT_IMG = {
    x: px(296),
    y: px(239),
    w: px(90),
    padding: false,
    h_space: 1,
    align_h: hmUI.align.RIGHT,
    type: hmUI.data_type.DISTANCE,
    dot_image: img('smallNumAccent/d.png'),
    show_level: hmUI.show_level.ONLY_NORMAL,
    font_array: smallNumAccentArr
}

export const WEEK_DAYS = {
    x: px(34),
    y: px(239),
    week_en: weekEnArray,
    week_tc: weekEnArray,
    week_sc: weekEnArray,
}

export const DAYS_TEXT_IMG = {
    day_startX: px(124),
    day_startY: px(240),
    day_zero: 1,
    day_space: 1,
    day_align: hmUI.align.LEFT,
    day_is_character: false,
    day_sc_array: smallNumAccentArr,
    day_tc_array: smallNumAccentArr,
    day_en_array: smallNumAccentArr,
}

export const BATTERY_ARC = {
    x: px(23),
    y: px(5),
    w: px(430),
    h: px(430),
    start_angle: -253,
    end_angle: -196,
    color: Colors.accent,
    line_width: px(9),
    show_level: hmUI.show_level.ONLY_NORMAL,
}

export const PAI_ARC = {
    x: px(11),
    y: px(5),
    w: px(430),
    h: px(430),
    start_angle: 73,
    end_angle: 16,
    color: Colors.accent,
    line_width: px(9),
    show_level: hmUI.show_level.ONLY_NORMAL,
}

export const BG_VALUE_NO_DATA_TEXT = {
    x: px(169),
    y: px(149),
    w: px(116),
    h: px(55),
    color: Colors.white,
    text_size: px(45),
    align_h: hmUI.align.RIGHT,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
    text: 'No data'
};

export const BG_VALUE_TEXT_IMG = {
    x: px(169),
    y: px(149),
    w: px(116),
    color: Colors.white,
    align_h: hmUI.align.CENTER_H,
    dot_image: img('bgNum/d.png'),
    font_array: bgNumArr,
    text: '0',
    visible: false,
    h_space:1
};

export const BG_TIME_TEXT = {
    x: px(166),
    y: px(285),
    w: px(125),
    h: px(35),
    color: Colors.defaultTransparent,
    text_size: px(26),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const BG_DELTA_TEXT = {
    x: px(213),
    y: px(235),
    w: px(74),
    h: px(40),
    color: Colors.defaultTransparent,
    text_size: px(34),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const BG_TREND_IMAGE = {
    src: 'watchdrip/arrows/None.png',
    x: px(170),
    y: px(242),
    w: px(46),
    h: px(48),
};

export const BG_STALE_RECT = {
    x: px(170),
    y: px(182),
    w: px(120),
    h: px(4),
    color: Colors.white,
    visible: false,
};

export const BG_STALE_IMG = {
    x: px(180),
    y: px(182),
    src: 'watchdrip/stale.png',
    visible: false,
};

export const IOB_TEXT = {
    x: px(112),
    y: px(330),
    w: px(256),
    h: px(34),
    color: Colors.white,
    text_size: px(24),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const TREATMENT_TEXT = {
    x: px(135),
    y: px(360),
    w: px(214),
    h: px(34),
    color: Colors.white,
    text_size: px(24),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const PHONE_BATTERY_TEXT = {
    x: px(325),
    y: px(276),
    w: px(80),
    h: px(36),
    color: Colors.white,
    text_size: px(26),
    align_h: hmUI.align.LEFT,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const BG_STATUS_LOW_IMG = {
    x: px(158),
    y: px(136),
    src: 'watchdrip/bgLow.png',
};

export const BG_STATUS_OK_IMG = {
    x: px(180),
    y: px(136),
    src: 'watchdrip/bgOk.png',
};

export const BG_STATUS_HIGHT_IMG = {
    x: px(278),
    y: px(136),
    src: 'watchdrip/bgHight.png',
};

export const IMG_STATUS_BT_DISCONNECTED = {
    x: px(124),
    y: px(143),
    src: img('status/bt_disconnect.png'),
    type: hmUI.system_status.DISCONNECT,
    show_level: hmUI.show_level.ONLY_NORMAL,
};

export const IMG_LOADING_PROGRESS = {
    x: px(217),
    y: px(281),
    src: 'watchdrip/progress.png',
    angle:0,
    center_x: 20,
    center_y: 20,
    visible: false,
};
