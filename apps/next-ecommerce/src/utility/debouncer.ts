/*
    This function takes a callback function and a delay as input and returns a debounced function.
    The debounced function will only call the callback function after the delay has passed since the last call.
    If the debounced function is called again before the delay has passed, the timer is reset.
    This is useful when we want to limit the number of times API/function is called.

    Generic Type: 
        We define a generic type DebouncedFunction<F>. This type represents a function that can be debounced. 
        The generic parameter F represents the type of the function being debounced.
    Function Parameters: 
        We use the Parameters<F> utility type to infer the argument types of the function being debounced. 
        This ensures type safety when passing arguments to the debounced function.
    Return Type: 
        The return type of the debounce function is now DebouncedFunction<F>. 
        This guarantees that the returned function has the same argument types and return type as the original function.
*/

type DebouncedFunction<F extends (...args: any[]) => any> = (
  ...args: Parameters<F>
) => void;

const debouncer = <F extends (...args: any[]) => any>(
  callback: F,
  delay: number,
): DebouncedFunction<F> => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export default debouncer;
