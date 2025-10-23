import type { int } from "../../common";
import type { Context } from "../../core/context";
import type { Parser } from "../../core/parser";
import type { Result } from "../../core/result";
import type { ResolvableParser } from "../utils/resolvable";
import { DelegateParser } from "./delegate";

export { SettableParser };

class SettableParser<T> extends DelegateParser<T, T> implements ResolvableParser<T> {
    constructor(delegate: Parser<T>) {
        super(delegate);
    }

    set(parser: Parser<T>): void {
        this.replace(this.children[0]!, parser);
    }

    resolve(): Parser<T> {
        return this.delegate;
    }

    override parseOn(context: Context): Result<T> {
        return this.delegate.parseOn(context);
    }

    override fastParseOn(buffer: string, position: int | number): int {
        return this.delegate.fastParseOn(buffer, position);
    }

    override copy(): SettableParser<T> {
        return new SettableParser(this.delegate);
    }
}