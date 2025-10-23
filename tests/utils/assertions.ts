/*import "jest";
import { expect, test } from "@jest/globals";
import { Parser } from "../../dist/core/parser";
import { Result, Success } from "../../dist/core/result";
import { int } from "../../dist/common";

export { expectParserInvariants };

expect.extend({
    toHaveIdenticalElementsAs<T>(received: T[], expected: T[]): jest.CustomMatcherResult {
        let pass: boolean = true;
        pass = pass && received.length === expected.length;
        for (let i = 0; i < received.length; i++) {
            pass = pass && received[i]! === expected[i]!;
            if (!pass) {
                break;
            }
        }
        return {
            pass: pass,
            message: () => `expected ${received} and ${expected} to have identical elements`,
        };
    },

    isParserDeepEqual(received: Parser<any>, expected: Parser<any>): jest.CustomMatcherResult {
        return {
            pass: received.isEqualTo(expected) && expected.isEqualTo(received),
            message: () => `expected ${received} to deep equal ${expected}`,
        };
    },

    isParseSuccess<T>(received: Parser<T>, input: string, value: T, position?: int): jest.CustomMatcherResult {
        const result: Result<T> = received.parse(input);
        let pass: boolean =  result instanceof Success &&
            result.buffer === input &&
            result.position === (position ?? input.length as int) &&
            result.value === value;
        if (pass) {
            const accepted = received.accept(input);
            pass = pass && accepted;
        }
        return {
            pass: pass,
            message: () => `expected ${received} to parser ${input}`,
        }
    },
})

const expectParserInvariants = <T>(parser: Parser<T>) => {
    test('copy', () => {
        const copy = parser.copy();
        expect(copy).not.toBe(parser);
        expect(copy.toString()).toStrictEqual(parser.toString());
        expect(copy.runtimeType).toStrictEqual(parser.runtimeType);
        expect(copy.children).toHaveIdenticalChildren(parser.children);
        expect(copy).isParserDeepEqual(parser);
    });
}*/