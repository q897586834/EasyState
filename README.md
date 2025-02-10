# @sakura_fty/easystore

`@sakura_fty/easystore` 是一个轻量级的状态管理库，旨在简化 React 等前端框架中的状态管理，提供简单、可扩展且高效的 API。它不像 Redux 那样复杂，而是注重易用性和灵活性，非常适合中小型项目或希望减少状态管理复杂性的开发者。

## 功能介绍

- **简洁易用**：API 设计简单，支持同步和异步状态更新。
- **内置持久化支持**：通过 `localStorage` 或 `sessionStorage` 持久化存储状态，避免数据丢失。
- **支持白名单和黑名单机制**：可以选择性地持久化状态中的部分字段。
- **监听状态变化**：支持订阅状态变化，提供高效的状态变更通知机制。
- **支持异步操作**：通过 `setStateAsync` 支持异步更新状态，处理并发和异步逻辑。

## 特性

- **轻量级**：相较于 Redux，`EasyStore` 的 API 更简单，配置和学习成本低。
- **灵活的存储选项**：支持 `localStorage` 和 `sessionStorage`，也可以自定义存储方式。
- **深度冻结**：确保状态对象是不可变的，避免直接修改状态，增强数据一致性。
- **函数式支持**：支持通过函数来更新状态，避免直接操作原始对象，减少错误。

## 安装

```bash
npm install @sakura_fty/easystore
```
或者使用 yarn:
```bash
yarn add @sakura_fty/easystore
```

