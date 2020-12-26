import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { createStore, applyMiddleware, compose } from "redux";
import { INITIAL_STATE, rootReducer } from "../reducers/rootReducer";
import thunk from "redux-thunk";

function customizer(
  ui,
  {
    initialState = INITIAL_STATE,
    store = createStore(rootReducer, INITIAL_STATE),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from "@testing-library/react";

export { customizer as render };
