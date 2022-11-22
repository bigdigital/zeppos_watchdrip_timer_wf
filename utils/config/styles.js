import {Colors} from "./constants";

export const DEBUG_TEXT = {
    x: px(30),
    y: px(80),
    w: px(400),
    h: px(450),
    text_size: px(12),
    char_space: 0,
    color: Colors.white,
    text: "",
    text_style: hmUI.text_style.NONE,
    align_h: hmUI.align.LEFT,
    align_v: hmUI.align.TOP,
};

export const BG_VALUE_TEXT = {
    x: px(50),
    y: px(95),
    w: px(150),
    h: px(60),
    color: Colors.white,
    text_size: px(50),
    align_h: hmUI.align.RIGHT,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
};

export const BG_TIME_TEXT = {
    x: px(285),
    y: px(130),
    w: px(200),
    h: px(25),
    color: Colors.white,
    text_size: px(20),
    align_h: hmUI.align.LEFT,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
};

export const BG_DELTA_TEXT = {
    x: px(285),
    y: px(88),
    w: px(200),
    h: px(32),
    color: Colors.white,
    text_size: px(28),
    align_h: hmUI.align.LEFT,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
};

export const BG_TREND_IMAGE = {
    src: 'watchdrip/arrows/None.png',
    x: px(220),
    y: px(110),
    w: px(41),
    h: px(39),
};

export const BG_STALE_RECT = {
    x: px(125),
    y: px(120),
    w: px(120),
    h: px(4),
    color: Colors.white,
    visible: false,
};