## 与 Redux 对比
![image](https://github.com/user-attachments/assets/ded00acf-d879-43ce-835f-98252d5f1065)

## EasyStore 的优势

**易用性**：EasyStore 的 API 设计简洁直观，不需要像 Redux 那样定义 action、reducer 等复杂概念。

**内存与性能开销小**：EasyStore 的体积非常小，适合需要轻量级解决方案的应用程序，而 Redux 需要配置和额外的中间件，增加了额外的复杂性。

**持久化存储**：内置支持 localStorage 和 sessionStorage，状态可以自动存储到浏览器中，避免页面刷新丢失数据。这对于需要持久化状态的应用程序非常有用。

**减少模板代码**：在 Redux 中，开发者需要编写大量的样板代码（如 reducers、action creators、middlewares 等），而 EasyStore 通过更简洁的 API 达到了相同的效果。


## 适合的场景

1. 中小型项目
如果你的项目没有复杂的状态需求，或者不需要使用诸如 Redux 中的复杂架构（如 actions、reducers、thunks 等），EasyStore 是一个极好的选择。它提供了一种简单的方式来管理状态，特别适合中小型项目。
2. 需要持久化状态的应用
如果你的应用需要将用户数据在页面刷新后保持不变，或者希望实现跨页面共享状态，EasyStore 内置的存储持久化功能非常方便，特别适合用来处理购物车、用户认证等场景。
3. 快速开发与原型设计
由于 EasyStore 提供了简洁的 API 和易于理解的设计，开发者可以迅速搭建起状态管理逻辑。这使得它非常适合快速开发和原型设计，帮助开发团队快速实现功能并测试交互。
4. 学习和小型团队
对于刚接触前端状态管理的开发者，EasyStore 提供了一个非常简单的上手方式。它让你专注于业务逻辑，而无需理解过于复杂的状态管理模式。

## 常见问题

1. setStateAsync 是否支持多个异步操作？
是的，setStateAsync 支持传入一个 Promise 数组，处理多个异步状态更新。EasyStore 会在所有异步操作完成后合并最终的状态。

2. 如何更新嵌套对象的状态？
你可以通过传递函数来合并状态，EasyStore 会深度合并更新：
```bash
store.setStateSync((state) => ({
  user: { ...state.user, name: 'John' }
}));
```
3. 可以自定义存储方式吗？
目前 EasyStore 支持 localStorage 和 sessionStorage，如果你需要自定义存储方式，可以修改源码或扩展 EasyStore 类来支持。

## 在React Hooks中使用

```bash
import React, { useEffect, useState } from 'react';
import EasyStore from '@sakura_fty/easystore';

// 定义状态的结构
interface State {
  count: number;
  message: string;
}

// 初始化 store，设置初始状态
const store = new EasyStore<State>({
  initialState: { count: 0, message: '' },
  storageKey: 'counterState',  // 可选：使用 localStorage 持久化状态
  storageType: 'localStorage',  // 可选：选择存储类型，可以是 'localStorage' 或 'sessionStorage'
});

const Counter: React.FC = () => {
  const [state, setState] = useState(store.getState());

  // 订阅状态变化
  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState(newState);  // 当状态变化时更新组件的 state
    });

    // 组件卸载时取消订阅
    return () => unsubscribe();
  }, []);

  // 同步更新状态
  const increment = () => {
    store.setStateSync((state) => ({ count: state.count + 1 }));
  };

  const decrement = () => {
    store.setStateSync((state) => ({ count: state.count - 1 }));
  };

  // 异步更新状态，模拟多个异步操作
  const incrementAsync = async () => {
    // 创建两个 Promise 模拟异步操作
    const asyncData1 = new Promise<{ count: number }>((resolve) =>
      setTimeout(() => resolve({ count: state.count + 10 }), 1000)
    );
    const asyncData2 = new Promise<{ message: string }>((resolve) =>
      setTimeout(() => resolve({ message: 'Hello from Async!' }), 1500)
    );

    // 使用 setStateAsync 同时处理多个异步操作
    await store.setStateAsync([asyncData1, asyncData2]);

    // 以上 setStateAsync 会等两个 Promise 都完成后才会更新状态
  };

  return (
    <div>
      <h1>Counter: {state.count}</h1>
      <p>Message: {state.message}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={incrementAsync}>Increment Async (+10) and Set Message</button>
    </div>
  );
};

export default Counter;

```

## 在Vue3中使用
```bash
<template>
  <div>
    <h1>Counter: {{ state.count }}</h1>
    <p>Message: {{ state.message }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
    <button @click="incrementAsync">Increment Async (+10) and Set Message</button>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import EasyStore from '@sakura_fty/easystore';

// 创建一个 EasyStore 实例，初始化状态
const store = new EasyStore({
  initialState: { count: 0, message: '' },
  storageKey: 'counterState',  // 可选：使用 localStorage 持久化状态
  storageType: 'localStorage',  // 可选：选择存储类型，可以是 'localStorage' 或 'sessionStorage'
});

export default {
  name: 'Counter',
  setup() {
    // 使用 ref 来保持响应式的状态
    const state = ref(store.getState());

    // 在组件挂载时订阅状态变化
    const unsubscribe = store.subscribe((newState) => {
      state.value = newState;
    });

    // 在组件销毁时取消订阅
    onBeforeUnmount(() => {
      unsubscribe();
    });

    // 同步更新状态
    const increment = () => {
      store.setStateSync((state) => ({ count: state.count + 1 }));
    };

    const decrement = () => {
      store.setStateSync((state) => ({ count: state.count - 1 }));
    };

    // 异步更新状态，模拟多个异步操作
    const incrementAsync = async () => {
      // 创建两个 Promise 模拟异步操作
      const asyncData1 = new Promise((resolve) =>
        setTimeout(() => resolve({ count: state.value.count + 10 }), 1000)
      );
      const asyncData2 = new Promise((resolve) =>
        setTimeout(() => resolve({ message: 'Hello from Async!' }), 1500)
      );

      // 使用 setStateAsync 同时处理多个异步操作
      await store.setStateAsync([asyncData1, asyncData2]);

      // 以上 setStateAsync 会等两个 Promise 都完成后才会更新状态
    };

    return {
      state,
      increment,
      decrement,
      incrementAsync,
    };
  },
};
</script>
```

## 贡献

欢迎任何人对 EasyStore 做出贡献！如果你有建议或 bug 报告，请提交一个 issue，或者创建一个 pull request。
