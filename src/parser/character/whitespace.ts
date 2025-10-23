import { Parser } from "../../core/parser";
import { CharacterParser } from "../predicate/character";
import { WhitespaceCharPredicate } from "./predicate/whitespace";

export { whitespace };

const whitespace = (message: string = "whitespace expected"): Parser<string> => {
    return CharacterParser.create(new WhitespaceCharPredicate(), message);
}
