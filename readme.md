# react-hook-store

## Install

```
$ npm install react-hook-store
```

## Store creation

```jsx
import { createStore } from 'react-hook-context'
type Store = { count: number }

// Store
export const [StoreProvider, store] = createStore < Store > { count: 0 }

// Reducer store
function reducer(state, action) {
  switch (action.type) {
    case 'INCREASE':
      return { ...state, count: (state.count += 1) }
    case 'DECREASE':
      return { ...state, count: (state.count -= 1) }
    default:
      return state
  }
}
export const [ReducerStoreProvider, reducerStore] =
  createStore <
  Store >
  ({
    count: 0
  },
  reducer)
```

## Example usage with reducer, map and inject

```jsx
import React from 'react'
import { injectStore, mapProps, StoreProps } from 'react-hook-context'
import { reducerStore, Store } from './stores'

type MapInType = StoreProps<Store>
type MapOutType = {
  count: number
  add: () => void
  remove: () => void
}

function _ExampleWithReducerInjectMap({ count, add, remove }: MapOutType) {
  return (
    <div>
      {count}
      <button onClick={remove}>-</button>
      <button onClick={add}>+</button>
    </div>
  )
}

export const ExampleWithReducerInjectMap = injectStore(reducerStore)(
  mapProps<MapInType, MapOutType>(mapper)(_ExampleWithReducerInjectMap)
)

function mapper({ state, updater }: MapInType) {
  return {
    count: state.count,
    add: () => updater({ type: 'INCREASE' }),
    remove: () => updater({ type: 'DECREASE' })
  }
}

```

## License

MIT
