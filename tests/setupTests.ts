/* eslint-disable @typescript-eslint/no-explicit-any */
import "jest";

import {expect, test} from "@jest/globals";
import { Parser } from "../src/core/parser";
import { type int } from "../src/common";
import { Result, Success } from "../src/core/context_result_and_errors";

export {expectParserInvariants};

declare module '@jest/globals' {
    interface Matchers<R> {
        toHaveIdenticalElementsAs(expected: R[]): jest.CustomMatcherResult;
        isParserDeepEqual(expected: Parser<any>): jest.CustomMatcherResult;
        isParseSuccess(input: string, result: R, position?: int): jest.CustomMatcherResult;
        toHaveIdenticalChildrenAs(parser: Parser<R>): jest.CustomMatcherResult;
    }
}

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

    toHaveIdenticalChildrenAs<T>(received: Parser<T>, expected: Parser<T>): jest.CustomMatcherResult {
        const customExpect = this.utils.expect;
        return customExpect(received.children).toHaveIdenticalElementsAs(expected.children);
    },

    isParserDeepEqual(received: Parser<any>, expected: Parser<any>): jest.CustomMatcherResult {
        return {
            pass: received.isEqualTo(expected) && expected.isEqualTo(received),
            message: () => `expected ${received} to deep equal ${expected}`,
        };
    },

    isParseSuccess<T>(received: Parser<T>, input: string, value: T, position?: int): jest.CustomMatcherResult {
        const result: Result<T> = received.parse(input);
        const pass: boolean =  result instanceof Success &&
            result.buffer === input &&
            result.position === (position ?? input.length as int) &&
            result.value === value;
        /*if (pass) {
            const accepted = received.accept(input);
            pass = pass && accepted;
        }*/
        return {
            pass: pass,
            message: () => `expected ${received} to parser ${input}`,
        }
    },
});

const expectParserInvariants = <T>(parser: Parser<T>) => {
    test('copy', () => {
        const copy: Parser<T> = parser.copy();
        expect(copy).not.toBe(parser);
        expect(copy.toString()).toStrictEqual(parser.toString());
        expect(copy.runtimeType).toStrictEqual(parser.runtimeType);
        expect(copy).toHaveIdenticalChildren(parser);
        expect(copy).isParserDeepEqual(parser);
    });
}
