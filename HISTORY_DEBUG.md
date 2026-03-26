# 历史记录调试指南 - MyBets/AllBets 不显示

## 问题描述

游戏历史记录表格（My Bets / All Bets）不显示数据。

## 调试步骤

### 1. 打开浏览器控制台

按 F12 打开开发者工具，切换到 Console 标签。

### 2. 查看日志输出

当页面加载或切换 My Bets/All Bets 标签时，应该看到以下日志：

```
useOnChainHistory: Effect triggered, client: true, account: 0x...
useOnChainHistory: Fetching transactions for package: 0xfca16699...
useOnChainHistory: Fetched transactions: {...}
useOnChainHistory: Transaction count: 5
useOnChainHistory: Processing tx 1/5: ...
useOnChainHistory: Events count: 1
useOnChainHistory: Found dice event: {...}
useOnChainHistory: Parsed tx: {...}
useOnChainHistory: Parsed transactions count: 5
useOnChainHistory: Returning - allBets: 5, myBets: 2
DataTable: historyState changed to 1
DataTable: myBets count: 2
DataTable: allBets count: 5
DataTable: Setting All Bets
DataTable: tableData updated, count: 5
```

### 3. 常见问题及解决方案

#### 问题 1: "Transaction count: 0"

**原因**：链上还没有任何交易记录

**解决方案**：
1. 先玩几局游戏（Dice, Scissors, Turtle Race 等）
2. 等待交易确认（约 5-10 秒）
3. 刷新页面或等待自动刷新（10 秒）

#### 问题 2: "No game event found for tx"

**原因**：交易中没有游戏结果事件

**可能情况**：
- 交易是 fund_house 或其他非游戏交易
- 事件类型名称不匹配
- 事件解析失败

**解决方案**：
1. 查看 "Available event types" 日志
2. 确认事件类型是否包含预期的游戏事件（如 DiceResultEvent）
3. 如果事件类型不匹配，可能需要更新合约或前端代码

#### 问题 3: "No client available"

**原因**：Sui client 未初始化

**解决方案**：
1. 检查 OneProvider 是否正确配置
2. 确认 RPC_URL 配置正确
3. 刷新页面重试

#### 问题 4: "myBets count: 0" 但 "allBets count: 5"

**原因**：当前钱包地址没有游戏记录

**解决方案**：
1. 确认钱包已连接
2. 用当前钱包玩几局游戏
3. 切换到 "All Bets" 标签查看所有玩家的记录

#### 问题 5: 查询失败错误

**错误示例**：
```
Error fetching transactions: Network request failed
```

**解决方案**：
1. 检查网络连接
2. 确认 RPC URL 可访问：
   ```javascript
   fetch('https://rpc-testnet.onelabs.cc:443', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       jsonrpc: '2.0',
       id: 1,
       method: 'sui_getChainIdentifier',
       params: []
     })
   }).then(r => r.json()).then(console.log);
   ```
3. 尝试切换网络或重启浏览器

### 4. 手动测试查询

在控制台运行以下代码手动测试：

```javascript
// 1. 获取 client
const { useSuiClient } = require('@onelabs/dapp-kit');

// 2. 手动查询
const PACKAGE_ID = '0xfca16699e2c5e331047c8a82f2a30b8f09a5d148d6448dc44335b45445ec7e7d';

client.queryTransactionBlocks({
  filter: {
    MoveFunction: {
      package: PACKAGE_ID,
      module: 'casino',
    }
  },
  options: {
    showInput: true,
    showEffects: true,
    showEvents: true,
  },
  limit: 10,
  order: 'descending'
}).then(result => {
  console.log('Manual query result:', result);
  console.log('Transaction count:', result.data.length);
  if (result.data.length > 0) {
    console.log('First transaction:', result.data[0]);
    console.log('Events:', result.data[0].events);
  }
}).catch(error => {
  console.error('Manual query error:', error);
});
```

### 5. 检查事件结构

如果查询到交易但没有解析出游戏事件，检查事件结构：

```javascript
// 查看第一个交易的所有事件
const tx = result.data[0];
tx.events.forEach((event, index) => {
  console.log(`Event ${index}:`, {
    type: event.type,
    parsedJson: event.parsedJson
  });
});
```

预期的事件类型应该包含：
- `...::casino::DiceResultEvent`
- `...::casino::ScissorsResultEvent`
- `...::casino::TurtleResultEvent`
- `...::casino::SlotResultEvent`
- `...::casino::CrashResultEvent`
- 等等

### 6. 验证 PACKAGE_ID

确认 `.env` 文件中的 PACKAGE_ID 正确：

```bash
REACT_APP_PACKAGE_ID=0xfca16699e2c5e331047c8a82f2a30b8f09a5d148d6448dc44335b45445ec7e7d
```

可以在 OneScan 上验证：
```
https://onescan.cc/testnet/packageDetail?packageId=0xfca16699e2c5e331047c8a82f2a30b8f09a5d148d6448dc44335b45445ec7e7d
```

### 7. 检查数据流

数据流程：
1. `useOnChainHistory` hook 查询链上交易
2. 解析交易事件，提取游戏数据
3. 返回 `allBets` 和 `myBets` 数组
4. `DataTable` 组件根据 `historyState` 显示对应数据
5. 渲染表格行

在每个步骤添加日志确认数据正确传递。

## 快速检查清单

- [ ] 浏览器控制台已打开
- [ ] 看到 "useOnChainHistory: Effect triggered" 日志
- [ ] 看到 "Transaction count: X" 日志（X > 0）
- [ ] 看到 "Parsed transactions count: X" 日志（X > 0）
- [ ] 看到 "DataTable: tableData updated, count: X" 日志（X > 0）
- [ ] 钱包已连接（查看 My Bets 时）
- [ ] 已玩过至少一局游戏
- [ ] 等待至少 10 秒让交易确认
- [ ] PACKAGE_ID 配置正确
- [ ] RPC 连接正常

## 已知限制

1. **刷新延迟**：新交易需要 10 秒自动刷新才会显示
2. **历史限制**：只显示最近 50 笔交易
3. **分页限制**：每页只显示 10 条记录
4. **事件依赖**：只显示有游戏结果事件的交易

## 改进建议

如果需要更好的用户体验，可以考虑：

1. 添加手动刷新按钮
2. 增加分页功能
3. 添加日期筛选
4. 显示更详细的游戏信息
5. 添加加载动画
6. 缓存历史记录到本地存储

## 如果问题仍然存在

提供以下信息：

1. 完整的控制台日志（从页面加载到现在）
2. 钱包地址
3. 是否玩过游戏
4. 查看的是 My Bets 还是 All Bets
5. 浏览器和版本
6. 网络状态

可以尝试：
1. 清除浏览器缓存
2. 使用隐私模式
3. 切换浏览器
4. 重新连接钱包
5. 刷新页面
