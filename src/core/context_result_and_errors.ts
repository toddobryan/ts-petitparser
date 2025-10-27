import { type int } from "../common";
import { Token } from "./token";

export { Context, Result, Success, Failure,
    NotImplementedError, ParserError, StateError, UnsupportedError };

class Context {
    readonly buffer: string;
    readonly position: int;

    constructor(buffer: string, position: int) {
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

    toString(): string {
        return `${this.constructor.name}[{this.toPositionString()}]`;
    }
}

abstract class Result<T> extends Context {
    protected constructor(buffer: string, position: int) {
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

class ParserError extends Error {
    failure: Failure;
    offset: int;
    source: string;

    constructor(failure: Failure) {
        super(failure.message);
        this.failure = failure;
        this.offset = failure.position;
        this.source = failure.buffer;
        this.name = "ParserException";
    }

    override toString(): string {
        return `${this.constructor.name}[${this.failure.toPositionString()}]: ${this.message}`;
    }
}

class NotImplementedError extends Error {
    constructor(message = "This method or feature is not yet implemented.") {
        super(message);
        this.name = "NotImplementedError";
    }
}

class StateError extends Error {
    constructor(message = "The program has reached an illegal state.") {
        super(message);
        this.name = "StateError";
    }
}

class UnsupportedError extends Error {
    constructor(message = "This operation is not supported.") {
        super(message);
        this.name = "UnsupportedError";
    }
}
