import { Parser } from "../../core/parser";
import { CharacterParser } from "../predicate/character";
import { LowercaseCharPredicate } from "./predicate/lowercase";

export { lowercase };

const lowercase = (message: string = "lowercase letter expected"): Parser<string> => {
    return CharacterParser.create(new LowercaseCharPredicate(), message);
}