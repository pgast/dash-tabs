import React, { useReducer, createContext } from "react";

const initialState = { view: "orders" };

function reducer (state, action) { return { ...state, view: action.payload } };

export function StoreProvider (props) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }
  return <Store.Provider value={value}>{props.children}</Store.Provider>
}

export const Store = createContext();