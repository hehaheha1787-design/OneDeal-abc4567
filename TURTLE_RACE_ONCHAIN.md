# Turtle Race - On-Chain Integration

## 完成状态
✅ 已完成链上集成

## 改动说明

### 1. 移除 WebSocket 依赖
- 删除了 `TurtleSocketManager.js` 的使用
- 不再连接后端 socket 服务器
- 改为直接调用链上合约

### 2. 简化游戏流程
**原流程（多人游戏）：**
- 倒计时 → 多人下注 → 比赛开始 → 显示结果

**新流程（单人即时游戏）：**
- 选择乌龟 → 下注 → 立即比赛 → 显示结果

### 3. 使用 `useOneDeal` Hook
```javascript
const { playTurtle, account, isPending } = useOneDeal();

// 下注并开始比赛
const result = await playTurtle(betAmountInSmallestUnit, turtleNum);
```

### 4. 游戏参数
- **3只乌龟**: Yellow (0), Red (1), Blue (2)
- **赔率**: 3.8x (合约中是 380/100)
- **最小下注**: 0.001 OCT (1,000,000 MIST)
- **最大下注**: 1000 OCT (前端限制)

### 5. 动画效果
- 保留了原有的乌龟赛跑动画
- 3秒动画时间（简化版）
- 显示获胜乌龟的排名标记

## 合约函数

```move
public entry fun play_turtle(
    house: &mut House,
    payment: Coin<OCT>,
    chosen_turtle: u64,  // 0-3 (实际只用 0-2)
    r: &Random,
    ctx: &mut TxContext
)
```

## 测试步骤

1. **连接钱包**
   - 确保 OneWallet 已连接
   - 确保有足够的 OCT 余额

2. **选择乌龟**
   - 点击 Yellow/Red/Blue 按钮
   - 选中的按钮会高亮

3. **设置下注金额**
   - 输入金额或使用 ½/2x/Max 按钮
   - 默认 10 OCT

4. **开始比赛**
   - 点击 "Race" 按钮
   - 等待交易确认
   - 观看动画（3秒）
   - 查看结果

5. **查看历史**
   - 页面底部显示历史记录
   - 显示最近10场比赛的获胜乌龟

## 注意事项

⚠️ **House 余额要求**
- 每次下注需要 House 有足够余额支付潜在赔付
- 下注 X OCT 需要 House 至少有 3.8X OCT
- 例如：下注 10 OCT 需要 House 有 38 OCT

⚠️ **当前 House 余额**
- House ID: `0x459a713e6a4fd55df04ec418f18a10767f3e5d454d7e64aeb5ebb1ed666bef60`
- 当前余额: 1 OCT
- **建议充值至少 100 OCT**

## 充值 House

```bash
sui client call \
  --package 0xbfa9fb8ad4d07b277836143733a3f0e2d4b8b06408e6794faa8abb260329ddab \
  --module casino \
  --function fund_house \
  --args 0x459a713e6a4fd55df04ec418f18a10767f3e5d454d7e64aeb5ebb1ed666bef60 <YOUR_OCT_COIN_ID> \
  --gas-budget 10000000
```

## 文件修改

### 新文件
- `frontend/src/hooks/useOneDeal.js` - 链上交易 hook

### 修改文件
- `frontend/src/views/main/game/turtlerace/index.jsx` - 完全重写，移除 socket，添加链上逻辑

### 保留文件（未修改）
- `frontend/src/views/main/game/turtlerace/components/HistoryBox.jsx`
- `frontend/src/views/main/game/turtlerace/components/GamePanel.jsx`

### 删除依赖
- 不再使用 `TurtleSocketManager.js`
- 不再需要后端 turtle race socket 服务器

## 下一步

1. ✅ Scissors - 已完成
2. ✅ Turtle Race - 已完成
3. ⏳ Dice - 待完成
4. ⏳ Mines - 待完成
5. ⏳ Plinko - 待完成
6. ⏳ Crash - 待完成
7. ⏳ Slot - 待完成
