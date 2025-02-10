// jest.setup.ts

Object.defineProperty(global, 'localStorage', {
  value: {
    store: {} as { [key: string]: string }, // store 类型定义为 key 为 string，value 为 string
    setItem(key: string, value: string): void { // 设置 key 和 value 的类型为 string
      this.store[key] = value;
    },
    getItem(key: string): string | null { // 获取 item 返回值为 string 或 null
      return this.store[key] || null;
    },
    removeItem(key: string): void { // 删除 item
      delete this.store[key];
    },
    clear(): void { // 清空所有 item
      this.store = {};
    },
  },
  configurable: true,
});
