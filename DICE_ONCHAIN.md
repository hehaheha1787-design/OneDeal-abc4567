# Dice 游戏上链集成说明

## 修改内容

### 1. 移除 Socket 连接
- 删除了 `DiceSocketManager` 的导入和使用
- 移除了 socket 相关的事件监听和消息处理

### 2. 集成链上交易
- 引入 `useOneDeal` hook 和 `useCurrentAccount` 
- 使用 `playDice` 函数调用链上合约

### 3. 参数映射

#### 合约参数：
- `bet_amount`: u64 (OCT 的最小单位，1 OCT = 1_000_000_000)
- `target`: u64 (0-10000，代表 0.00-100.00)
- `is_over`: bool (true = over, false = under)

#### 前端到合约的映射：
```javascript
// 下注金额转换
const betAmountInOCT = Math.floor(betAmount * 1_000_000_000);

// Target 计算
// ChanceData 中的 over/under 是 3-11（两个骰子的总和）
// 映射到 0-10000 范围：(diceValue / 12) * 10000
const diceValue = isOver ? ChanceData[difficulty].over : ChanceData[difficulty].under;
const target = Math.floor((diceValue / 12) * 10000);
```

### 4. 结果处理

从链上事件 `DiceResultEvent` 中获取：
- `result`: 骰子结果 (0-10000)
- `won`: 是否获胜
- `payout`: 赔付金额

将链上结果映射回前端显示：
```javascript
// 将 0-10000 映射回 2-14 的骰子总和
const total = Math.floor((diceResult / 10000) * 12) + 2;
const l = Math.min(6, Math.max(1, Math.floor(total / 2)));
const r = Math.min(6, Math.max(1, total - l));
```

## 使用说明

1. 确保钱包已连接
2. 设置下注金额
3. 选择 Over 或 Under
4. 调整滑块选择难度
5. 点击 PLAY 按钮发起链上交易
6. 等待交易确认并查看结果

## 注意事项

- 需要确保 `.env` 文件中配置了正确的合约地址：
  - `REACT_APP_PACKAGE_ID`
  - `REACT_APP_HOUSE_ID`
  - `REACT_APP_RANDOM_ID`
- 钱包需要有足够的 OCT 用于下注和 gas 费用
- 交易需要等待链上确认，可能需要几秒钟
