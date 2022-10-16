import { gettext as getText } from "i18n";
import { DEFAULT_COLOR, DEFAULT_COLOR_TRANSPARENT } from "./constants";
import { DEVICE_WIDTH } from "./device";

export const DEBUG_TEXT = {
  x: 0,
  y: 80,
  w: 400,
  h: 450,
  text_size: 12,
  char_space: 0,
  color: 0xffffff,
  text: "",
  text_style: hmUI.text_style.NONE,
  align_h: hmUI.align.LEFT,
  align_v: hmUI.align.TOP,
};


export const COMMON_TITLE_TEXT = {
  x: px(96),
  y: px(100),
  w: px(288),
  h: px(46),
  color: 0xffffff,
  text_size: px(36),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.NONE,
};