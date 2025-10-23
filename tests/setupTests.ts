/* eslint-disable @typescript-eslint/no-explicit-any */
import "jest";

import { expect } from "@jest/globals";
import { Parser } from "../src/core/parser";
import { type int } from "../src/common";
import { Result, Success } from "../src/core/result";

export {};

declare module '@jest/globals' {
    interface Matchers<R> {
        toHaveIdenticalElementsAs(expected: R[]): jest.CustomMatcherResult;
        isParserDeepEqual(expected: Parser<any>): jest.CustomMatcherResult;
        isParseSuccess(input: string, result: R, position?: int): jest.CustomMatcherResult;
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
})

