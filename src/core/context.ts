import { type int } from "../common.js";
import { Failure, Success } from "./result.js";
import { Token } from "./token.js";

export { Context };

class Context extends Object{
    readonly buffer: string;
    readonly position: int;

    constructor(buffer: string, position: int) {
        super()
        this.buffer = buffer;
        this.position = position;
    }

    success<T>(result: T, position?: int): Success<T> {
        return new Success<T>(this.buffer, position ?? this.position , result);
    }

    failure(message: string, position?: int): Failure {
        return new Failure(this.buffer, position ?? this.position, message);
    }

    toPositionString(): string {
        return Token.positionString(this.buffer, this.position);
    }

    override toString(): string {
        return `${this.constructor.name}[{this.toPositionString()}]`;
    }
}