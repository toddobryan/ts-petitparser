import type { int } from "../../common";
import type { Context } from "../../core/context";
import { Parser } from "../../core/parser";
import type { Result } from "../../core/result";

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