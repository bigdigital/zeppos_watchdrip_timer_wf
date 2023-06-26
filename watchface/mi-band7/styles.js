import {img,range} from "../../utils/helper";
import {Colors} from "../../utils/config/constants";

const bgNumArr = range(10).map((v) => {
    return img(`bgNum/${v}.png`);
});

const bigNumArr = range(10).map((v) => {
    return img(`bigNum/${v}.png`);
});

// also used for bg value in AOD
const bigNumAODArr = range(10).map((v) => {
    return img(`bigNumAOD/${v}.png`);
});

const smallNumArr = range(10).map((v) => {
    return img(`smallNum/${v}.png`);
});

const smallNumAccentArr = range(10).map((v) => {
    return img(`smallNumAccent/${v}.png`);
});

const weekEnArr = range(1, 8).map((v) => {
    return img(`week_en/${v}.png`);
});

const weatherArr = range(29).map((v) => {
    return img(`weather/${v}.png`);
});

const moonArr = range(1, 30).map((v) => {
    return img(`moon/${v}.png`);
});

const heartArr = range(1, 7).map((v) => {
    return img(`widgets/heart/heart${v}.png`);
});

export const DIGITAL_TIME = {
    hour_startX: px(16),
    hour_startY: px(28),
    hour_zero: true,
    hour_space: 0,
    hour_align: hmUI.align.CENTER_H,
    hour_array: bigNumArr,
    hour_unit_sc: img('bigNum/sp.png'), // colon
    hour_unit_tc: img('bigNum/sp.png'),
    hour_unit_en: img('bigNum/sp.png'),
    minute_zero: true,
    minute_space: 0,
    minute_align: hmUI.align.CENTER_H,
    minute_array: bigNumArr,
    minute_follow: 1,
    am_x: px(137),
    am_y: px(40),
    am_sc_path: img('bigNum/am.png'),
    am_en_path: img('bigNum/am.png'),
    pm_x: px(137),
    pm_y: px(40),
    pm_sc_path: img('bigNum/pm.png'),
    pm_en_path: img('bigNum/pm.png'),
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const DIGITAL_TIME_AOD = {
    hour_startX: px(5),
    hour_startY: px(96),
    hour_array: bigNumAODArr,
    hour_unit_sc: img('bigNumAOD/sp.png'), // colon
    hour_unit_tc: img('bigNumAOD/sp.png'),
    hour_unit_en: img('bigNumAOD/sp.png'),
    minute_array: bigNumAODArr,
    am_sc_path: img('bigNumAOD/am.png'),
    am_en_path: img('bigNumAOD/am.png'),
    am_x: px(155),
    am_y: px(106),
    pm_sc_path: img('bigNumAOD/pm.png'),
    pm_en_path: img('bigNumAOD/pm.png'),
    pm_x: px(155),
    pm_y: px(106),
    show_level: hmUI.show_level.ONAL_AOD
};

const dateX = px(102);
const dateY = px(304);
const dateFontWidth = 16; // widest image in font array
const dateDotWidth = 7;
const dateFontSpacing = 1;
export const DATE_TEXT_IMG = {
    day_startX: px(dateX),
    day_startY: px(dateY),
    day_zero: 1,
    day_space: dateFontSpacing,
    day_follow: 0,
    day_align: hmUI.align.LEFT,
    day_sc_array: smallNumAccentArr,
    day_tc_array: smallNumAccentArr,
    day_en_array: smallNumAccentArr,
    day_unit_sc: img('smallNumAccent/d.png'), // dot
    day_unit_tc: img('smallNumAccent/d.png'),
    day_unit_en: img('smallNumAccent/d.png'),
    month_startX: px(dateX + (dateFontWidth * 2) + dateDotWidth + (dateFontSpacing * 3)),
    month_startY: px(dateY),
    month_follow: 0,
    month_zero: 1,
    month_space: dateFontSpacing,
    month_align: hmUI.align.LEFT,
    month_sc_array: smallNumAccentArr,
    month_tc_array: smallNumAccentArr,
    month_en_array: smallNumAccentArr,
    // month_unit_sc: img('smallNumAccent/d.png'), // dot
    // month_unit_tc: img('smallNumAccent/d.png'),
    // month_unit_en: img('smallNumAccent/d.png'),
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const WEEK_DAYS_IMG = {
    x: px(36),
    y: px(300),
    week_en: weekEnArr,
    week_tc: weekEnArr,
    week_sc: weekEnArr,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_VALUE_NO_DATA_TEXT = {
    x: px(66-44),
    y: px(160),
    w: px(59),
    h: px(46),
    color: Colors.white,
    text_size: px(34),
    align_h: hmUI.align.RIGHT,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
    text: 'No data',
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_VALUE_TEXT_IMG = {
    x: px(46-44),
    y: px(115-10),
    w: px(113),
    align_h: hmUI.align.CENTER_H,
    dot_image: img('bgNum/d.png'),
    font_array: bgNumArr,
    visible: false,
    h_space:1,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_VALUE_TEXT_IMG_AOD = {
    x: px(3),
    y: px(164),
    w: px(190),
    dot_image: img('bigNumAOD/d.png'),
    font_array: bigNumAODArr,
    show_level: hmUI.show_level.ONAL_AOD
};

export const BG_TIME_TEXT = {
    x: px(61-44),
    y: px(193-10),
    w: px(80),
    h: px(30),
    color: Colors.defaultTransparent,
    text_size: px(23),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_DELTA_TEXT = {
    x: px(74-44),
    y: px(168-10),
    w: px(56),
    h: px(41),
    color: Colors.defaultTransparent,
    text_size: px(27),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_TREND_IMAGE = {
    src: 'watchdrip/arrows/None.png',
    x: px(36),
    y: px(215),
    w: px(60),
    h: px(41),
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_STALE_IMG = {
//    x: px(69-45),
//    y: px(135-10),
    x: px(64-50),
    y: px(105-10-3),
    src: 'watchdrip/stale.png',
    visible: false,
    show_level: hmUI.show_level.ONLY_NORMAL
};

// Xdrip modified to put ExternalStatusService.getLastStatusLine()
export const AAPS_TEXT = {
    x: px(10),
    y: px(400),
    w: px(165),
    h: px(27),
    color: Colors.white,
    text_size: px(24),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
	visible: false,
    show_level: hmUI.show_level.ONLY_NORMAL
};

// Xdrip modified to put ExternalStatusService.getLastStatusLineTime()
export const AAPS_TIME_TEXT = {
    x: px(27),
    y: px(450),
    w: px(129),
    h: px(27),
    color: Colors.defaultTransparent,
    text_size: px(24),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
	visible: false,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const PHONE_BATTERY_TEXT = {
    x: px(150),
    y: px(264),
    w: px(42),
    h: px(26),
    color: Colors.white,
    text_size: px(20),
    align_h: hmUI.align.LEFT,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const WATCH_BATTERY_TEXT = {
    x: px(7),
    y: px(264),
    w: px(42),
    h: px(26),
    color: Colors.white,
    text_size: px(20),
    align_h: hmUI.align.RIGHT,
    align_v: hmUI.align.TOP,
    text_style: hmUI.text_style.NONE,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_STATUS_LOW_IMG = {
    x: px(44-44),
    y: px(105-10-3),
    src: 'watchdrip/bgLow.png',
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_STATUS_OK_IMG = {
    x: px(64-50),
    y: px(105-10-3),
    src: 'watchdrip/bgOk.png',
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const BG_STATUS_HIGH_IMG = {
    x: px(142-44),
    y: px(105-10-3),
    src: 'watchdrip/bgHigh.png',
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const IMG_STATUS_BT_DISCONNECTED = {
    x: px(16),
    y: px(27),
    src: img('status/bt_disconnect.png'),
    type: hmUI.system_status.DISCONNECT,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const IMG_LOADING_PROGRESS = {
    x: px(83-44),
    y: px(188-10),
    src: 'watchdrip/progress.png',
    angle: 0,
    center_x: 20,
    center_y: 20,
    visible: false,
    show_level: hmUI.show_level.ONLY_NORMAL
};


// 100% edit mask
export const EDIT_MASK_100 = {
    x: px(0),
    y: px(0),
    w: px(194),
    h: px(368),
    src: img('mask/mask100.png'),
    show_level: hmUI.show_level.ONLY_EDIT
};

// 70% edit mask
export const EDIT_MASK_70 = {
    x: px(0),
    y: px(0),
    w: px(194),
    h: px(368),
    src: img('mask/mask70.png'),
    show_level: hmUI.show_level.ONLY_EDIT
};


// BEGIN edit group treatments aaps/xdrip data
export const CUSTOM_WIDGETS = {
    NONE: 100001,
    XDRIP: 100002,
    AAPS: 100003
};

export const EDIT_GROUP_AAPS_XDRIP = {
    edit_id: 105,
    x: px(20),
    y: px(430),
    w: px(148),
    h: px(36),
    select_image: img('mask/select-wide.png'),
    un_select_image: img('mask/un_select-wide.png'),
    optional_types: [
        {
            type: CUSTOM_WIDGETS.XDRIP,
            title_sc: 'xDrip+ default treatments data',
            title_tc: 'xDrip+ default treatments data',
            title_en: 'xDrip+ default treatments data',
            preview: img('widgets/xdrip.png')
        },
        {
            type: CUSTOM_WIDGETS.AAPS,
            title_sc: 'AAPS IOB/COB data',
            title_tc: 'AAPS IOB/COB data',
            title_en: 'AAPS IOB/COB data',
            preview: img('widgets/aaps.png')
        },
        // custom empty widget, nothing is rendered
        {
            type: CUSTOM_WIDGETS.NONE,
            title_sc: 'None (empty space)',
            title_tc: 'None (empty space)',
            title_en: 'None (empty space)',
            preview: img('widgets/empty.png')
        }
    ],
    count: 3,
    default_type: CUSTOM_WIDGETS.XDRIP,
    tips_BG: img('mask/text_tag-wide.png'),
    tips_width: 148,
    tips_margin: 1, // optional, default value: 0,
    tips_x: -13,
    tips_y: -32,
    show_level: hmUI.show_level.ONLY_NORMAL | hmUI.show_level.ONLY_EDIT
};
// END edit group treatments aaps/xdrip data


// BEGIN edit group default styles
const editWidgetW = 68;
const editWidgetH = 60;
const editWidgetIconHeight = 30;
const editWidgetIconWidth = 30;
const editWidgetIconMargin = 7;
const editWidgetArcRadius = 12;
const editWidgetArcLineWidth = 8;
const editWidgetArcMarginX = 1;
const editWidgetArcMarginTop = -1;

const editGroupTypes = [
    {
        type: hmUI.edit_type.HEART,
        preview: img('widgets/heart/heart.png')
    },
    {
        type: hmUI.edit_type.SPO2,
        preview: img('widgets/spo2.png')
    },
    {
        type: hmUI.edit_type.STEP,
        preview: img('widgets/steps/steps.png')
    },
    {
        type: hmUI.edit_type.DISTANCE,
        preview: img('widgets/distance.png')
    },
    {
        type: hmUI.edit_type.CAL,
        preview: img('widgets/calories/calories.png')
    },
    {
        type: hmUI.edit_type.STAND,
        preview: img('widgets/stand/stand.png')
    },
    {
        type: hmUI.edit_type.PAI_DAILY,
        preview: img('widgets/pai/pai.png')
    },
    {
        type: hmUI.edit_type.WEATHER,
        preview: img('widgets/temp.png')
    },
    {
        type: hmUI.edit_type.HUMIDITY,
        preview: img('widgets/humidity/humidity.png')
    },
    {
        type: hmUI.edit_type.ALTIMETER,
        preview: img('widgets/air-pressure.png')
    },
    {
        type: hmUI.edit_type.UVI,
        preview: img('widgets/uvi/uvi.png')
    },
    {
        type: hmUI.edit_type.AQI,
        preview: img('widgets/aqi.png')
    },
    {
        type: hmUI.edit_type.MOON,
        preview: img('widgets/moon.png')
    },
    // custom empty widget, nothing is rendered
    {
        type: CUSTOM_WIDGETS.NONE,
        title_sc: 'None (empty space)',
        title_tc: 'None (empty space)',
        title_en: 'None (empty space)',
        preview: img('widgets/empty.png')
    }
];

export const EDIT_GROUP_DEFAULTS = {
    w: px(editWidgetW),
    h: px(editWidgetH),
    select_image: img('mask/select.png'),
    un_select_image: img('mask/un_select.png'),
    optional_types: editGroupTypes,
    count: editGroupTypes.length,
    tips_BG: img('mask/text_tag.png'),
    tips_width: 78,
    tips_margin: 10, // optional, default value: 0
    show_level: hmUI.show_level.ONLY_NORMAL | hmUI.show_level.ONLY_EDIT
};

export const EDIT_GROUP_W_DEFAULTS = {
    w: px(148),
    h: px(36),
    select_image: img('mask/select-wide.png'),
    un_select_image: img('mask/un_select-wide.png'),
    optional_types: editGroupTypes,
    count: editGroupTypes.length,
    tips_BG: img('mask/text_tag-wide.png'),
    tips_width: 148,
    tips_margin: 1, // optional, default value: 0
    show_level: hmUI.show_level.ONLY_NORMAL | hmUI.show_level.ONLY_EDIT
};

// Default styles for all IMG widgets 
export const EDIT_DEFAULT_IMG = {
    // TODO: make images full width and remove this
    w: px(editWidgetW), // full width to center
    show_level: hmUI.show_level.ONLY_NORMAL
};

// Default styles for all ARC_PROGRESS Left widgets
const EDIT_DEFAULT_ARC_PROGRESS_LEFT = {
    radius: px(editWidgetArcRadius),
    start_angle: 180,
    end_angle: 360,
    color: Colors.accent,
    line_width: editWidgetArcLineWidth,
    show_level: hmUI.show_level.ONLY_NORMAL
};
// Default styles for all ARC_PROGRESS RIGHT widgets
const EDIT_DEFAULT_ARC_PROGRESS_RIGHT = {
    radius: px(editWidgetArcRadius),
    start_angle: 180,
    end_angle: 0,
    color: Colors.accent,
    line_width: editWidgetArcLineWidth,
    show_level: hmUI.show_level.ONLY_NORMAL
};

export const EDIT_DEFAULT_ARC_PROGRESS = {
    left: EDIT_DEFAULT_ARC_PROGRESS_LEFT,
    right: EDIT_DEFAULT_ARC_PROGRESS_RIGHT

};

// Default styles for all TEXT_IMG widgets
export const EDIT_DEFAULT_TEXT_IMG = {
    w: px(editWidgetW),
    padding: false,
    h_space: 1,
    align_h: hmUI.align.CENTER_H,
    show_level: hmUI.show_level.ONLY_NORMAL,
    font_array: smallNumArr,
    dot_image: img('smallNum/d.png'),
    negative_image: img('smallNum/negative_image.png')
};
// END edit group default styles


// BEGIN Top Edit Widgets
const topX = 110+10+5;
const topY = 110;

export const EDIT_TOP_GROUP = {
    edit_id: 101,
    x: px(topX),
    y: px(topY),
    tips_x: -20,
    tips_y: -45,
    default_type: hmUI.edit_type.HEART
}; 

// Styles for all Top IMG widgets
export const EDIT_TOP_IMG = {
    x: px(topX),
    y: px(topY)
};

// Styles for all Top ARC_PROGRESS widgets
const EDIT_TOP_ARC_PROGRESS_LEFT = {
    center_x: px(topX + editWidgetArcRadius + editWidgetArcMarginX + (editWidgetArcLineWidth / 2)),
    center_y: px(topY + editWidgetArcRadius + editWidgetArcMarginTop + (editWidgetArcLineWidth / 2))
};
// Styles for all Top ARC_PROGRESS Right widgets
const EDIT_TOP_ARC_PROGRESS_RIGHT = {
    center_x: px(topX + editWidgetArcRadius + (2 * editWidgetArcMarginX) + editWidgetIconWidth + (editWidgetArcLineWidth / 2) + 1),
    center_y: px(topY + editWidgetArcRadius + editWidgetArcMarginTop + (editWidgetArcLineWidth / 2))
};
export const EDIT_TOP_ARC_PROGRESS = {
    left: EDIT_TOP_ARC_PROGRESS_LEFT,
    right: EDIT_TOP_ARC_PROGRESS_RIGHT
};

// Styles for all Top TEXT_IMG widgets
export const EDIT_TOP_TEXT_IMG = {
    x: px(topX),
    y: px(topY + editWidgetIconHeight + editWidgetIconMargin)
};
// END Top Left Edit Widgets


// BEGIN Wide Edit Widgets
const wideX = 25;
const wideY = 335;

export const EDIT_WIDE_GROUP = {
    edit_id: 102,
    x: px(wideX),
    y: px(wideY),
    tips_x: -25,
    tips_y: -45,
    default_type: hmUI.edit_type.STEP
}; 

// Default styles for all Wide IMG widgets
export const EDIT_WIDE_IMG = {
    x: px(wideX),
    y: px(wideY)
};

// Styles for all Wide ARC_PROGRESS widgets
const EDIT_WIDE_ARC_PROGRESS_LEFT = {
    center_x: px(wideX + editWidgetArcRadius + editWidgetArcMarginX + (editWidgetArcLineWidth / 2)),
    center_y: px(wideY + editWidgetArcRadius + editWidgetArcMarginTop + (editWidgetArcLineWidth / 2))
};
// Styles for all Wide ARC_PROGRESS Right widgets
const EDIT_WIDE_ARC_PROGRESS_RIGHT = {
    center_x: px(wideX + editWidgetArcRadius + (2 * editWidgetArcMarginX) + editWidgetIconWidth + (editWidgetArcLineWidth / 2) + 1),
    center_y: px(wideY + editWidgetArcRadius + editWidgetArcMarginTop + (editWidgetArcLineWidth / 2))
};
export const EDIT_WIDE_ARC_PROGRESS = {
    left: EDIT_WIDE_ARC_PROGRESS_LEFT,
    right: EDIT_WIDE_ARC_PROGRESS_RIGHT
};

// Styles for all Wide TEXT_IMG widgets
export const EDIT_WIDE_TEXT_IMG = {
    x: px(wideX + editWidgetIconWidth + editWidgetIconMargin+40),
    y: px(wideY)
};
// END Wide Edit Widgets


// BEGIN Bottom Edit Widgets
const bottomX = 110+10+5;
const bottomY = 190;

export const EDIT_BOTTOM_GROUP = {
    edit_id: 103,
    x: px(bottomX),
    y: px(bottomY),
    tips_x: 0,
    tips_y: 75,
    default_type: hmUI.edit_type.WEATHER
}; 

// Styles for all Bottom IMG widgets
export const EDIT_BOTTOM_IMG = {
    x: px(bottomX),
    y: px(bottomY)
};

// Styles for all Bottom ARC_PROGRESS widgets
const EDIT_BOTTOM_ARC_PROGRESS_LEFT = {
    center_x: px(bottomX + editWidgetArcRadius + editWidgetArcMarginX + (editWidgetArcLineWidth / 2)),
    center_y: px(bottomY + editWidgetArcRadius + editWidgetArcMarginTop + (editWidgetArcLineWidth / 2))
};
// Styles for all Bottom ARC_PROGRESS Right widgets
const EDIT_BOTTOM_ARC_PROGRESS_RIGHT = {
    center_x: px(bottomX + editWidgetArcRadius + (2 * editWidgetArcMarginX) + editWidgetIconWidth + (editWidgetArcLineWidth / 2) + 1),
    center_y: px(bottomY + editWidgetArcRadius + editWidgetArcMarginTop + (editWidgetArcLineWidth / 2))
};
export const EDIT_BOTTOM_ARC_PROGRESS = {
    left: EDIT_BOTTOM_ARC_PROGRESS_LEFT,
    right: EDIT_BOTTOM_ARC_PROGRESS_RIGHT
};

// Styles for all Bottom TEXT_IMG widgets
export const EDIT_BOTTOM_TEXT_IMG = {
    x: px(bottomX),
    y: px(bottomY + editWidgetIconHeight + editWidgetIconMargin)
};
// END Bottom Edit Widgets


// BEGIN Bottom Right Edit Widgets
/*const bottomRightX = 139;
const bottomRightY = 195;

export const EDIT_BOTTOM_RIGHT_GROUP = {
    edit_id: 104,
    x: px(bottomRightX),
    y: px(bottomRightY),
    tips_x: -25,
    tips_y: 75,
    default_type: hmUI.edit_type.DISTANCE
}; 

// Styles for all Bottom Right IMG widgets
export const EDIT_BR_IMG = {
    x: px(bottomRightX),
    y: px(bottomRightY)
};

// Styles for all Bottom Right ARC_PROGRESS widgets
const EDIT_BR_ARC_PROGRESS_LEFT = {
    center_x: px(bottomRightX + editWidgetArcRadius + editWidgetArcMarginX + (editWidgetArcLineWidth / 2)),
    center_y: px(bottomRightY + editWidgetArcRadius + editWidgetArcMarginTop + (editWidgetArcLineWidth / 2))
};
// Styles for all Bottom Right ARC_PROGRESS Right widgets
const EDIT_BR_ARC_PROGRESS_RIGHT = {
    center_x: px(bottomRightX + editWidgetArcRadius + (2 * editWidgetArcMarginX) + editWidgetIconWidth + (editWidgetArcLineWidth / 2) + 1),
    center_y: px(bottomRightY + editWidgetArcRadius + editWidgetArcMarginTop + (editWidgetArcLineWidth / 2))
};
export const EDIT_BR_ARC_PROGRESS = {
    left: EDIT_BR_ARC_PROGRESS_LEFT,
    right: EDIT_BR_ARC_PROGRESS_RIGHT
};

// Styles for all Bottom Right TEXT_IMG widgets
export const EDIT_BR_TEXT_IMG = {
    x: px(bottomRightX),
    y: px(bottomRightY + editWidgetIconHeight + editWidgetIconMargin)
};*/
// END Bottom Right Edit Widgets


// BEGIN Edit Widgets
// These styles are merged with the above default styles.
// HEART widget
export const EDIT_HEART_IMG = {
    src: img('widgets/heart/heart-base.png') // 90x40px
};
export const EDIT_HEART_IMG_LEVEL = {
    image_array: heartArr, // 90x40px
    image_length: heartArr.length,
    type: hmUI.data_type.HEART
    //level: 3
};
export const EDIT_HEART_TEXT_IMG = {
    type: hmUI.data_type.HEART
};

// STEP widget
export const EDIT_STEP_IMG = {
    src: img('widgets/steps/steps-base.png') // 90x40px 
};
export const EDIT_STEP_ARC_PROGRESS = {
    type: hmUI.data_type.STEP,
    //level: 75
};
export const EDIT_STEP_TEXT_IMG = {
    type: hmUI.data_type.STEP
};

// DISTANCE widget
export const EDIT_DISTANCE_IMG = {
    src: img('widgets/distance.png'), // 40x40px
    pos_x: px((editWidgetW - editWidgetIconWidth) / 2) // center the image
};
export const EDIT_DISTANCE_TEXT_IMG = {
    type: hmUI.data_type.DISTANCE,
    unit_sc: img('smallNum/unit-distance-metric.png'),
    unit_tc: img('smallNum/unit-distance-metric.png'),
    unit_en: img('smallNum/unit-distance-metric.png'),
    imperial_unit_sc: img('smallNum/unit-distance-imperial.png'),
    imperial_unit_tc: img('smallNum/unit-distance-imperial.png'),
    imperial_unit_en: img('smallNum/unit-distance-imperial.png'),
    align_h: hmUI.align.LEFT  // override alignment because of unit
};

// WEATHER widget
export const EDIT_WEATHER_CONDITION_IMG_LEVEL = {
    image_array: weatherArr, // 90x40px
    image_length: weatherArr.length,
    type: hmUI.data_type.WEATHER
};
export const EDIT_WEATHER_CURRENT_TEXT_IMG = {
    type: hmUI.data_type.WEATHER_CURRENT,
    unit_sc: img('smallNum/unit-temperature-metric.png'),
    unit_tc: img('smallNum/unit-temperature-metric.png'),
    unit_en: img('smallNum/unit-temperature-metric.png'),
    imperial_unit_sc: img('smallNum/unit-temperature-imperial.png'),
    imperial_unit_tc: img('smallNum/unit-temperature-imperial.png'),
    imperial_unit_en: img('smallNum/unit-temperature-imperial.png')
};

// PAI widget
export const EDIT_PAI_IMG = {
    src: img('widgets/pai/pai-base.png') // 90x40px
};
export const EDIT_PAI_ARC_PROGRESS = {
    type: hmUI.data_type.PAI_DAILY
};
export const EDIT_PAI_TEXT_IMG = {
    type: hmUI.data_type.PAI_DAILY
};

// UVI widget
export const EDIT_UVI_IMG = {
    src: img('widgets/uvi/uvi-base.png') // 90x40px
};
export const EDIT_UVI_ARC_PROGRESS = {
    type: hmUI.data_type.UVI
};
export const EDIT_UVI_TEXT_IMG = {
    type: hmUI.data_type.UVI
};

// ALTIMETER widget
export const EDIT_ALTIMETER_IMG = {
    src: img('widgets/air-pressure.png'), // 40x40px
    pos_x: px((editWidgetW - editWidgetIconWidth) / 2) // center the image
};
export const EDIT_ALTIMETER_TEXT_IMG = {
    type: hmUI.data_type.ALTIMETER,
    unit_sc: img('smallNum/unit-pressure-metric.png'),
    unit_tc: img('smallNum/unit-pressure-metric.png'),
    unit_en: img('smallNum/unit-pressure-metric.png'),
    imperial_unit_sc: img('smallNum/unit-pressure-imperial.png'),
    imperial_unit_tc: img('smallNum/unit-pressure-imperial.png'),
    imperial_unit_en: img('smallNum/unit-pressure-imperial.png'),
    align_h: hmUI.align.LEFT  // override alignment because of unit
};

// MOON widget
export const EDIT_MOON_IMG_LEVEL = {
    image_array: moonArr, // 90x70px
    image_length: moonArr.length,
    type: hmUI.data_type.WEATHER
};

// CAL widget
export const EDIT_CAL_IMG = {
    src: img('widgets/calories/calories-base.png') // 90x40px
};
export const EDIT_CAL_ARC_PROGRESS = {
    type: hmUI.data_type.CAL
};
export const EDIT_CAL_TEXT_IMG = {
    type: hmUI.data_type.CAL,
    unit_sc: img('smallNum/unit-calories.png'),
    unit_tc: img('smallNum/unit-calories.png'),
    unit_en: img('smallNum/unit-calories.png'),
    imperial_unit_sc: img('smallNum/unit-calories.png'),
    imperial_unit_tc: img('smallNum/unit-calories.png'),
    imperial_unit_en: img('smallNum/unit-calories.png'),
    align_h: hmUI.align.LEFT  // override alignment because of unit
};

// AQI widget
export const EDIT_AQI_IMG = {
    src: img('widgets/aqi.png'), // 40x40px
    pos_x: px((editWidgetW - editWidgetIconWidth) / 2) // center the image
};
export const EDIT_AQI_TEXT_IMG = {
    type: hmUI.data_type.AQI
};

// SPO2 widget
export const EDIT_SPO2_IMG = {
    src: img('widgets/spo2.png'), // 40x40px
    pos_x: px((editWidgetW - editWidgetIconWidth) / 2) // center the image
};
export const EDIT_SPO2_TEXT_IMG = {
    type: hmUI.data_type.SPO2,
    unit_sc: img('smallNum/unit-percent.png'),
    unit_tc: img('smallNum/unit-percent.png'),
    unit_en: img('smallNum/unit-percent.png'),
    imperial_unit_sc: img('smallNum/unit-percent.png'),
    imperial_unit_tc: img('smallNum/unit-percent.png'),
    imperial_unit_en: img('smallNum/unit-percent.png')
};

// STAND widget
export const EDIT_STAND_IMG = {
    src: img('widgets/stand/stand-base.png') // 90x40px
};
export const EDIT_STAND_ARC_PROGRESS = {
    type: hmUI.data_type.STAND
};
export const EDIT_STAND_TEXT_IMG = {
    type: hmUI.data_type.STAND,
    dot_image: img('smallNum/slash.png')
};

// HUMIDITY widget
export const EDIT_HUMIDITY_IMG = {
    src: img('widgets/humidity/humidity-base.png') // 90x40px
};
export const EDIT_HUMIDITY_ARC_PROGRESS = {
    type: hmUI.data_type.HUMIDITY
};
export const EDIT_HUMIDITY_TEXT_IMG = {
    type: hmUI.data_type.HUMIDITY,
    unit_sc: img('smallNum/unit-percent.png'),
    unit_tc: img('smallNum/unit-percent.png'),
    unit_en: img('smallNum/unit-percent.png'),
    imperial_unit_sc: img('smallNum/unit-percent.png'),
    imperial_unit_tc: img('smallNum/unit-percent.png'),
    imperial_unit_en: img('smallNum/unit-percent.png')
};

export const GRAPH_SETTINGS = {
    x: px(300),
    y: px(0),
    w: px(190),
    h: px(60),
    point_size: 8,
    treatment_point_size: 12,
    line_size: 3
};

// END Edit Widgets

