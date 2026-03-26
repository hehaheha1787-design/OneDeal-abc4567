# Crash 游戏上链集成说明

## 修改内容

### 1. 移除 Socket 连接
- 删除了 `CrashSocketManager` 的导入和使用
- 移除了所有 socket 相关的事件监听和消息处理
- 移除了多人游戏相关的功能（betList, newBetUser, newCashout 等）

### 2. 简化游戏模式
- 从多人实时游戏改为单人游戏模式
- 移除了 Auto Bet 功能（链上版本暂不支持）
- 移除了等待下一轮的逻辑

### 3. 集成链上交易

#### 合约参数：
- `play_crash`: 
  - `bet_amount`: u64 (OCT 的最小单位)
  - 返回：创建 `CrashGame` 对象，包含隐藏的 crash_point

- `cashout_crash`:
  - `game_id`: CrashGame 对象 ID
  - `cashout_multiplier`: u64 (100 = 1.00x)
  - 返回：`CrashResultEvent` 包含 crash_point, won, payout

#### 前端实现：

1. **开始游戏 (handleBet)**:
   ```javascript
   const betAmountInOCT = Math.floor(betAmount * 1_000_000_000);
   const result = await playCrash(betAmountInOCT);
   
   // 获取创建的 CrashGame 对象 ID
   const createdObject = result.objectChanges?.find(
       change => change.type === 'created' && 
       change.objectType.includes('::casino::CrashGame')
   );
   gameIdRef.current = createdObject.objectId;
   ```

2. **飞行动画 (startFlying)**:
   ```javascript
   // 前端模拟飞行过程，每 100ms 增加 0.05x
   const interval = setInterval(() => {
       multiplier += 5; // 100 = 1.00x
       setCurrentMultiplier(multiplier);
       gameApp.fly(multiplier / 100, time);
   }, 100);
   ```

3. **提现 (handleCashout)**:
   ```javascript
   const cashoutMultiplier = currentMultiplier;
   const result = await cashoutCrash(gameIdRef.current, cashoutMultiplier);
   
   // 从事件中获取结果
   const crashEvent = result.events?.find(e => 
       e.type.includes('::casino::CrashResultEvent')
   );
   const { crash_point, won, payout } = crashEvent.parsedJson;
   ```

### 4. 游戏流程

1. 用户设置下注金额
2. 点击 "Bet" 按钮，调用 `play_crash` 创建游戏
3. 前端开始模拟飞行动画，倍数不断增加
4. 用户可以随时点击 "Cashout" 按钮
5. 调用 `cashout_crash`，合约判断是否在 crash_point 之前提现
6. 显示结果：赢了显示赔付金额，输了显示 crash 点

### 5. 关键差异

#### 原版（Socket 多人游戏）：
- 服务器控制游戏进程
- 所有玩家看到相同的飞行曲线
- 实时显示其他玩家的下注和提现

#### 链上版（单人游戏）：
- 合约在下注时就确定了 crash_point（隐藏）
- 前端模拟飞行动画
- 用户提现时，合约验证是否在 crash_point 之前
- 单人游戏，没有其他玩家信息

## 使用说明

1. 确保钱包已连接
2. 设置下注金额
3. 点击 "Bet" 开始游戏
4. 观察倍数增长
5. 在合适的时机点击 "Cashout"
6. 查看结果

## 注意事项

- 需要确保 `.env` 文件中配置了正确的合约地址
- crash_point 在下注时就已确定，但对用户隐藏
- 前端的飞行动画是模拟的，实际结果由合约决定
- 钱包需要有足够的 OCT 用于下注和 gas 费用
- 原版 socket 代码已备份到 `index_socket_backup.jsx`

## 技术细节

### 倍数计算
- 合约中倍数以 100 为基数（100 = 1.00x, 200 = 2.00x）
- 前端显示时除以 100 并保留两位小数

### 游戏对象管理
- 每次下注创建新的 `CrashGame` 对象
- 使用 `gameIdRef.current` 存储当前游戏 ID
- 提现后清理游戏状态

### 动画同步
- 使用 `setInterval` 模拟飞行过程
- 提现时清除 interval 停止动画
- 显示 crash 结果后重置状态
