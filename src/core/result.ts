import { type int } from "../common.js";
import { Context } from "./context.js";
import { NotImplementedError, ParserError, UnsupportedError } from "./errors.js";

export { Result, Success, Failure };

abstract class Result<T> extends Context {
    constructor(buffer: string, position: int) {
        super(buffer, position);
    }

    get value(): T {
        throw new NotImplementedError();
    };
    
    get message(): string {
        throw new NotImplementedError();
    }
}

class Success<T> extends Result<T> {
    readonly _value: T

    constructor(buffer: string, position: int, value: T) {
        super(buffer, position);
        this._value = value;
    }

    override get value(): T {
        return this._value;
    }


    override get message(): string {
        throw new UnsupportedError("Successful parse results do not have a message.");
    }

    override toString(): string {
        return `${super.toString()}: ${this.value}`;
    }
}

class Failure extends Result<never> {
    readonly _message: string

    constructor(buffer: string, position: int, message: string) {
        super(buffer, position);
        this._message = message;
    }

    override get message(): string {
        return this._message;
    }

    override get value(): never { 
        throw new ParserError(this)
    }

    override toString(): string {
        return `${super.toString()}: ${this.message}`;
    }
}
