import { Parser } from "../../core/parser";
import { CharacterParser } from "../predicate/character";
import { ConstantCharPredicate } from "./predicate/constant";

export { any };

const any = (message: string = "input expected", unicode: boolean = false): Parser<string> => {
    return CharacterParser.create(ConstantCharPredicate.any, message, unicode);
}