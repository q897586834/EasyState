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

易用性：EasyStore 的 API 设计简洁直观，不需要像 Redux 那样定义 action、reducer 等复杂概念。
内存与性能开销小：EasyStore 的体积非常小，适合需要轻量级解决方案的应用程序，而 Redux 需要配置和额外的中间件，增加了额外的复杂性。
持久化存储：内置支持 localStorage 和 sessionStorage，状态可以自动存储到浏览器中，避免页面刷新丢失数据。这对于需要持久化状态的应用程序非常有用。
减少模板代码：在 Redux 中，开发者需要编写大量的样板代码（如 reducers、action creators、middlewares 等），而 EasyStore 通过更简洁的 API 达到了相同的效果。

## 为什么选择 EasyStore？

1. 简洁易用，减少复杂性
简化状态管理：相比于 Redux 或 MobX，EasyStore 提供了一个极为简单的 API，让你无需编写大量的样板代码。它仅提供基本的 getState 和 setState 方法，避免了复杂的 actions、reducers、dispatch 等概念，使得开发者可以专注于核心业务逻辑。
直接的状态更新：通过 setStateSync 和 setStateAsync 方法，你可以同步或异步地更新状态，无需额外的中间件或复杂的流程。
2. 内置持久化功能
自动持久化到 localStorage 或 sessionStorage：EasyStore 提供了内置的状态持久化功能，可以将状态自动保存到浏览器的存储中，确保状态不会因为页面刷新而丢失。这是处理需要跨页面、跨会话数据的应用程序时非常有用的功能。
支持白名单和黑名单机制：你可以配置哪些状态字段需要持久化，哪些不需要，避免不必要的存储操作。
3. 轻量高效
小巧的体积：EasyStore 是一个非常轻量级的状态管理库，没有 Redux 那样的复杂概念，体积也非常小，适合中小型项目以及希望避免复杂依赖的开发者。
性能友好：相较于 Redux 中需要处理的 action dispatch 和复杂的 reducer 逻辑，EasyStore 的状态更新方式简单直接，不会引入不必要的性能开销。
4. 灵活性和可扩展性
支持同步与异步操作：EasyStore 支持异步操作，通过 setStateAsync 你可以灵活地处理需要等待的数据，适用于像 API 调用、用户操作等场景。
自定义存储方式：如果你不希望使用默认的 localStorage 或 sessionStorage，可以自行扩展 EasyStore 以支持其他存储方式，非常灵活。
5. 易于与现有应用集成
与 React、Vue 等框架兼容：EasyStore 与各种前端框架兼容，特别是像 React 这样的现代框架，能够方便地与组件生命周期配合，方便管理全局状态。
监听状态变化：EasyStore 提供了简单的订阅机制，可以方便地监听状态变化并作出响应，适合需要全局状态共享的应用。
6. 易于调试与维护
简化调试：没有 Redux 那么复杂的中间件和流转，调试 EasyStore 的状态更新相对简单，你可以轻松地看到每次状态更新的结果，并且能直接查看和修改状态。
可维护性强：EasyStore 提供的 API 设计简单且直观，能让开发者快速上手，也减少了状态管理相关的 bug 和复杂性。

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

## 贡献

欢迎任何人对 EasyStore 做出贡献！如果你有建议或 bug 报告，请提交一个 issue，或者创建一个 pull request。
