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

export const BG_VALUE_TEXT = {
  x: px(50),
  y: px(90),
  w: px(230),
  h: px(50),
  color: Colors.white,
  text_size: px(50),
  align_h: hmUI.align.RIGHT,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.NONE,
};

export const BG_TIME_TEXT = {
  x: px(285),
  y: px(100),
  w: px(200),
  h: px(50),
  color: Colors.white,
  text_size: px(20),
  align_h: hmUI.align.LEFT,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.NONE,
};

export const BG_TREND_IMAGE = {
  x: px(100),
  y: px(100),
  src: "watchdrip/images/arrows/None.png",
};