/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parser } from "../../core/parser";

export { ListParser };

abstract class ListParser<T, U> extends Parser<U> {
    readonly _children: Parser<T>[];

    constructor(children: Parser<T>[]) {
        super();
        this._children = children;
    }

    override get children() {
        return this._children;
    }

    override replace(source: Parser<any>, target: Parser<any>) {
        super.replace(source, target);
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] === source) {
                this.children[i] = target as Parser<T>;
            }
        }
    }
}