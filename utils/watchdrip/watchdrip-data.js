const BG_STALE_TIME_MS = 30 * 60 * 1000;

export class WatchdripData {
    constructor(timeSensor) {
        this.data = null;
        this.timeSensor = timeSensor;
    }

    setData(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    isDataStale() {
        return this.data && (this.data.isStale || this.timeSensor.utc - this.getBgTimestamp > BG_STALE_TIME_MS)
    }

    getBgTimestamp() {
        return this.getEmptyIfNotDefined("bgTime"); //this.data.bgTimestamp;
    }

    getBgVal() {
        return this.getEmptyIfNotDefined("bgVal");
    }

    getEmptyIfNotDefined(paramName) {
        if (this.data == null) {
            return "";
        }
        if (paramName in this.data) {
            return this.data[paramName]
        }
        return "";
    }

    getArrowText()
    {
        switch (this.getEmptyIfNotDefined("arrow"))
        {
            case 'FortyFiveDown':
                return '↘';
            case 'FortyFiveUp':
                return '↗';
            case 'Flat':
                return '→';
            case 'SingleDown':
                return '↓';
            case 'DoubleDown':
                return '↓↓';
            case 'SingleUp':
                return '↑';
            case 'DoubleUp':
                return '↑↑';
            default:
                return "";
        }
    }
}