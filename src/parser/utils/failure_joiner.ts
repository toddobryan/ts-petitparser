import type { Failure } from "../../core/result";

export type { FailureJoiner };
export { selectFarthest, selectFarthestJoined, selectFirst, selectLast };

type FailureJoiner = (first: Failure, second: Failure) => Failure;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectFirst: FailureJoiner = (first: Failure, second: Failure): Failure => {
    return first;
}

const selectLast: FailureJoiner = (first: Failure, second: Failure): Failure => {
    return second;
}

const selectFarthest: FailureJoiner = (first: Failure, second: Failure): Failure => {
    return first.position <= second.position ? second : first;
}

const selectFarthestJoined: FailureJoiner = (first: Failure, second: Failure): Failure => {
    return first.position > second.position ? first :
        first.position < second.position ? second :
            first.failure(`${first.message} OR ${second.message}`);
}
