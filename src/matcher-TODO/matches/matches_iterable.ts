import { type int } from "../../common";
import { Parser } from "../../core/parser";
import { MatchesIterator } from "./matches_iterator";

export { MatchesIterable };

class MatchesIterable<T> implements Iterable<T> {
    readonly parser: Parser<T>;
    readonly input: string;
    readonly start: int;
    readonly overlapping: boolean;

    constructor(parser: Parser<T>, input: string, start: int, overlapping: boolean = false) {
        this.parser = parser;
        this.input = input;
        this.start = start;
        this.overlapping = overlapping;
    }

    [Symbol.iterator](): Iterator<T> {
        return new MatchesIterator(this.parser, this.input, this.start, this.overlapping);
    }
}
