import { act, renderHook } from '@testing-library/react';
import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';
import { useStateDebounced } from '../useStateDebounced';

describe('useStateDebounced', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with undefined when no initial state is provided', () => {
    const { result } = renderHook(() => useStateDebounced(500));
    const [value, debouncedValue] = result.current;

    expect(value).toBeUndefined();
    expect(debouncedValue).toBeUndefined();
  });

  it('should initialize with the provided initial state', () => {
    const { result } = renderHook(() => useStateDebounced(500, 'initial'));
    const [value, debouncedValue] = result.current;

    expect(value).toBe('initial');
    expect(debouncedValue).toBe('initial');
  });

  it('should initialize with function-based initial state', () => {
    const initializer = vi.fn(() => 'lazy-initial');
    const { result } = renderHook(() => useStateDebounced(500, initializer));
    const [value, debouncedValue] = result.current;

    expect(initializer).toHaveBeenCalledTimes(1);
    expect(value).toBe('lazy-initial');
    expect(debouncedValue).toBe('lazy-initial');
  });

  it('should update value immediately but debounce debouncedValue', () => {
    const { result } = renderHook(() => useStateDebounced(500, ''));

    act(() => {
      const [, , setValue] = result.current;
      setValue('new value');
    });

    const [value, debouncedValue] = result.current;
    expect(value).toBe('new value');
    expect(debouncedValue).toBe('');
  });

  it('should update debouncedValue after delay', () => {
    const { result } = renderHook(() => useStateDebounced(500, ''));

    act(() => {
      const [, , setValue] = result.current;
      setValue('new value');
    });

    expect(result.current[1]).toBe('');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current[1]).toBe('new value');
  });

  it('should cancel previous debounce when value changes rapidly', () => {
    const { result } = renderHook(() => useStateDebounced(500, ''));

    act(() => {
      const [, , setValue] = result.current;
      setValue('first');
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    act(() => {
      const [, , setValue] = result.current;
      setValue('second');
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current[1]).toBe('');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current[1]).toBe('second');
  });

  it('should handle multiple rapid changes correctly', () => {
    const { result } = renderHook(() => useStateDebounced(500, 0));

    act(() => {
      const [, , setValue] = result.current;
      setValue(1);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      const [, , setValue] = result.current;
      setValue(2);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      const [, , setValue] = result.current;
      setValue(3);
    });

    expect(result.current[0]).toBe(3);
    expect(result.current[1]).toBe(0);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current[1]).toBe(3);
  });

  it('should update when delay changes', () => {
    const { result, rerender } = renderHook(
      ({ delay }) => useStateDebounced(delay, ''),
      { initialProps: { delay: 500 } },
    );

    act(() => {
      const [, , setValue] = result.current;
      setValue('test');
    });

    rerender({ delay: 1000 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current[1]).toBe('');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current[1]).toBe('test');
  });

  it('should work with object values', () => {
    const { result } = renderHook(() => useStateDebounced(500, { count: 0 }));

    act(() => {
      const [, , setValue] = result.current;
      setValue({ count: 1 });
    });

    expect(result.current[0]).toEqual({ count: 1 });
    expect(result.current[1]).toEqual({ count: 0 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current[1]).toEqual({ count: 1 });
  });

  it('should work with function updater', () => {
    const { result } = renderHook(() => useStateDebounced(500, 0));

    act(() => {
      const [, , setValue] = result.current;
      setValue((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(result.current[1]).toBe(0);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current[1]).toBe(1);
  });
});
