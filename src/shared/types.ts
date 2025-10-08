export type { Callback, Predicate, VoidCallback };

/**
 * A generic callback function type returning a value of type [R] for a given
 * input of type [T].
 */
type Callback<T, R> = (value: T) => R;

/**
 * A generic predicate function type returning `true` or `false` for a given
 * input of type [T].
 */
type Predicate<T> = Callback<T, boolean>;

/**
 * A generic void callback with an argument of type [T], but no return value.
 */
type VoidCallback<T> = Callback<T, void>;
