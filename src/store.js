import React, { useReducer, createContext } from "react";

const initialState = { view: "orders", sideboardOpen: false };

function reducer (state, action) { 
  switch(action.type) {
    case 'TOGGLE_VIEW': 
      return { ...state, view: action.payload };
    case 'TOGGLE_SIDEBOARD':
      return { ...state, sideboardOpen: action.payload };
    default:
      return { ...state };
  }
};

export function StoreProvider (props) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }
  return <Store.Provider value={value}>{props.children}</Store.Provider>
}

export const Store = createContext();