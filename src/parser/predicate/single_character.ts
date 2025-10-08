import { type int } from "../../common.js";
import { Context } from "../../core/context.js";
import { StateError } from "../../core/errors.js";
import { Result } from "../../core/result.js";
import { CharacterPredicate } from "../character/predicate.js";
import { ConstantCharPredicate } from "../character/predicate/constant.js";
import { CharacterParser } from "./character.js";

export { SingleCharacterParser };

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