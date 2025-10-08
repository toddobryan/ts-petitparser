import { Parser } from "../../core/parser.js";

export { DelegateParser };

abstract class DelegateParser<T, U> extends Parser<U> {
    delegate: Parser<T>;

    constructor(delegate: Parser<T>) {
        super();
        this.delegate = delegate;
    }

    override get children(): Parser<any>[] {
        return [this.delegate];
    }

    override replace(source: Parser<any>, target: Parser<any>): void {
        super.replace(source, target);
        if (this.delegate === source) {
            this.delegate = target as Parser<T>;
        }
    }
}