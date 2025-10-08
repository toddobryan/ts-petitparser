import { type int } from "../../common.js";
import { Context } from "../../core/context.js";
import { StateError } from "../../core/errors.js";
import { Result } from "../../core/result.js";
import { CharacterPredicate } from "../character/predicate.js";
import { ConstantCharPredicate } from "../character/predicate/constant.js";
import { CharacterParser } from "./character.js";

export { UnicodeCharacterParser };

class UnicodeCharacterParser extends CharacterParser {
    constructor(predicate: CharacterPredicate, message: string) {
        super(predicate, message);
    }
    
    static override create(predicate: CharacterPredicate, message: string): UnicodeCharacterParser {
        return ConstantCharPredicate.any.isEqualTo(predicate) ?
            new AnyUnicodeCharacterParser(predicate, message) :
            new UnicodeCharacterParser(predicate, message);
    }

    parseOn(context: Context): Result<string> {
        const buffer = context.buffer;
        const position = context.position;
        if (position < buffer.length) {
            let codeUnit = buffer.codePointAt(position)!;
            let nextPosition = position + 1;
            if (_isLeadSurrogate(codeUnit) && nextPosition < buffer.length) {
                const nextCodeUnit = buffer.codePointAt(nextPosition)!;
                if (_isTrailSurrogate(nextCodeUnit)) {
                    codeUnit = _combineSurrogatePair(codeUnit, nextCodeUnit);
                    nextPosition++;
                }
            }
            if (this.predicate.test(codeUnit)) {
                return context.success(buffer.substring(position, nextPosition), nextPosition as int);
            }
        }
        return context.failure(this.message);
    }

    override fastParseOn(buffer: string, position: int | number): int {
        if (position < buffer.length) {
            let codeUnit = buffer.codePointAt(position)!;
            position++;
            if (_isLeadSurrogate(codeUnit) && position < buffer.length) {
                const nextCodeUnit = buffer.codePointAt(position)!;
                if (_isTrailSurrogate(nextCodeUnit)) {
                    codeUnit = _combineSurrogatePair(codeUnit, nextCodeUnit);
                    position++
                }
            }
            if (this.predicate.test(codeUnit)) {
                return position as int;
            }
        }
        return -1 as int;
    }

    copy(): UnicodeCharacterParser {
        return new UnicodeCharacterParser(this.predicate, this.message);
    }
}

class AnyUnicodeCharacterParser extends UnicodeCharacterParser {
    static override create(predicate: CharacterPredicate, message: string): AnyUnicodeCharacterParser {
        if (!ConstantCharPredicate.any.isEqualTo(predicate)) {
            throw new StateError("AnyUnicodeCharacterParser can only be created with predicate ConstantCharPredicate.any")
        }
        return new AnyUnicodeCharacterParser(predicate, message);
    }

    constructor(predicate: CharacterPredicate, message: string) {
        super(predicate, message);
    }

    override parseOn(context: Context): Result<string> {
        const buffer = context.buffer;
        const position = context.position;
        if (position < buffer.length) {
            let nextPosition = position + 1;
            if (_isLeadSurrogate(buffer.codePointAt(position)!) && nextPosition < buffer.length && _isTrailSurrogate(buffer.codePointAt(nextPosition)!)) {
                nextPosition++;
            }
            return context.success(buffer.substring(position, nextPosition), nextPosition as int);
        }
        return context.failure(this.message);
    }

    override fastParseOn(buffer: string, position: int | number): int {
        if (position < buffer.length) {
            if (_isLeadSurrogate(buffer.codePointAt(position++)!) && position < buffer.length && _isTrailSurrogate(buffer.codePointAt(position)!)) {
                position++
            }
            return position as int;
        }
        return -1 as int;
    }
}

const _isLeadSurrogate = (code: number): boolean => {
    return (code & 0xFC00) === 0xD800
}

const _isTrailSurrogate = (code: number): boolean => {
    return (code & 0xFC00) === 0xDC00;
}

const _combineSurrogatePair = (start: number, end: number): number => {
    return 0x10000 + ((start & 0x3FF) << 10) + (end & 0x3FF);
}