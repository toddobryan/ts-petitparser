import { type int } from "../common.js";
import { Failure } from "./result.js";

export { NotImplementedError, ParserError, StateError, UnsupportedError };

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
