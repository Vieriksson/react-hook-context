import React, { createElement, useContext, useReducer, useState } from 'react'
type ActionType = { type: string; payload?: any }
type ProviderType = (children: any) => JSX.Element
type Updater<T> = React.Dispatch<T | ((prevState: T) => T) | ActionType>
type StoreType<T> = [T, Updater<T>]
type StoreCreatorType<T> = () => StoreType<T>
export type StoreProps<T> = { state: T; updater: Updater<T> }

export function createStore<T>(
  initValue: T,
  reducer?: (store: T, action: ActionType) => T
): [ProviderType, StoreCreatorType<T>] {
  const context = React.createContext({} as any)

  const store = () => useContext<StoreType<T>>(context)
  const Provider = ({ children }) => {
    let state: T
    let updater

    if (reducer) {
      ;[state, updater] = useReducer<T, ActionType>(reducer, initValue)
    } else {
      ;[state, updater] = useState<T>(initValue)
    }

    return createElement(
      context.Provider,
      { value: [state, updater as Updater<T>] },
      children
    )
  }

  return [Provider, store]
}

export function injectStore<T>(store: StoreCreatorType<T>) {
  return (Component: (props: StoreProps<T> & any) => JSX.Element) => (
    props: StoreProps<T> & any
  ) => {
    const [state, updater] = store()
    return createElement(Component, { ...props, state, updater })
  }
}

export function mapProps<P, R>(map: (props: P) => R) {
  return (Component: ((props: R) => JSX.Element)) => (props: P) => {
    return createElement(Component, map(props))
  }
}
