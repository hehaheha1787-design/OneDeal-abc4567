# Plinko On-Chain Integration

## Status: ✅ COMPLETED

Plinko game has been successfully integrated with the on-chain casino contract.

## Changes Made

### 1. Contract (Already Implemented)
- `play_plinko` function in `contracts/sources/casino.move`
- Parameters: `house`, `payment`, `rows` (8/12/16), `risk` (0/1/2), `random`
- Returns `PlinkoResultEvent` with bucket, multiplier, and payout

### 2. Frontend Integration

#### Modified Files:
- `frontend/src/views/main/game/plinko/index.jsx`

#### Changes:
1. **Removed Socket Dependencies**
   - Removed `PlinkoSocketManager` import and usage
   - Removed socket connect/disconnect in useEffect

2. **Added On-Chain Integration**
   - Added `useOneDeal` hook import
   - Added `useCurrentAccount` from @onelabs/dapp-kit
   - Modified `handleBet` to call `playPlinko` function

3. **Transaction Handling**
   - Converts bet amount to smallest unit (MIST)
   - Calls `playPlinko(betAmount, rows, risk)`
   - Parses `PlinkoResultEvent` from transaction events
   - Extracts bucket, multiplier, and payout
   - Starts animation with bucket result
   - Shows toast notifications for win/loss

## How It Works

1. User selects:
   - Bet amount
   - Rows (8, 12, or 16)
   - Risk level (Low/Medium/High)

2. Click "Bet" button:
   - Connects to wallet if not connected
   - Creates transaction with bet parameters
   - Waits for transaction confirmation
   - Parses result from blockchain events

3. Animation:
   - Ball drops through pegs
   - Lands in bucket determined by on-chain random
   - Shows payout based on multiplier

## Risk Levels

- **Low (0)**: Lower multipliers, more consistent
- **Medium (1)**: Balanced risk/reward
- **High (2)**: Extreme multipliers on edges, low in center

## Multiplier Calculation

Contract uses distance from center:
```move
let center = rows / 2;
let distance = if (bucket > center) { bucket - center } else { center - bucket };

if (risk == 0) {
    50 + (distance * 100)  // Low risk
} else if (risk == 1) {
    30 + (distance * 200)  // Medium risk
} else {
    if (distance == center) { 10000 } else { distance * 300 }  // High risk
}
```

## Testing

1. Start frontend: `cd frontend && npm start`
2. Connect wallet
3. Select bet amount, rows, and risk
4. Click "Bet"
5. Confirm transaction in wallet
6. Watch ball drop and see result

## Notes

- Each bet requires a wallet signature
- Transaction includes gas fees
- Results are provably fair (on-chain random)
- Animation matches on-chain bucket result
