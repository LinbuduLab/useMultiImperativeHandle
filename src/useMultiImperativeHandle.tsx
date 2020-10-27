import { useImperativeHandle, MutableRefObject, DependencyList } from 'react';

const useMultiImperativeHandle = <T, K extends object>(
  originRef: MutableRefObject<T>,
  convertRefObj: K,
  deps?: DependencyList
): void =>
  useImperativeHandle(
    originRef,
    () => {
      return {
        ...originRef.current,
        ...convertRefObj,
      };
    },
    deps
  );

export default useMultiImperativeHandle;
