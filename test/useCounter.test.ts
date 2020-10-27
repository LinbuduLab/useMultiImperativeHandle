import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from '../src/hooks/useCounter';

describe('useCounter Hooks', () => {
  it('should render initialize correctly', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
    expect(typeof result.current.increment).toBe('function');
  });

  it('should render work correctly', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
