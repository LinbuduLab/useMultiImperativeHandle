import React, { useRef, forwardRef, MutableRefObject, Ref } from 'react';
import useMultiImperativeHandle from './useMultiImperativeHandle';

export const SINGLE_LIST = ['穹心'];

export const LIST = ['林不渡', '穹心', '一茶'];

type IInnerFunc = () => string;

type IGlobalRef = {
  [key: string]: IInnerFunc;
};

const App: React.FC = () => {
  const globalRef = useRef() as MutableRefObject<IGlobalRef>;

  const invokeAllMountMethod = () => {
    const globalObject = globalRef?.current;
    for (const [, method] of Object.entries(globalObject)) {
      method();
    }
  };

  return (
    <>
      <button
        onClick={() => {
          invokeAllMountMethod();
        }}
      >
        INVOKE
      </button>
      {LIST.map((item, idx) => (
        <Item label={item} idx={idx} key={item} ref={globalRef} />
      ))}
    </>
  );
};

const Item: React.FC<{
  label: string;
  idx: number;
  ref: Ref<IGlobalRef>;
}> = forwardRef(({ label, idx }, ref) => {
  const innerMethod = () => {
    console.log(`${label}-${idx}`);
  };

  useMultiImperativeHandle(ref as MutableRefObject<IGlobalRef>, {
    [`method-from-${idx}`]: innerMethod,
  });

  return <p>{label}</p>;
});

export default App;
