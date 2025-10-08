import { Parser } from "../../core/parser.js";
import { CharacterParser } from "../predicate/character.js";
import { ConstantCharPredicate } from "./predicate/constant.js";

export { any };

const any = (message: string = "input expected", unicode: boolean = false): Parser<string> => {
    return CharacterParser.create(ConstantCharPredicate.any, message, unicode);
}