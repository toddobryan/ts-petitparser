import { Parser } from "../../core/parser.js";

export { ResolvableParser };

abstract class ResolvableParser<T> extends Parser<T> {
    abstract resolve(): Parser<T>;
}