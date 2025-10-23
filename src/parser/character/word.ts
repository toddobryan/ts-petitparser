import { Parser } from "../../core/parser";
import { CharacterParser } from "../predicate/character";
import { WordCharPredicate } from "./predicate/word";

export { word };

const word = (message: string = 'letter or digit expected'): Parser<string> => {
    return CharacterParser.create(new WordCharPredicate(), message);
}
