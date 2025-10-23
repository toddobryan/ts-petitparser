import { Parser } from "../../core/parser";
import { CharacterParser } from "../predicate/character";
import { UppercaseCharPredicate } from "./predicate/uppercase";

export { uppercase };

const uppercase = (message: string = "uppercase letter expected"): Parser<string> => {
    return CharacterParser.create(new UppercaseCharPredicate(), message);
}
