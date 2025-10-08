import type { int } from "../../common.js";
import type { Context } from "../../core/context.js";
import { Parser } from "../../core/parser.js";
import type { Result } from "../../core/result.js";

export { PositionParser, position };

const position = (): PositionParser => {
    return new PositionParser();
}

class PositionParser extends Parser<int> {
    constructor() {
        super();
    }

    override parseOn(context: Context): Result<int> {
        return context.success(context.position);
    }

    override fastParseOn(buffer: string, position: int | number): int {
        return position as int;
    }

    override copy(): PositionParser {
        return new PositionParser();
    }
}