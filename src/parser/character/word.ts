import { Parser } from "../../core/parser.js";
import { CharacterParser } from "../predicate/character.js";
import { WordCharPredicate } from "./predicate/word.js";

export { word };

const word = (message: string = 'letter or digit expected'): Parser<string> => {
    return CharacterParser.create(new WordCharPredicate(), message);
}
