import * as actions from "../../helpers/actionCreators";
import configureMockStore from "redux-mock-store";
import moxios from "moxios";
import thunk from "redux-thunk";
import { INITIAL_STATE, rootReducer } from "../../reducers/rootReducer";
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
describe("async actions", () => {
  window.alert = jest.fn();
  let store;
  beforeEach(() => {
    moxios.install();
    store = mockStore(INITIAL_STATE);
  });
  afterEach(() => {
    moxios.uninstall();
  });

  it("creates a token once login is successful", () => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: { token: "aksdiufiokwnkdfaksoulas" },
      });
    });
    const expectedActions = [
      { type: "SET_BASE_TOKEN", token: "aksdiufiokwnkdfaksoulas" },
    ];

    return store.dispatch(actions.login()).then(() => {
      // return of async actions
      const actualAction = store.getActions();
      expect(actualAction).toEqual(expectedActions);
    });
  });

  it("clears all state once a profile is deleted", () => {
    window.alert.mockClear();
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: { msg: "Account has been deleted" },
      });
    });
    const expectedActions = [{ type: "FULL_RESET" }];
    return store.dispatch(actions.deleteProfile()).then(() => {
      // return of async actions
      const actualAction = store.getActions();
      expect(actualAction).toEqual(expectedActions);
    });
  });
  it("sets trend transactions", () => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [
          { id: 1, amount: 1.0 },
          { id: 2, amount: 2.0 },
        ],
      });
    });
    const expectedActions = [
      {
        type: "SET_TRENDS",
        trendTransactions: [
          { id: 1, amount: 1.0 },
          { id: 2, amount: 2.0 },
        ],
      },
    ];

    return store.dispatch(actions.setTrends()).then(() => {
      // return of async actions
      const actualAction = store.getActions();
      expect(actualAction).toEqual(expectedActions);
    });
  });
  it("adds account to state", () => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          accounts: [
            { id: 1, account_number: 1 },
            { id: 2, account_number: 2 },
          ],
        },
      });
    });
    const expectedActions = [
      {
        type: "GET_ACCOUNTS",
        accounts: [
          { id: 1, account_number: 1 },
          { id: 2, account_number: 2 },
        ],
      },
    ];
    return store
      .dispatch(actions.getAccounts(undefined, undefined, false))
      .then(() => {
        // return of async actions
        const actualAction = store.getActions();
        expect(actualAction).toEqual(expectedActions);
      });
  });
  it("adds transactions to state", () => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          transactions: [
            { id: 1, amount: 1 },
            { id: 2, amount: 2 },
          ],
          account_id: "abc123",
          categories: ["travel", "food"],
        },
      });
    });
    const expectedActions = [
      {
        type: "SET_ACCOUNT_TRANSACTIONS",
        accountTransactions: [
          { id: 1, amount: 1 },
          { id: 2, amount: 2 },
        ],
      },
      { type: "SET_CATEGORIES", categories: ["travel", "food"] },
    ];
    return store.dispatch(actions.getTransactions()).then(() => {
      // return of async actions
      const actualAction = store.getActions();
      expect(actualAction).toEqual(expectedActions);
    });
  });
  it("creates the link_token", () => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: { link_token: "aksdiufiokwnkdfaksoulas" },
      });
    });
    const expectedActions = [
      { type: "SET_LINK_TOKEN", link_token: "aksdiufiokwnkdfaksoulas" },
    ];

    return store.dispatch(actions.getLinkToken()).then(() => {
      // return of async actions
      const actualAction = store.getActions();
      expect(actualAction).toEqual(expectedActions);
    });
  });
  it("creates the access_token, _token, and item_id", () => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          access_token: "aksdiufiokwnkdfaksoulas",
          _token: "aksdiufiokwnkdfaksoulas",
          item_id: "aksdiufiokwnkdfaksoulas",
        },
      });
    });
    const expectedActions = [
      {
        type: "SET_ACCESS_TOKEN",
        access_token: "aksdiufiokwnkdfaksoulas",
        _token: "aksdiufiokwnkdfaksoulas",
        item_id: "aksdiufiokwnkdfaksoulas",
        new_visitor: true,
        logged_in: true,
        accountTransactions: {},
      },
    ];

    return store.dispatch(actions.getAccessToken()).then(() => {
      // return of async actions
      const actualAction = store.getActions();
      expect(actualAction).toEqual(expectedActions);
    });
  });
});
