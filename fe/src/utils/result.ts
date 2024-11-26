declare global {
  type Result<T=any> = [T,null] | [null, Error];
  interface Promise<T> {
    /**
     * Wraps the current Promise in a Result type.
     * This method transforms the Promise into a Result, allowing for easier error handling
     * and management of success states.
     *
     * @returns {Result<T>} - A Result representing the success or failure of the Promise.
     */
    toResult(): Promise<Result<T>>;
  }
}


export type Result<T=any> = [T, null] | [null, Error];
export const Ok = <T>(value: T): Result<T> => [value, null];
export const Err = (error: Error): Result => [null, error];

