import {MINUTE_IN_MS, SECOND_IN_MS} from "../../shared/date";

export const DATA_TIMER_UPDATE_INTERVAL_MS = SECOND_IN_MS * 1;
export const DATA_UPDATE_INTERVAL_MS = MINUTE_IN_MS * 1;

export const DATA_STALE_TIME_MS = 30 * 1000;

export const FILES_DIR = "/storage/watchdrip/";

export const Commands = {
    getInfo: "CMD_GET_INFO",
    getImg: "CMD_GET_IMG",
};

export const Colors = {
    default:0xfc6950,
    defaultTransparent:0xababab,
    white:0xffffff,
    black:0x000000,
    bgHigh:0xffa0a0,
    bgLow:0x8bbbff,
    accent:0xffbeff37,
};
