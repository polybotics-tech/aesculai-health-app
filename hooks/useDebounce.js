export default function useDebounce(func, delay = 300) {
  let timer;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// This function creates a debounced version of the provided function `func`.
// The debounced function will delay the execution of `func` until after `delay` milliseconds have passed since the last time it was invoked.
// It is useful for optimizing performance by limiting the rate at which a function can be executed, such as in response to user input events like typing or scrolling.
