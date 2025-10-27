import {type Parser} from "../../core/parser";
import {ParserImpl} from "../../core/parserImpl";

export { ResolvableParser };

abstract class ResolvableParser<T> extends ParserImpl<T> {
    abstract resolve(): Parser<T>;
}