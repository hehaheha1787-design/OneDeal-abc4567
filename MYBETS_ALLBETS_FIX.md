# MyBets/AllBets 显示问题修复

## 问题

游戏历史记录表格（My Bets / All Bets）不显示数据。

## 根本原因

1. **缺少调试日志**：无法知道数据查询和解析的每个步骤
2. **错误处理不完整**：查询失败时没有明确的错误提示
3. **数据流不透明**：不清楚数据在哪个环节出了问题

## 修复内容

### 1. 增强 useOnChainHistory Hook

添加了详细的日志输出：

```javascript
// 查询开始
console.log('useOnChainHistory: Fetching transactions for package:', PACKAGE_ID);

// 查询结果
console.log('useOnChainHistory: Transaction count:', txs.data?.length || 0);

// 处理每个交易
console.log(`useOnChainHistory: Processing tx ${index + 1}/${txs.data.length}`);

// 事件解析
console.log(`useOnChainHistory: Found ${gameTypeName} event:`, gameEvent);

// 最终结果
console.log('useOnChainHistory: Returning - allBets:', filteredTransactions.length, 'myBets:', myTransactions.length);
```

### 2. 增强 DataTable 组件

添加了状态变化日志：

```javascript
console.log('DataTable: historyState changed to', historyState);
console.log('DataTable: myBets count:', myBets.length);
console.log('DataTable: allBets count:', allBets.length);
console.log('DataTable: tableData updated, count:', tableData.length);
```

### 3. 改进错误处理

- 检查 client 是否可用
- 处理空结果情况
- 记录无法解析的交易
- 显示可用的事件类型

## 使用方法

### 1. 打开浏览器控制台

按 F12 打开开发者工具，切换到 Console 标签。

### 2. 观察日志输出

正常情况下应该看到：

```
useOnChainHistory: Effect triggered, client: true, account: 0x...
useOnChainHistory: Fetching transactions for package: 0xfca16699...
useOnChainHistory: Fetched transactions: {...}
useOnChainHistory: Transaction count: 5
useOnChainHistory: Processing tx 1/5: ...
useOnChainHistory: Found dice event: {...}
useOnChainHistory: Parsed transactions count: 5
useOnChainHistory: Returning - allBets: 5, myBets: 2
DataTable: Setting All Bets
DataTable: tableData updated, count: 5
```

### 3. 诊断问题

根据日志输出可以快速定位问题：

| 日志信息 | 问题 | 解决方案 |
|---------|------|---------|
| "No client available" | Client 未初始化 | 检查 OneProvider 配置 |
| "Transaction count: 0" | 没有交易记录 | 先玩几局游戏 |
| "No game event found" | 事件解析失败 | 检查事件类型是否匹配 |
| "myBets count: 0" | 当前钱包无记录 | 用当前钱包玩游戏 |
| "allBets count: 0" | 查询失败或无数据 | 检查网络和 PACKAGE_ID |

## 测试步骤

1. **准备工作**
   - 确保钱包已连接
   - 确保有足够的 OCT（> 1 OCT）
   - 打开浏览器控制台

2. **玩游戏**
   - 玩一局 Dice 或其他游戏
   - 等待交易确认（5-10 秒）
   - 观察控制台日志

3. **查看历史**
   - 切换到游戏的 History 标签
   - 点击 "My Bets" 查看自己的记录
   - 点击 "All Bets" 查看所有玩家的记录
   - 观察控制台日志

4. **验证数据**
   - 应该看到刚才玩的游戏记录
   - 记录应该包含：玩家、下注、赔付、倍数、游戏类型、交易哈希
   - 点击交易哈希应该能打开 OneScan 浏览器

## 常见问题

### Q1: 为什么 My Bets 是空的但 All Bets 有数据？

A: 这是正常的。My Bets 只显示当前连接钱包的游戏记录。如果你用的是新钱包或没玩过游戏，My Bets 就是空的。

### Q2: 为什么新玩的游戏不立即显示？

A: 历史记录每 10 秒自动刷新一次。你可以等待 10 秒，或者刷新页面。

### Q3: 为什么有些交易没有显示？

A: 只有包含游戏结果事件的交易才会显示。fund_house 等管理交易不会显示在游戏历史中。

### Q4: 为什么显示 "Loading on-chain transactions..."？

A: 正在查询链上数据。通常需要 2-5 秒。如果一直显示，检查：
- 网络连接
- RPC URL 配置
- 控制台错误信息

### Q5: 如何手动刷新历史记录？

A: 目前需要刷新页面。未来可以添加手动刷新按钮。

## 技术细节

### 数据查询

使用 Sui SDK 的 `queryTransactionBlocks` API：

```javascript
const txs = await client.queryTransactionBlocks({
  filter: {
    MoveFunction: {
      package: PACKAGE_ID,
      module: 'casino',
    }
  },
  options: {
    showEvents: true,
    showEffects: true,
  },
  limit: 50,
  order: 'descending'
});
```

### 事件解析

从交易事件中提取游戏数据：

```javascript
const diceEvent = events.find(e => e.type?.includes('DiceResultEvent'));
const eventData = diceEvent.parsedJson;
const betAmount = Number(eventData.bet_amount) / 1e9;
const payout = Number(eventData.payout) / 1e9;
const won = eventData.won;
```

### 数据过滤

- **All Bets**: 所有游戏类型的所有交易
- **My Bets**: 只显示当前钱包地址的交易
- **Game Filter**: 可以按游戏类型过滤（如只显示 Dice）

### 自动刷新

每 10 秒自动查询一次新交易：

```javascript
const interval = setInterval(fetchTransactions, 10000);
```

## 下一步改进

1. 添加手动刷新按钮
2. 添加分页功能（目前只显示前 10 条）
3. 添加日期范围筛选
4. 添加游戏类型筛选
5. 显示更详细的游戏信息（如 Dice 的 over/under）
6. 添加导出功能
7. 缓存到本地存储减少查询次数
8. 添加实时更新（WebSocket）

## 相关文件

- `frontend/src/hooks/useOnChainHistory.js` - 查询和解析链上交易
- `frontend/src/views/components/datatable/index.jsx` - 显示历史记录表格
- `HISTORY_DEBUG.md` - 详细的调试指南

## 总结

通过添加详细的日志输出，现在可以清楚地看到：
1. 是否成功查询到交易
2. 查询到多少条交易
3. 每条交易是否成功解析
4. 最终有多少条记录显示

如果 MyBets/AllBets 还是不显示，查看控制台日志就能快速定位问题。
