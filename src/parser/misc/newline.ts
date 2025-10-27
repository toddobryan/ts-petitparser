import { type int } from "../../common";
import { Context, Result } from "../../core/context_result_and_errors";
import { Parser } from "../../core/parser";
import {ParserImpl} from "../../core/parserImpl";

export { NewlineParser, newline };

const newline = (message = "newline expected"): Parser<string> => new NewlineParser(message);

class NewlineParser extends ParserImpl<string> {
    readonly message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }

    parseOn(context: Context): Result<string> {
        const buffer = context.buffer;
        const position = context.position;
        if (position < buffer.length) {
            const char = buffer.charAt(position);
            if (char === "\n") {
                return context.success(char, (position + 1) as int);
            } else if (char === "\r") {
                if (position + 1 < buffer.length && buffer.charAt(position + 1) === "\n") {
                    return context.success("\r\n", (position + 2) as int);
                } else {
                    return context.success(char, (position + 1) as int);
                }
            }
        }
        return context.failure(this.message);
    }
    
    override fastParseOn(buffer: string, position: int): int {
        if (position < buffer.length) {
            const char = buffer.charAt(position);
            if (char === "\n") {
                return position + 1 as int;
            } else if (char === "\r") {
                return position + 1 < buffer.length && buffer.charAt(position + 1) === "\n" ?
                    position + 2 as int :
                    position + 1 as int;
            }
        }
        return -1 as int;
    }

    override toString(): string {
        return `${super.toString()}[${this.message}]`;
    }

    override copy(): NewlineParser {
        return new NewlineParser(this.message);
    }
}
