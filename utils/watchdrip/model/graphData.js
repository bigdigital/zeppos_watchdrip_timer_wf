export class GraphData {
    constructor(start, end, lines, fuzzer ) {
        this.start = start;
        this.end = end;
        this.lines = lines;
        this.fuzzer = fuzzer;
    }

    static createEmpty() {
        return new GraphData("", "", "", "");
    }
}