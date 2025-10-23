/* eslint-disable @typescript-eslint/no-explicit-any */
import { type int } from "../common";
import { Context } from "../core/context";
import { Parser } from "../core/parser";
import { transformParser } from "../reflection/transform";
import { type VoidCallback, type Predicate } from "../shared/types";

export { progress };

const progress = <T>(
    root: Parser<T>, 
    output: VoidCallback<ProgressFrame> = console.log, 
    predicate?: Predicate<Parser<any>>,
): Parser<T> => {
    return transformParser(root, <T>(parser: Parser<T>): Parser<T> => {
        if (predicate == null || predicate(parser)) {
            return parser.callCC((continuation, context) => {
                output(new _ProgressFrame(parser, context));
                return continuation(context);
            });
        } else {
            return parser;
        }
    });
}

abstract class ProgressFrame {
    abstract get parser(): Parser<any>;
    abstract get context(): Context;
    get position(): int {
        return this.context.position;
    }
}

class _ProgressFrame extends ProgressFrame {
    readonly _parser: Parser<any>;
    readonly _context: Context;

    constructor(parser: Parser<any>, context: Context) {
        super();
        this._parser = parser;
        this._context = context;
    }

    override get parser(): Parser<any> {
        return this._parser;
    }
    
    override get context(): Context {
        return this._context;
    }

    override toString(): string {
        const stars = "*".repeat(1 + this.position);
        return `${stars} ${this.parser}`;
    }
}