/* eslint-disable @typescript-eslint/no-explicit-any */
import {type Parser} from "../../core/parser";
import {ParserImpl} from "../../core/parserImpl";

export {DelegateParser};

abstract class DelegateParser<T, U> extends ParserImpl<U> {
    delegate: Parser<T>;

    protected constructor(delegate: Parser<T>) {
        super();
        this.delegate = delegate;
    }

    get children(): Parser<any>[] {
        return [this.delegate];
    }

    replace(source: Parser<any>, target: Parser<any>): void {
        super.replace(source, target);
        if (this.delegate === source) {
            this.delegate = target as Parser<T>;
        }
    }
}