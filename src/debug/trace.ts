/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from "../core/context.js";
import { Parser } from "../core/parser.js";
import { Result } from "../core/result.js";
import { transformParser } from "../reflection/transform.js";
import { type VoidCallback, type Predicate } from "../shared/types.js";

export { TraceEvent, trace };

const trace = <T>(root: Parser<T>, 
    output: VoidCallback<TraceEvent> = console.log,
    predicate?: Predicate<Parser<any>>,
): Parser<T> => {
    let parent: TraceEvent | null = null;
    return transformParser(root, <T>(parser: Parser<T>): Parser<T> => {
        if (predicate == null || predicate(parser)) {
            return parser.callCC((continuation, context) => {
                const currentParent = parent;
                output(parent = new _TraceEvent(currentParent, parser, context));
                const result = continuation(context);
                output(new _TraceEvent(currentParent, parser, context, result));
                parent = currentParent;
                return result;
            });
        } else {
            return parser;
        }
    });
}

abstract class TraceEvent {
    abstract get parent(): TraceEvent | null;
    abstract get parser(): Parser<any>;
    abstract get context(): Context;
    abstract get result(): Result<any> | null;
    get level(): number {
        return this.parent ? this.parent!.level + 1 : 0;
    }
}

class _TraceEvent extends TraceEvent {
    readonly _parent: TraceEvent | null;
    readonly _parser: Parser<any>;
    readonly _context: Context;
    readonly _result: Result<any> | null;
    
    constructor(parent: TraceEvent | null, parser: Parser<any>, context: Context, result: Result<any> | null = null) { 
        super();
        this._parent = parent;
        this._parser = parser;
        this._context = context;
        this._result = result;
    }

    override get parent(): TraceEvent | null {
        return this._parent;
    }

    override get parser(): Parser<any> {
        return this._parser;
    }
    
    override get context(): Context {
        return this._context;
    }

    override get result(): Result<any> | null {
        return this._result;
    }

    override toString(): string {
        const spaces = "  ".repeat(this.level);
        return `${spaces}${this.result ?? this.parser}`;
    }
}