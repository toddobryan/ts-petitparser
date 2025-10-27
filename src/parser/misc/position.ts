import type { int } from "../../common";
import type { Context, Result } from "../../core/context_result_and_errors";
import {ParserImpl} from "../../core/parserImpl";

export { PositionParser, position };

const position = (): PositionParser => {
    return new PositionParser();
}

class PositionParser extends ParserImpl<int> {
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