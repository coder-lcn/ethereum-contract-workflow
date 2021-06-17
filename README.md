# [区块链开发入门：从 0 到 1 构建基于以太坊智能合约的 ICO DApp](https://juejin.cn/book/6844733720226856967)

## 前言

在学习的过程中发现，不少示例代码已经比较陈旧了，现在使用起来会遇到各种问题。在评论区中，也发现有不少小伙伴遇到了类似的问题，于是为了方便自己学习，和帮助其他人；决定写一个基于 ts 的副本，相关依赖都使用最新版本来实现。大家可以根据 `commit` 记录来阅读，我会严格遵循文章的进度来提交代码。欢迎大家 fork、issues。

## 使用

```shell
# 安装依赖
yarn

# 编译
yarn compile

# 部署合约
yarn deploy

# 测试
yarn test
```

## 部署合约需注意：

新建 `scripts/config.ts` 文件，写入与自己相关的信息

```typescript
export const memonic = "你的助记词";
export const rinkebyUrl = "要部署的 rinkeby 网络地址";
```
