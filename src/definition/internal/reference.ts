/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from "../../core/context";
import { UnsupportedError } from "../../core/errors";
import { Parser } from "../../core/parser";
import { Result } from "../../core/result";
import { ResolvableParser } from "../../parser/utils/resolvable";

export { ReferenceParser };

class ReferenceParser<T> extends ResolvableParser<T> {
    readonly funct: Function;
    readonly args: any[];

    constructor(funct: Function, args: any[]) {
        super();
        this.funct = funct;
        this.args = args;
    }

    override resolve(): Parser<T> {
        return this.funct(...this.args) as Parser<T>;
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
            if (this.funct !== other.funct || this.args.length !== other.args.length) {
                return false;
            }
            for (let i = 0; i < this.args.length; i++) {
                const a = this.args[i];
                const b = other.args[i];
                if (a instanceof Parser && !(a instanceof ReferenceParser) && b instanceof Parser && !(b instanceof ReferenceParser)) {
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
        return false;
    }
}
