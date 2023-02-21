import {Colors} from "./constants";
import {DEVICE_HEIGHT, DEVICE_WIDTH} from "./device";
import {img} from "../helper";

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

export const BG_FILL_RECT = {
    x: px(0),
    y: px(0),
    w: px(DEVICE_WIDTH),
    h: px(DEVICE_HEIGHT),
    color: Colors.black,
}

export const BG_IMG = {
    x: px(0),
    y: px(0),
    w: px(DEVICE_WIDTH),
    h: px(DEVICE_HEIGHT),
    src: img("bg/bg.png"),
    show_level: hmUI.show_level.ONLY_NORMAL
}