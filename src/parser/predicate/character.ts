import {Context} from "vm";
import {int} from "../../common";
import {Result, StateError} from "../../core/context_result_and_errors";
import {CharacterPredicate} from "../character/predicate";
import {ConstantCharPredicate} from "../character/predicate/constant";
import {ParserImpl} from "../../core/parserImpl";

export { CharacterParser, SingleCharacterParser, UnicodeCharacterParser };

abstract class CharacterParser extends ParserImpl<string> {
    readonly predicate: CharacterPredicate;
    readonly message: string;

    protected constructor(predicate: CharacterPredicate, message: string) {
        super();
        this.predicate = predicate;
        this.message = message;
    }

    static create(
        predicate: CharacterPredicate,
        message: string,
        unicode: boolean = false,
    ): CharacterParser {
        if (unicode) {
            return new UnicodeCharacterParser(predicate, message);
        } else {
            return new SingleCharacterParser(predicate, message);
        }
    }

    override hasEqualProperties(other: CharacterParser): boolean {
        return super.hasEqualProperties(other) &&
        this.predicate.isEqualTo(other.predicate) &&
        this.message === other.message;
    }

}

class SingleCharacterParser extends CharacterParser {
    static override create(predicate: CharacterPredicate, message: string): SingleCharacterParser {
        return ConstantCharPredicate.any.isEqualTo(predicate) ? 
            new AnySingleCharacterParser(predicate, message) : 
            new SingleCharacterParser(predicate, message);
    }

    constructor(predicate: CharacterPredicate, message: string) {
        super(predicate, message);
    }

    parseOn(context: Context): Result<string> {
        const buffer: string = context.buffer;
        const position: int = context.position;
        if (position < buffer.length && this.predicate.test(buffer.charCodeAt(position))) {
            return context.success(buffer[position]!, (position + 1) as int);
        } else {
            return context.failure(this.message);
        }
    }

    override fastParseOn(buffer: string, position: int): int {
        return (position < buffer.length && this.predicate.test(buffer.charCodeAt(position)) ? (position + 1) : -1) as int;
    }

    copy(): SingleCharacterParser {
        return SingleCharacterParser.create(this.predicate, this.message);
    }
}

class AnySingleCharacterParser extends SingleCharacterParser {
    static override create(predicate: CharacterPredicate, message: string): AnySingleCharacterParser {
        if (!ConstantCharPredicate.any.isEqualTo(predicate)) {
            throw new StateError("AnySingleCharacterParser can only be created with predicate ConstantCharPredicate.any");
        }
        return new AnySingleCharacterParser(predicate, message);
    }

    constructor(predicate: CharacterPredicate, message: string) {
        super(predicate, message);
    }

    override parseOn(context: Context): Result<string> {
        const buffer = context.buffer;
        const position = context.position;
        if (position < buffer.length) {
            return context.success(buffer[position]!, (position + 1) as int);
        } else {
            return context.failure(this.message);
        }
    }

    override fastParseOn(buffer: string, position: int): int {
        return (position < buffer.length ? position + 1 : -1) as int;
    }
}

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