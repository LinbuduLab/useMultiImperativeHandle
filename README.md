# useMultiImperativeHandle

[![GitHub license](https://img.shields.io/github/license/linbudu599/useMultiImperativeHandle)](https://github.com/linbudu599/useMultiImperativeHandle/blob/master/LICENSE)
![Codecov](https://img.shields.io/codecov/c/github/Penumbra/useMultiImperativeHandle)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/linbudu599/useMultiImperativeHandle/useMIH%20CI)
![David](https://img.shields.io/david/dev/linbudu599/useMultiImperativeHandle?color=green&label=dependencies)


Enhanced `useImperativeHandle` on **Converting Objects Mount On Refs**:

## Usage

```tsx
useMultiImperativeHandle(ref, {
  [`${specialMountKey}`]: specialMountValue,
});
```

## [Example](./src/app.tsx)

```tsx
// App.tsx
const App: React.FC<{ list?: string[] }> = ({ list = LIST }) => {
  const globalRef = useRef(null) as MutableRefObject<IGlobalRef>;

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
      {list.map((item, idx) => (
        <Item label={item} idx={idx} key={item} ref={globalRef} />
      ))}
    </>
  );
};

const Item: React.FC<{
  label: string;
  idx: number;
  ref;
}> = forwardRef(({ label, idx }, ref) => {
  const innerMethod = () => {
    console.log(`${label}-${idx}`);
  };

  useImperativeHandle(ref, () => ({
    [`method-from-${idx}`]: innerMethod,
  }));

  return <p>{label}</p>;
});
```

At this example, we try to mount methods from a group of list item to a single ref `GlobalRef`,
even we specify different key(`[method-from-${idx}]`) for each mount behaviour.

> Use `npm run dev` and click the button to see result in console.

So we need `useMultiImperativeHandle` to enable convert objects.

Change `<Item />` like below:

```tsx
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
```

Now we can use `globalRef` to get all methods provided by `Child Component`.

## Source

> There remain some problems on type definition.

```tsx
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
```

Yep, it's just as simple as code above.
