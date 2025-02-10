"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class EasyStore {
    /**
     * Constructor to initialize state and configure storage options, white/blacklists.
     * @param options - The configuration options for the store.
     * @param options.initialState - The initial state of the store.
     * @param options.storageKey - The key used to store state in storage. Default is 'easyStoreState'.
     * @param options.storageType - The type of storage, either 'localStorage' or 'sessionStorage'. Default is 'localStorage'.
     * @param options.whitelist - A list of keys to persist in storage. Default is an empty array.
     * @param options.blacklist - A list of keys not to persist in storage. Default is an empty array.
     */
    constructor({ initialState, storageKey = "easyStoreState", storageType = "localStorage", whitelist = [], blacklist = [], }) {
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
    getState() {
        return this.state;
    }
    /**
     * Synchronously update the store's state.
     * This method directly modifies the state with the given newState.
     * @param newState - The new state to set, or a function that returns a new state based on the current state.
     * @returns void
     */
    setStateSync(newState) {
        try {
            // If newState is a function, call it to get the new state
            if (newState instanceof Function) {
                this.state = this.deepFreeze(Object.assign(Object.assign({}, this.state), newState(this.state)));
            }
            else {
                this.state = this.deepFreeze(Object.assign(Object.assign({}, this.state), newState));
            }
            this.notifyListeners(); // Notify listeners about state change
            this.persistState(); // Persist the updated state to storage
        }
        catch (error) {
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
    setStateAsync(newState_1) {
        return __awaiter(this, arguments, void 0, function* (newState, isAsync = false) {
            if (isAsync) {
                try {
                    if (Array.isArray(newState)) {
                        const results = yield Promise.all(newState.map((state) => __awaiter(this, void 0, void 0, function* () {
                            if (state instanceof Function) {
                                return yield state(this.state); // Handle asynchronous function
                            }
                            else if (state instanceof Promise) {
                                return yield state; // Handle direct asynchronous values
                            }
                            else {
                                return state; // Handle synchronous values
                            }
                        })));
                        // Merge results from all asynchronous operations into one state object
                        const mergedState = results.reduce((acc, result) => (Object.assign(Object.assign({}, acc), result)), this.state);
                        this.state = this.deepFreeze(mergedState);
                    }
                    else {
                        if (newState instanceof Function) {
                            const result = yield newState(this.state);
                            this.state = this.deepFreeze(Object.assign(Object.assign({}, this.state), result));
                        }
                        else if (newState instanceof Promise) {
                            const result = yield newState;
                            this.state = this.deepFreeze(Object.assign(Object.assign({}, this.state), result));
                        }
                        else {
                            this.state = this.deepFreeze(Object.assign(Object.assign({}, this.state), newState));
                        }
                    }
                    this.notifyListeners(); // Notify listeners about state change
                    this.persistState(); // Persist the updated state to storage
                }
                catch (error) {
                    console.error("Error updating state:", error); // Error handling
                }
            }
            else {
                console.error("This is not an Async function"); // Error handling
            }
        });
    }
    /**
     * Subscribe to state changes.
     * This method allows listeners to be notified whenever the state is updated.
     * @param listener - A callback function to be called when the state changes.
     * @returns A function to unsubscribe the listener.
     */
    subscribe(listener) {
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
    notifyListeners() {
        this.listeners.forEach((listener) => listener(this.state));
    }
    /**
     * Persist the current state to storage (localStorage or sessionStorage).
     * This method serializes the state and saves it to the selected storage.
     * @returns void
     */
    persistState() {
        const stateToPersist = Object.assign({}, this.state);
        // Remove blacklisted fields
        Object.keys(stateToPersist).forEach((key) => {
            if (this.blacklist.has(key)) {
                delete stateToPersist[key]; // Explicitly type the key
            }
        });
        // If in whitelist mode, only store whitelisted fields
        if (this.whitelist.size > 0) {
            Object.keys(stateToPersist).forEach((key) => {
                if (!this.whitelist.has(key)) {
                    delete stateToPersist[key]; // Explicitly type the key
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
    deepFreeze(obj) {
        Object.freeze(obj); // Freeze the top-level object
        Object.keys(obj).forEach((key) => {
            const value = obj[key]; // Explicitly type the key
            if (value && typeof value === "object" && !Object.isFrozen(value)) {
                this.deepFreeze(value); // Recursively freeze nested objects
            }
        });
        return obj;
    }
}
exports.default = EasyStore;
