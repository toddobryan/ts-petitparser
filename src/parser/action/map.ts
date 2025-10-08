import { type int } from "../../common.js";
import { Context } from "../../core/context.js";
import { Parser } from "../../core/parser.js";
import { Failure } from "../../core/result.js";
import { type Callback } from "../../shared/types.js";
import { DelegateParser } from "../combinator/delegate.js";

export { MapParser };

class MapParser<T, U> extends DelegateParser<T, U> {
    readonly callback: Callback<T, U>;
    readonly hasSideEffects: boolean;

    constructor(delegate: Parser<T>, callback: Callback<T, U>, hasSideEffects: boolean = false) {
        super(delegate);
        this.callback = callback;
        this.hasSideEffects = hasSideEffects;
    }
    
    parseOn(context: Context) {
        const result = this.delegate.parseOn(context);
        if (result instanceof Failure) {
            return result;
        } else {
            return result.success(this.callback(result.value));
        }
    }

    override fastParseOn(buffer: string, position: int): int {
        return this.hasSideEffects ? super.fastParseOn(buffer, position) : this.delegate.fastParseOn(buffer, position);
    }

    override hasEqualProperties(other: MapParser<T, U>): boolean {
        return super.hasEqualProperties(other) && this.callback === other.callback && this.hasSideEffects === other.hasSideEffects;
    }

    copy(): MapParser<T, U> {
        return new MapParser<T, U>(this.delegate, this.callback, this.hasSideEffects);
    }
}