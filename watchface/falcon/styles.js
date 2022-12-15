import {img,range} from "../../utils/helper";
import {Colors} from "../../utils/config/constants";

let bgNumArr = range(10).map((v) => {
    return img(`bgNum/${v}.png`);
});

let weekEnArray = range(1, 7).map((v) => {
    return img(`week_en/${v}.png`);
});

let bigNumArr = range(10).map((v) => {
    return img(`bigNum/${v}.png`);
});

let smallNumArr = range(10).map((v) => {
    return img(`smallNum/${v}.png`);
});

let smallNumAccentArr = range(10).map((v) => {
    return img(`smallNumAccent/${v}.png`);
});

export const DIGITAL_TIME_HOUR = {
    hour_startX: px(134),
    hour_startY: px(50),
    hour_zero: true,
    hour_space: 0,
    hour_align: hmUI.align.CENTER_H,
    hour_array: bigNumArr,
};

export const DIGITAL_TIME_MINUTES = {
    minute_startX: px(250),
    minute_startY: px(50),
    minute_zero: true,
    minute_space: 0,
    minute_align: hmUI.align.CENTER_H,
    minute_array: bigNumArr,
};

export const TIME_AM_PM = {
    am_x: px(342),
    am_y: px(98),
    am_sc_path: img('bigNum/am.png'),
    am_en_path: img('bigNum/am.png'),
    pm_x: px(342),
    pm_y: px(98),
    pm_sc_path: img('bigNum/pm.png'),
    pm_en_path: img('bigNum/pm.png'),
}

export const DIGITAL_TIME_SEPARATOR = {
    x: px(232),
    y: px(73),
    src: img( `bigNum/sp.png`)
};

export const ANALOG_TIME_SECONDS = {
    second_centerX: px(240),
    second_centerY: px(240),
    second_posX: px(6),
    second_posY: px(232),
    second_path: img("point/sec.png")
};

export const NORMAL_HEART_RATE_TEXT_IMG = {
    x: px(98),
    y: px(202),
    w: px(63),
    padding: false,
    h_space: 1,
    align_h: hmUI.align.RIGHT,
    type: hmUI.data_type.HEART,
    show_level: hmUI.show_level.ONLY_NORMAL,
    font_array: smallNumArr
}

export const NORMAL_STEPS_TEXT_IMG = {
    x: px(316),
    y: px(202),
    w: px(133),
    padding: false,
    h_space: 1,
    align_h: hmUI.align.CENTER_H,
    type: hmUI.data_type.STEP,
    show_level: hmUI.show_level.ONLY_NORMAL,
    font_array: smallNumArr
}

export const NORMAL_DIST_TEXT_IMG = {
    x: px(313),
    y: px(252),
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
    x: px(37),
    y: px(252),
    week_en: weekEnArray,
    week_tc: weekEnArray,
    week_sc: weekEnArray,
}

export const DAYS_TEXT_IMG = {
    day_startX: px(126),
    day_startY: px(252),
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
    y: px(12),
    w: px(444),
    h: px(444),
    start_angle: -253,
    end_angle: -196,
    color: Colors.accent,
    line_width: px(9),
    show_level: hmUI.show_level.ONLY_NORMAL,
}

export const PAI_ARC = {
    x: px(11),
    y: px(13),
    w: px(444),
    h: px(444),
    start_angle: 73,
    end_angle: 16,
    color: Colors.accent,
    line_width: px(9),
    show_level: hmUI.show_level.ONLY_NORMAL,
}

export const BG_VALUE_NO_DATA_TEXT = {
    x: px(176),
    y: px(160),
    w: px(126),
    h: px(55),
    color: Colors.white,
    text_size: px(45),
    align_h: hmUI.align.RIGHT,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
    text: 'No data'
};

export const BG_VALUE_TEXT_IMG = {
    x: px(176),
    y: px(157),
    w: px(126),
    color: Colors.white,
    align_h: hmUI.align.CENTER_H,
    dot_image: img('bgNum/d.png'),
    font_array: bgNumArr,
    text: '0',
    visible: false,
    h_space:1
};

export const BG_TIME_TEXT = {
    x: px(176),
    y: px(300),
    w: px(129),
    h: px(35),
    color: Colors.defaultTransparent,
    text_size: px(26),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const BG_DELTA_TEXT = {
    x: px(225),
    y: px(249),
    w: px(77),
    h: px(40),
    color: Colors.defaultTransparent,
    text_size: px(34),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const BG_TREND_IMAGE = {
    src: 'watchdrip/arrows/None.png',
    x: px(183),
    y: px(253),
    w: px(46),
    h: px(48),
};

export const BG_STALE_RECT = {
    x: px(125),
    y: px(120),
    w: px(120),
    h: px(4),
    color: Colors.white,
    visible: false,
};

export const BG_STALE_IMG = {
    x: px(194),
    y: px(189),
    src: 'watchdrip/stale.png',
    visible: false,
};

export const IOB_TEXT = {
    x: px(112),
    y: px(353),
    w: px(256),
    h: px(30),
    color: Colors.white,
    text_size: px(24),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
};

export const TREATMENT_TEXT = {
    x: px(135),
    y: px(384),
    w: px(214),
    h: px(30),
    color: Colors.white,
    text_size: px(24),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const PHONE_BATTERY_TEXT = {
    x: px(343),
    y: px(292),
    w: px(80),
    h: px(28),
    color: Colors.white,
    text_size: px(24),
    align_h: hmUI.align.LEFT,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
};

export const BG_STATUS_LOW_IMG = {
    x: px(167),
    y: px(143),
    src: 'watchdrip/bgLow.png',
    visible: false,
};

export const BG_STATUS_OK_IMG = {
    x: px(190),
    y: px(143),
    src: 'watchdrip/bgOk.png',
    visible: false,
};

export const BG_STATUS_HIGHT_IMG = {
    x: px(293),
    y: px(143),
    src: 'watchdrip/bgHight.png',
    visible: false,
};

export const IMG_STATUS_BT_DISCONNECTED = {
    x: px(124),
    y: px(143),
    src: img('status/bt_disconnect.png'),
    type: hmUI.system_status.DISCONNECT,
    show_level: hmUI.show_level.ONLY_NORMAL,
};
