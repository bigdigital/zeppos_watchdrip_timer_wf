import {json2str} from "../shared/data";

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const img = (function (type) {
    return (path) => type + "/" + path;
})("images");

export function range(start, end, step = 1) {
    if (arguments.length === 1) {
        end = start;
        start = 0;
        step = 1;
    }

    const result = [];
    for (let i = start; i < end; i += step) {
        result.push(i);
    }

    return result;
}

export function simpleObjectHash(obj) {
    const jsonString = json2str(sortObjectKeys(obj));

    let hash = 0;

    for (let i = 0; i < jsonString.length; i++) {
        const char = jsonString.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }

    return hash >>> 0;
}

function sortObjectKeys(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    }

    const sortedKeys = Object.keys(obj).sort();
    const sortedObj = {};

    sortedKeys.forEach(key => {
        sortedObj[key] = sortObjectKeys(obj[key]);
    });

    return sortedObj;
}