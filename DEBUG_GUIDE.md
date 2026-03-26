# 调试指南 - "Sign了没有东西"

## 问题诊断

如果你签名交易后没有反应，可能是以下几个原因：

### 1. 检查浏览器控制台

打开浏览器的开发者工具（F12），查看 Console 标签页：

```javascript
// 应该看到这些日志：
Starting crash game with bet: 1000000000
Crash game result: { ... }
Created CrashGame object: { ... }
```

如果看到错误信息，记录下来。

### 2. 常见错误及解决方案

#### 错误：`Insufficient balance`
- **原因**：钱包余额不足
- **解决**：确保钱包有足够的 OCT（至少 0.01 OCT 用于 gas + 下注金额）

#### 错误：`Object not found`
- **原因**：HOUSE_ID 或其他合约地址配置错误
- **解决**：检查 `.env` 文件中的配置是否正确

#### 错误：`Transaction failed`
- **原因**：交易执行失败
- **解决**：查看具体的错误信息，可能是：
  - 下注金额太小（最小 0.001 OCT = 1_000_000）
  - House 余额不足以支付赔付
  - 合约逻辑错误

#### 没有错误但没有反应
- **原因**：交易可能还在等待确认
- **解决**：
  1. 等待 5-10 秒
  2. 检查钱包是否显示交易成功
  3. 查看 OneScan 浏览器确认交易状态

### 3. 检查交易详情

在控制台中查看完整的交易结果：

```javascript
// 在 handleBet 中添加的日志
console.log('Crash game result:', result);

// 应该包含：
{
  digest: "交易哈希",
  effects: {
    status: { status: "success" }
  },
  objectChanges: [
    {
      type: "created",
      objectType: "...::casino::CrashGame",
      objectId: "游戏对象ID"
    }
  ]
}
```

### 4. 验证合约配置

检查 `frontend/.env` 文件：

```bash
REACT_APP_PACKAGE_ID=0xfca16699e2c5e331047c8a82f2a30b8f09a5d148d6448dc44335b45445ec7e7d
REACT_APP_HOUSE_ID=0x012756ce9e624658ca1d3208670c2d2800cebadfde5f2ff642ffd80fbdb36673
REACT_APP_RANDOM_ID=0x8
```

确保这些地址是正确的。

### 5. 测试步骤

1. **连接钱包**
   - 确保钱包已连接
   - 检查网络是否为 OneChain Testnet

2. **设置下注金额**
   - 从小金额开始测试（如 1 OCT）
   - 确保金额 >= 1（前端单位）

3. **点击 Bet**
   - 观察钱包弹窗
   - 确认交易
   - 等待交易确认

4. **查看控制台**
   - 应该看到 "Starting crash game with bet: ..."
   - 应该看到 "Crash game result: ..."
   - 应该看到 "Created CrashGame object: ..."

### 6. 手动测试交易

如果问题持续，可以在控制台手动测试：

```javascript
// 1. 获取 useOneDeal hook
const { playCrash } = useOneDeal();

// 2. 测试调用
playCrash(1000000000).then(result => {
  console.log('Manual test result:', result);
}).catch(error => {
  console.error('Manual test error:', error);
});
```

### 7. 检查 House 余额

House 需要有足够的余额来支付赔付：

```javascript
// 在控制台运行
const { getHouseBalance } = useOneDeal();
getHouseBalance().then(balance => {
  console.log('House balance:', balance);
});
```

### 8. 网络问题

如果是网络问题：

1. 检查 RPC 连接：
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

2. 尝试切换网络或重新连接钱包

### 9. 最新改进

我已经添加了以下改进：

1. **更详细的日志**：在 `handleBet` 和 `handleCashout` 中添加了 console.log
2. **等待交易确认**：使用 `waitForTransaction` 确保获取完整的交易结果
3. **错误处理**：检查交易状态并显示具体错误信息
4. **状态重置**：失败时正确重置游戏状态

### 10. 如果还是不行

提供以下信息以便进一步诊断：

1. 浏览器控制台的完整错误信息
2. 交易哈希（如果有）
3. 钱包地址和余额
4. 使用的浏览器和钱包类型
5. 网络连接状态

## 快速检查清单

- [ ] 钱包已连接
- [ ] 网络为 OneChain Testnet
- [ ] 钱包有足够余额（> 0.01 OCT）
- [ ] `.env` 配置正确
- [ ] 浏览器控制台没有错误
- [ ] 下注金额 >= 1
- [ ] House 有足够余额
- [ ] RPC 连接正常
