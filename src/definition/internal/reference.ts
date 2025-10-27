/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Parser} from "../../core/parser";
import {Context, Result, UnsupportedError} from "../../core/context_result_and_errors";
import {ResolvableParser} from "../../parser/utils/resolvable";
import {ParserImpl} from "../../core/parserImpl";

export {ReferenceParser};

class ReferenceParser<T> extends ResolvableParser<T> {
    readonly func: Function;
    readonly args: any[];

    constructor(func: Function, args: any[]) {
        super();
        this.func = func;
        this.args = args;
    }

    override resolve(): Parser<T> {
        return this.func(...this.args) as Parser<T>;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parseOn(context: Context): Result<T> {
        throw new UnsupportedError("Unsupported operation on parser reference");
    }

    copy(): ReferenceParser<T> {
        throw new UnsupportedError("Unsupported operation on parser reference");
    }

    equals(other: any): boolean {
        if (!(other instanceof ReferenceParser)) {
            return false;
        } else {
            if (this.func !== other.func || this.args.length !== other.args.length) {
                return false;
            }
            for (let i = 0; i < this.args.length; i++) {
                const a = this.args[i];
                const b = other.args[i];
                if (a instanceof ParserImpl &&
                    !(a instanceof ReferenceParser) &&
                    b instanceof ParserImpl &&
                    !(b instanceof ReferenceParser)
                ) {
                    if (!a.isEqualTo(b)) {
                        return false;
                    }
                } else {
                    if (a !== b) {
                        return false;
                    }
                }
            }
            return true;
        }
    }
}
