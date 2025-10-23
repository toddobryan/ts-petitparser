import { Parser } from "../../core/parser";

export { LabeledParser };

abstract class LabeledParser<T> extends Parser<T> {
    abstract get label(): string;
}