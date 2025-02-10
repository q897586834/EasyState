// 引入 node-localstorage 来模拟浏览器的 localStorage 和 sessionStorage
const { LocalStorage } = require('node-localstorage');
global.localStorage = new LocalStorage('./scratch');
global.sessionStorage = new LocalStorage('./scratch-session');
// 引入 EasyStore 类
const EasyStore = require('./EasyStore');
// 定义初始状态
const initialState = {
    counter: 0,
    message: 'Hello, World!'
};
// 创建 EasyStore 实例
const store = new EasyStore({
    initialState,
    storageKey: 'myStoreState',
    storageType: 'localStorage',
    whitelist: ['counter'],
    blacklist: []
});
// 订阅状态变化
const unsubscribe = store.subscribe((state) => {
    console.log('State has changed:', state);
});
// 同步更新状态
console.log('Initial state:', store.getState());
store.setStateSync({ counter: 1 });
console.log('State after synchronous update:', store.getState());
// 异步更新状态
const asyncUpdate = new Promise((resolve) => {
    setTimeout(() => {
        resolve({ message: 'New message after async update' });
    }, 1000);
});
store.setStateAsync(asyncUpdate, true).then(() => {
    console.log('State after asynchronous update:', store.getState());
    // 取消订阅
    unsubscribe();
});