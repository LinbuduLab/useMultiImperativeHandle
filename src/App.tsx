import React, {
  useState,
  useRef,
  forwardRef,
  MutableRefObject,
  Ref,
} from 'react';
import useMultiImperativeHandle from './useMultiImperativeHandle';

export const SINGLE_LIST = ['穹心'];
export const LIST = ['林不渡', '穹心', '一茶'];

export type IInnerFunc = () => string;
export type IGlobalRef = {
  [key: string]: IInnerFunc;
};

const App: React.FC = () => {
  const globalRef = useRef() as MutableRefObject<IGlobalRef>;
  const [val, setVal] = useState<string[]>([]);

  const invokeAllMountMethod = () => {
    const globalObject = globalRef?.current;
    for (const [, method] of Object.entries(globalObject)) {
      const returnValue = method();
      setVal((v) => [...v, returnValue]);
    }
  };

  return (
    <>
      <div
        style={{
          border: '3px steelblue solid',
          width: '300px',
          minHeight: '450px',
          textAlign: 'center',
          margin: '0 auto',
        }}
      >
        <p>Val From Items:</p>
        {val.length ? (
          val.map((val) => <p key={val}>{val}</p>)
        ) : (
          <b
            style={{
              display: 'inline-block',
              marginBottom: '30px',
            }}
          >
            EMPTY
          </b>
        )}
        {LIST.map((item, idx) => (
          <Item label={item} idx={idx} key={item} ref={globalRef} />
        ))}

        <button
          onClick={() => {
            invokeAllMountMethod();
          }}
        >
          INVOKE
        </button>
      </div>
    </>
  );
};

interface IItem {
  label: string;
  idx: number;
  ref: Ref<IGlobalRef>;
}

const Item: React.FC<IItem> = forwardRef(({ label, idx }, ref) => {
  const innerMethod = () => `${label}-${idx}`;

  useMultiImperativeHandle(ref as MutableRefObject<IGlobalRef>, {
    [`method-from-${idx}`]: innerMethod,
  });

  return <p style={{ fontSize: '18px' }}>{label}</p>;
});

export default App;
