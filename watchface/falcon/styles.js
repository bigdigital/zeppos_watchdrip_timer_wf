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
    hour_startX: px(120),
    hour_startY: px(46),
    hour_zero: true,
    hour_space: 2,
    hour_align: hmUI.align.CENTER_H,
    hour_array: bigNumArr,
    minute_startX: px(218),
    minute_startY: px(46),
    minute_zero: true,
    minute_space: 2,
    minute_align: hmUI.align.CENTER_H,
    minute_array: bigNumArr,
    am_x: px(298),
    am_y: px(84),
    am_sc_path: img('bigNum/am.png'),
    am_en_path: img('bigNum/am.png'),
    pm_x: px(298),
    pm_y: px(84),
    pm_sc_path: img('bigNum/pm.png'),
    pm_en_path: img('bigNum/pm.png'),
};

export const DIGITAL_TIME_AOD = {
    hour_array: bigNumArrAOD,
    minute_array: bigNumArrAOD,
    am_sc_path: img('bigNumAOD/am.png'),
    am_en_path: img('bigNumAOD/am.png'),
    pm_sc_path: img('bigNumAOD/pm.png'),
    pm_en_path: img('bigNumAOD/pm.png'),
    ...DIGITAL_TIME
};


export const DIGITAL_TIME_SEPARATOR = {
    x: px(203),
    y: px(63),
    src: img( `bigNum/sp.png`)
};

export const DIGITAL_TIME_SEPARATOR_AOD = {
    x: px(203),
    y: px(63),
    src: img( `bigNumAOD/sp.png`)
};

export const ANALOG_TIME_SECONDS = {
    second_centerX: px(208),
    second_centerY: px(208),
    second_posX: px(6),
    second_posY: px(201),
    second_path: img("point/sec.png")
};

export const NORMAL_HEART_RATE_TEXT_IMG = {
    x: px(88),
    y: px(175),
    w: px(53),
    padding: false,
    h_space: 1,
    align_h: hmUI.align.RIGHT,
    type: hmUI.data_type.HEART,
    show_level: hmUI.show_level.ONLY_NORMAL,
    font_array: smallNumArr
}

export const NORMAL_STEPS_TEXT_IMG = {
    x: px(276),
    y: px(175),
    w: px(117),
    padding: false,
    h_space: 1,
    align_h: hmUI.align.CENTER_H,
    type: hmUI.data_type.STEP,
    show_level: hmUI.show_level.ONLY_NORMAL,
    font_array: smallNumArr
}

export const NORMAL_DIST_TEXT_IMG = {
    x: px(275),
    y: px(218),
    w: px(78),
    padding: false,
    h_space: 1,
    align_h: hmUI.align.RIGHT,
    type: hmUI.data_type.DISTANCE,
    dot_image: img('smallNumAccent/d.png'),
    show_level: hmUI.show_level.ONLY_NORMAL,
    font_array: smallNumAccentArr
}

export const WEEK_DAYS = {
    x: px(33),
    y: px(219),
    week_en: weekEnArray,
    week_tc: weekEnArray,
    week_sc: weekEnArray,
}

export const DAYS_TEXT_IMG = {
    day_startX: px(109),
    day_startY: px(218),
    day_zero: 1,
    day_space: 1,
    day_align: hmUI.align.LEFT,
    day_is_character: false,
    day_sc_array: smallNumAccentArr,
    day_tc_array: smallNumAccentArr,
    day_en_array: smallNumAccentArr,
}

export const BATTERY_ARC = {
    x: px(21),
    y: px(8),
    w: px(390),
    h: px(390),
    start_angle: -253,
    end_angle: -196,
    color: Colors.accent,
    line_width: px(9),
    show_level: hmUI.show_level.ONLY_NORMAL,
}

export const PAI_ARC = {
    x: px(7),
    y: px(7),
    w: px(390),
    h: px(390),
    start_angle: 73,
    end_angle: 17,
    color: Colors.accent,
    line_width: px(9),
    show_level: hmUI.show_level.ONLY_NORMAL,
}

export const BG_VALUE_NO_DATA_TEXT = {
    x: px(155),
    y: px(142),
    w: px(108),
    h: px(50),
    color: Colors.white,
    text_size: px(42),
    align_h: hmUI.align.RIGHT,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
    text: 'No data'
};

export const BG_VALUE_TEXT_IMG = {
    x: px(155),
    y: px(138),
    w: px(108),
    color: Colors.white,
    align_h: hmUI.align.CENTER_H,
    dot_image: img('bgNum/d.png'),
    font_array: bgNumArr,
    text: '0',
    visible: false,
    h_space:1
};

export const BG_TIME_TEXT = {
    x: px(152),
    y: px(258),
    w: px(114),
    h: px(33),
    color: Colors.defaultTransparent,
    text_size: px(24),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const BG_DELTA_TEXT = {
    x: px(197),
    y: px(216),
    w: px(69),
    h: px(45),
    color: Colors.defaultTransparent,
    text_size: px(30),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const BG_TREND_IMAGE = {
    src: 'watchdrip/arrows/None.png',
    x: px(154),
    y: px(220),
    w: px(42),
    h: px(45),
};

export const BG_STALE_RECT = {
    x: px(155),
    y: px(120),
    w: px(120),
    h: px(4),
    color: Colors.white,
    visible: false,
};

export const BG_STALE_IMG = {
    x: px(155),
    y: px(166),
    src: 'watchdrip/stale.png',
    visible: false,
};

export const IOB_TEXT = {
    x: px(88),
    y: px(302),
    w: px(243),
    h: px(30),
    color: Colors.white,
    text_size: px(22),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
};

export const TREATMENT_TEXT = {
    x: px(113),
    y: px(328),
    w: px(190),
    h: px(32),
    color: Colors.white,
    text_size: px(22),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const PHONE_BATTERY_TEXT = {
    x: px(298),
    y: px(255),
    w: px(71),
    h: px(27),
    color: Colors.white,
    text_size: px(23),
    align_h: hmUI.align.LEFT,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const BG_STATUS_LOW_IMG = {
    x: px(145),
    y: px(124),
    src: 'watchdrip/bgLow.png',
};

export const BG_STATUS_OK_IMG = {
    x: px(165),
    y: px(124),
    src: 'watchdrip/bgOk.png',
};

export const BG_STATUS_HIGHT_IMG = {
    x: px(255),
    y: px(124),
    src: 'watchdrip/bgHight.png',
};

export const IMG_STATUS_BT_DISCONNECTED = {
    x: px(106),
    y: px(124),
    src: img('status/bt_disconnect.png'),
    type: hmUI.system_status.DISCONNECT,
    show_level: hmUI.show_level.ONLY_NORMAL,
};

export const IMG_LOADING_PROGRESS = {
    x: px(189),
    y: px(255),
    src: 'watchdrip/progress.png',
    angle:0,
    center_x: 20,
    center_y: 20,
    visible: false,
};