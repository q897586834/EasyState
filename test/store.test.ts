import EasyStore from "../src/store";

interface State {
  count: number;
  name?: string;
}

let store: EasyStore<State>;
let listener: jest.Mock;

beforeEach(() => {
  store = new EasyStore<State>({ initialState: { count: 0 } });
  listener = jest.fn();
});

describe("EasyStore Tests", () => {
  test("should initialize with the correct initial state", () => {
    expect(store.getState().count).toBe(0);
  });

  test("should update state synchronously with setStateSync", () => {
    store.setStateSync({ count: 1 });
    expect(store.getState().count).toBe(1);
  });

  test("should subscribe to state changes and trigger listener", () => {
    store.subscribe(listener);
    store.setStateSync({ count: 1 });
    expect(listener).toHaveBeenCalledWith({ count: 1 });
  });

  test("should unsubscribe from state changes", () => {
    const unsubscribe = store.subscribe(listener);
    store.setStateSync({ count: 1 });
    expect(listener).toHaveBeenCalledWith({ count: 1 });

    unsubscribe();
    store.setStateSync({ count: 2 });
    expect(listener).toHaveBeenCalledTimes(1); 
  });

  test("should persist state to localStorage (mocked)", () => {
    const setItemSpy = jest
      .spyOn(localStorage, "setItem")
      .mockImplementation(() => {});
    store.setStateSync({ count: 3 });

    expect(setItemSpy).toHaveBeenCalledWith(
      "easyStoreState",
      JSON.stringify({ count: 3 })
    );

    setItemSpy.mockRestore();
  });

  test("should handle whitelist and blacklist during persistence", () => {
    const storeWithWhitelist = new EasyStore<State>({
      initialState: { count: 1, name: "Test" },
      whitelist: ["count"],
    });
    const setItemSpy = jest
      .spyOn(localStorage, "setItem")
      .mockImplementation(() => {});

    storeWithWhitelist.setStateSync({ count: 2, name: "Updated" });

    expect(setItemSpy).toHaveBeenCalledWith(
      "easyStoreState",
      JSON.stringify({ count: 2 })
    );

    setItemSpy.mockRestore();
  });

  test("should handle blacklist during persistence", () => {
    const storeWithBlacklist = new EasyStore<State>({
      initialState: { count: 1, name: "Test" },
      blacklist: ["name"],
    });
    const setItemSpy = jest
      .spyOn(localStorage, "setItem")
      .mockImplementation(() => {});

    storeWithBlacklist.setStateSync({ count: 2, name: "Updated" });

    expect(setItemSpy).toHaveBeenCalledWith(
      "easyStoreState",
      JSON.stringify({ count: 2 }) 
    );

    setItemSpy.mockRestore();
  });
});
