type Listener = (state: any) => void;

interface Store<T> {
  getState: () => T;
  setStateSync: (newState: Partial<T> | ((state: T) => Partial<T>)) => void;
  setStateAsync: (
    newState:
      | Partial<T>
      | ((state: T) => Partial<T>)
      | Promise<Partial<T>>
      | Promise<Partial<T>>[],
    isAsync?: boolean
  ) => Promise<void>;
  subscribe: (listener: Listener) => () => void;
}

interface StoreOptions<T> {
  initialState: T;
  storageKey?: string;
  storageType?: "localStorage" | "sessionStorage";
  whitelist?: string[];
  blacklist?: string[];
}

class EasyStore<T extends object> implements Store<T> {
  private state: T; // Current state
  private listeners: Listener[]; // List of listeners
  private storageKey: string; // Key used to store state
  private storage: Storage; // Storage object (localStorage or sessionStorage)
  private whitelist: Set<string>; // White list: fields to persist
  private blacklist: Set<string>; // Blacklist: fields not to persist

  /**
   * Constructor to initialize state and configure storage options, white/blacklists.
   * @param options - The configuration options for the store.
   * @param options.initialState - The initial state of the store.
   * @param options.storageKey - The key used to store state in storage. Default is 'easyStoreState'.
   * @param options.storageType - The type of storage, either 'localStorage' or 'sessionStorage'. Default is 'localStorage'.
   * @param options.whitelist - A list of keys to persist in storage. Default is an empty array.
   * @param options.blacklist - A list of keys not to persist in storage. Default is an empty array.
   */
  constructor({
    initialState,
    storageKey = "easyStoreState",
    storageType = "localStorage",
    whitelist = [],
    blacklist = [],
  }: StoreOptions<T>) {
    this.storage =
      storageType === "localStorage" ? localStorage : sessionStorage;
    this.storageKey = storageKey;

    // Get persisted state from storage, or use the provided initialState if not found
    const persistedState = this.storage.getItem(storageKey);
    this.state = persistedState ? JSON.parse(persistedState) : initialState;

    // Initialize listeners, whitelist, and blacklist
    this.listeners = [];
    this.whitelist = new Set(whitelist);
    this.blacklist = new Set(blacklist);
  }

  /**
   * Get the current state of the store.
   * @returns The current state of the store.
   */
  getState(): T {
    return this.state;
  }

  /**
   * Synchronously update the store's state.
   * This method directly modifies the state with the given newState.
   * @param newState - The new state to set, or a function that returns a new state based on the current state.
   * @returns void
   */
  setStateSync(newState: Partial<T> | ((state: T) => Partial<T>)): void {
    try {
      // If newState is a function, call it to get the new state
      if (newState instanceof Function) {
        this.state = this.deepFreeze({
          ...this.state,
          ...newState(this.state),
        });
      } else {
        this.state = this.deepFreeze({ ...this.state, ...newState });
      }
      this.notifyListeners(); // Notify listeners about state change
      this.persistState(); // Persist the updated state to storage
    } catch (error) {
      console.error("Error updating state:", error); // Error handling
    }
  }

  /**
   * Asynchronously update the store's state.
   * This method handles both individual and array of asynchronous state updates.
   * @param newState - The new state to set, which can be a Promise, a function, or an object.
   * @param isAsync - A flag indicating whether the operation is asynchronous.
   * @returns void
   */
  async setStateAsync(
    newState:
      | Partial<T>
      | ((state: T) => Partial<T>)
      | Promise<Partial<T>>
      | Promise<Partial<T>>[],
    isAsync: boolean = false
  ): Promise<void> {
    if (isAsync) {
      try {
        if (Array.isArray(newState)) {
          const results = await Promise.all(
            newState.map(async (state) => {
              if (state instanceof Function) {
                return await state(this.state); // Handle asynchronous function
              } else if (state instanceof Promise) {
                return await state; // Handle direct asynchronous values
              } else {
                return state; // Handle synchronous values
              }
            })
          );
          // Merge results from all asynchronous operations into one state object
          const mergedState = results.reduce(
            (acc, result) => ({ ...acc, ...result }),
            this.state
          );
          this.state = this.deepFreeze(mergedState);
        } else {
          if (newState instanceof Function) {
            const result = await newState(this.state);
            this.state = this.deepFreeze({ ...this.state, ...result });
          } else if (newState instanceof Promise) {
            const result = await newState;
            this.state = this.deepFreeze({ ...this.state, ...result });
          } else {
            this.state = this.deepFreeze({ ...this.state, ...newState });
          }
        }
        this.notifyListeners(); // Notify listeners about state change
        this.persistState(); // Persist the updated state to storage
      } catch (error) {
        console.error("Error updating state:", error); // Error handling
      }
    } else {
      console.error("This is not an Async function"); // Error handling
    }
  }

  /**
   * Subscribe to state changes.
   * This method allows listeners to be notified whenever the state is updated.
   * @param listener - A callback function to be called when the state changes.
   * @returns A function to unsubscribe the listener.
   */
  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener); // Unsubscribe by removing the listener
    };
  }

  /**
   * Notify all subscribers about the state change.
   * This method calls all registered listeners with the updated state.
   * @returns void
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * Persist the current state to storage (localStorage or sessionStorage).
   * This method serializes the state and saves it to the selected storage.
   * @returns void
   */
  private persistState(): void {
    const stateToPersist: T = { ...this.state };

    // Remove blacklisted fields
    Object.keys(stateToPersist).forEach((key) => {
      if (this.blacklist.has(key)) {
        delete stateToPersist[key as keyof T]; // Explicitly type the key
      }
    });

    // If in whitelist mode, only store whitelisted fields
    if (this.whitelist.size > 0) {
      Object.keys(stateToPersist).forEach((key) => {
        if (!this.whitelist.has(key)) {
          delete stateToPersist[key as keyof T]; // Explicitly type the key
        }
      });
    }

    this.storage.setItem(this.storageKey, JSON.stringify(stateToPersist)); // Persist to storage
  }

  /**
   * Deeply freezes the state object to ensure immutability.
   * This method recursively freezes all objects inside the state.
   * @param obj - The object to freeze.
   * @returns The frozen object.
   */
  private deepFreeze<T extends object>(obj: T): T {
    Object.freeze(obj); // Freeze the top-level object
    Object.keys(obj).forEach((key) => {
      const value = (obj as { [key: string]: any })[key]; // Explicitly type the key
      if (value && typeof value === "object" && !Object.isFrozen(value)) {
        this.deepFreeze(value); // Recursively freeze nested objects
      }
    });
    return obj;
  }
}

export default EasyStore;
