import { describe, expect, test } from "@jest/globals";
import { CharacterParser } from "../src/parser/predicate/character";
import { ConstantCharPredicate } from "../src/parser/character/predicate/constant";
import { Parser } from "../src/core/parser";
import { Success } from "../src/core/result";
import { int } from "../src/common";

describe("any", () => {
    test("any() parses 'a'", () => {
        const p: Parser<string> = CharacterParser.create(ConstantCharPredicate.any, "input expected");
        expect(p.parse("a")).toStrictEqual(new Success("a", 1 as int, "a"));
        //expect(p.accept("a")).toBe(true);
    });
});