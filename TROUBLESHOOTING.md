# 问题排查 - "Sign了没有东西"

## 已修复的问题

### 1. 交易未等待确认
**问题**：`playCrash` 和 `cashoutCrash` 直接返回 `signAndExecute` 的结果，但此时 `objectChanges` 和 `events` 可能还未准备好。

**修复**：
```javascript
// 修改前
return await signAndExecute({ transaction: tx, options: {...} });

// 修改后
const result = await signAndExecute({ transaction: tx, options: {...} });
return await waitForTransaction(result.digest);
```

### 2. 缺少详细日志
**问题**：无法知道交易执行到哪一步，难以调试。

**修复**：添加了详细的 console.log：
- 交易参数
- 交易结果
- 创建的对象
- 事件数据
- 游戏结果

### 3. 错误处理不完整
**问题**：交易失败时没有检查状态，导致继续执行后续逻辑。

**修复**：
```javascript
// 检查交易状态
if (result.effects?.status?.status !== 'success') {
    throw new Error('Transaction failed: ' + (result.effects?.status?.error || 'Unknown error'));
}

// 检查是否有预期的对象/事件
if (!createdObject) {
    console.error('No CrashGame object created');
    addToast('Failed to start game', { appearance: 'error' });
}
```

## 如何使用新的调试功能

### 1. 打开浏览器控制台
按 F12 打开开发者工具，切换到 Console 标签。

### 2. 玩 Crash 游戏时的日志

**点击 Bet 按钮后**：
```
Starting crash game with bet: 1000000000
Crash game result: {
  digest: "...",
  effects: { status: { status: "success" } },
  objectChanges: [...]
}
Created CrashGame object: {
  objectId: "0x...",
  objectType: "...::casino::CrashGame"
}
```

**点击 Cashout 按钮后**：
```
Cashing out at multiplier: 250 Game ID: 0x...
Cashout result: { ... }
Crash event: {
  parsedJson: {
    crash_point: 180,
    won: false,
    payout: 0
  }
}
Crash result - crash_point: 180 won: false payout: 0
```

### 3. 玩 Dice 游戏时的日志

**点击 Play 按钮后**：
```
Playing dice - bet: 1000000000 target: 5833 isOver: true
Dice result: { ... }
Dice event: { ... }
Dice game result - diceResult: 7234 won: true payout: 2000000000
```

## 常见问题及解决方案

### 问题 1：签名后没有任何反应

**可能原因**：
1. 交易还在等待确认（正常需要 2-5 秒）
2. 网络连接问题
3. RPC 节点响应慢

**解决方案**：
1. 等待 10 秒
2. 查看控制台是否有日志输出
3. 检查钱包是否显示交易成功
4. 刷新页面重试

### 问题 2：控制台显示 "Transaction failed"

**可能原因**：
1. 余额不足
2. House 余额不足
3. 参数错误
4. 合约逻辑错误

**解决方案**：
1. 检查钱包余额（需要 > 下注金额 + 0.01 OCT gas）
2. 查看具体错误信息
3. 尝试减小下注金额
4. 联系管理员检查 House 余额

### 问题 3：控制台显示 "No CrashGame object created"

**可能原因**：
1. 交易失败但没有抛出错误
2. objectChanges 格式不符合预期
3. 合约版本不匹配

**解决方案**：
1. 查看完整的 `result` 对象
2. 检查 `.env` 中的 `PACKAGE_ID` 是否正确
3. 确认合约已正确部署

### 问题 4：控制台显示 "No crash event found"

**可能原因**：
1. 事件未正确 emit
2. 事件类型不匹配
3. 交易确认延迟

**解决方案**：
1. 查看 `result.events` 数组
2. 检查事件类型是否包含 `::casino::CrashResultEvent`
3. 等待更长时间后重试

## 测试步骤

### 测试 Crash 游戏

1. 连接钱包（确保有 > 1 OCT）
2. 设置下注金额为 1
3. 打开浏览器控制台
4. 点击 "Bet" 按钮
5. 确认钱包交易
6. 观察控制台日志：
   - 应该看到 "Starting crash game with bet: ..."
   - 应该看到 "Crash game result: ..."
   - 应该看到 "Created CrashGame object: ..."
7. 等待倍数增长到 2x 左右
8. 点击 "Cashout" 按钮
9. 确认钱包交易
10. 观察控制台日志：
    - 应该看到 "Cashing out at multiplier: ..."
    - 应该看到 "Cashout result: ..."
    - 应该看到 "Crash event: ..."
11. 查看游戏结果提示

### 测试 Dice 游戏

1. 连接钱包
2. 设置下注金额
3. 选择 Over 或 Under
4. 调整滑块
5. 打开浏览器控制台
6. 点击 "Play" 按钮
7. 确认钱包交易
8. 观察控制台日志
9. 查看骰子结果和提示

## 如果问题仍然存在

请提供以下信息：

1. **浏览器控制台的完整日志**（从点击按钮到结束）
2. **交易哈希**（如果有）
3. **钱包地址**
4. **使用的钱包类型**（如 OneWallet）
5. **网络状态**（是否连接到 OneChain Testnet）
6. **错误截图**

可以在 OneScan 浏览器查看交易详情：
```
https://onescan.cc/testnet/transactionBlocksDetail?digest=<交易哈希>
```

## 技术细节

### waitForTransaction 函数

```javascript
const waitForTransaction = async (digest, maxRetries = 15) => {
  let txDetails = null;
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      txDetails = await client.getTransactionBlock({
        digest,
        options: {
          showEvents: true,
          showEffects: true,
          showObjectChanges: true,
        }
      });
      if (txDetails.events && txDetails.events.length > 0) {
        break;
      }
      retries++;
      if (retries >= 5) {
        break;
      }
    } catch (e) {
      retries++;
      if (retries >= maxRetries) throw e;
    }
  }
  return txDetails;
};
```

这个函数会：
1. 等待 800ms
2. 查询交易详情
3. 如果有事件就返回
4. 否则重试最多 15 次
5. 至少重试 5 次后返回（即使没有事件）

### 事件解析

```javascript
// Crash 游戏
const crashEvent = result.events?.find(e => 
    e.type.includes('::casino::CrashResultEvent')
);
const { crash_point, won, payout } = crashEvent.parsedJson;

// Dice 游戏
const diceEvent = result.events?.find(e => 
    e.type.includes('::casino::DiceResultEvent')
);
const { result: diceResult, won, payout } = diceEvent.parsedJson;
```

### 对象查找

```javascript
const createdObject = result.objectChanges?.find(
    change => change.type === 'created' && 
    change.objectType.includes('::casino::CrashGame')
);
const gameId = createdObject.objectId;
```
