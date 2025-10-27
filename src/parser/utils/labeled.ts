import {ParserImpl} from "../../core/parserImpl";

export { LabeledParser };

abstract class LabeledParser<T> extends ParserImpl<T> {
    abstract get label(): string;
}