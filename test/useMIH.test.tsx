import React, { useRef, forwardRef, MutableRefObject, Ref } from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import useMultiImperativeHandle from '../src/useMultiImperativeHandle';
import { SINGLE_LIST, LIST } from '../src/App';

Enzyme.configure({ adapter: new Adapter() });

type IInnerFunc = (key: string) => string;

type IGlobalRef = {
  [key: string]: IInnerFunc;
};

const App: React.FC<{ list: string[]; mockFunc: Function }> = ({
  list,
  mockFunc,
}) => {
  const globalRef = useRef() as MutableRefObject<IGlobalRef>;

  const invokeAllMountMethod = () => {
    const globalObject = globalRef?.current;
    for (const [key, method] of Object.entries(globalObject)) {
      method(key);
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
      {list.map((item, idx) => (
        <Item
          label={item}
          idx={idx}
          key={item}
          ref={globalRef}
          funcToInvoke={mockFunc}
        />
      ))}
    </>
  );
};

const Item: React.FC<{
  label: string;
  idx: number;
  ref: Ref<any>;
  funcToInvoke?: Function;
}> = forwardRef(({ label, idx, funcToInvoke }, ref) => {
  const innerMethod = funcToInvoke ?? ((key: string) => `${label}-${idx}`);

  useMultiImperativeHandle(ref as MutableRefObject<any>, {
    [`method-from-${idx}`]: innerMethod,
  });

  return <p>{label}</p>;
});

describe('useMultiImperativeHandle', () => {
  it('should work as useImperativeHandle when no convertion', () => {
    const invokeTracker = jest.fn();
    const Wrapper = mount(<App list={SINGLE_LIST} mockFunc={invokeTracker} />);

    expect(Wrapper.find(Item).length).toBe(1);

    Wrapper.find('button').simulate('click');

    expect(invokeTracker).toBeCalledTimes(1);
    expect(invokeTracker).toBeCalledWith(`method-from-0`);
  });

  it('should work as useImperativeHandle when no convertion', () => {
    const invokeTracker = jest.fn();
    const Wrapper = mount(<App list={LIST} mockFunc={invokeTracker} />);

    expect(Wrapper.find(Item).length).toBe(3);

    Wrapper.find('button').simulate('click');

    expect(invokeTracker).toBeCalledTimes(3);
    expect(invokeTracker.mock.calls[0][0]).toBe('method-from-0');
    expect(invokeTracker.mock.calls[1][0]).toBe('method-from-1');
    expect(invokeTracker.mock.calls[2][0]).toBe('method-from-2');
  });
});
