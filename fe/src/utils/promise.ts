import { Err, Ok, Result } from "./result";
Promise.prototype.toResult = async function <T>(): Promise<Result<T>> {
  return this.then((response: T) => Ok(response))
  .catch((error: Error) =>
    Err(error)
  );
};

export {};
