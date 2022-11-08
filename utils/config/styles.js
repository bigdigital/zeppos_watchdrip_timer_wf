import { gettext as getText } from "i18n";
import { DEVICE_WIDTH } from "./device";
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


export const COMMON_TITLE_TEXT = {
  x: px(96),
  y: px(100),
  w: px(288),
  h: px(46),
  color: Colors.white,
  text_size: px(36),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.NONE,
};