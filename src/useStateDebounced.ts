import {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';

type ReturnType<S> = [S, S, Dispatch<SetStateAction<S>>];

// Typescript function overloading with and without 'initialState'
export function useStateDebounced<S>(delay: number, initialState: S | (() => S)): ReturnType<S>;
export function useStateDebounced<S = undefined>(delay: number): ReturnType<S | undefined>;

// Like useState but debounced. This hook allows you to debounce any fast changing value. The debounced
// value will only reflect the latest value when the setValue has not been called for the specified time period.
export function useStateDebounced<S>(delay: number, initialState?: S | (() => S)): ReturnType<S | undefined> {
  const [value, setValue] = useState(initialState);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return [value, debouncedValue, setValue];
}
