# History Display Fix Summary

## Problems Identified and Fixed

### 1. Wrong Game Type in HistoryBox Components
**Problem:** Mines and Crash games were using `gameType="dice"` instead of their own game types.

**Fixed:**
- `frontend/src/views/main/game/mines/utils/HistoryBox.jsx`: Changed to `gameType="mines"`
- `frontend/src/views/main/game/crash/utils/HistoryBox.jsx`: Changed to `gameType="crash"`

### 2. Missing HistoryBox Component
**Problem:** Mines game didn't import or render the HistoryBox component at all.

**Fixed:**
- Added `import HistoryBox from "./utils/HistoryBox";` to `frontend/src/views/main/game/mines/index.jsx`
- Added `<HistoryBox />` rendering in the component

### 3. Slot Game Multiplier Logic
**Problem:** Slot game uses a different multiplier format (basis points) and doesn't have a `won` field.

**Fixed in `frontend/src/hooks/useOnChainHistory.js`:**
- Changed multiplier detection: any `multiplier > 0` means win (not `> 100`)
- Added special handling for slot multiplier calculation: divide by 100 to convert basis points to decimal

### 4. No Pagination
**Problem:** History only showed first 10 items with no way to see more.

**Fixed in `frontend/src/views/components/datatable/index.jsx`:**
- Added pagination state (`currentPage`, `itemsPerPage`)
- Added Previous/Next buttons
- Shows "Page X of Y"
- Auto-resets to page 1 when switching tabs or game types

### 5. Enhanced Debugging
**Added detailed console logging:**
- Game type filtering process
- Transaction counts at each step
- Sample transactions for verification
- Mismatch detection in filtering

## Game Type Mapping

| Game | Event Name | gameType Value |
|------|-----------|----------------|
| Scissors | ScissorsResultEvent | `sicssor` |
| Dice | DiceResultEvent | `dice` |
| Turtle Race | TurtleResultEvent | `turtle` |
| Slot | SlotResultEvent | `slot` |
| Plinko | PlinkoResultEvent | `plinko` |
| Mines | MinesResultEvent | `mines` |
| Crash | CrashResultEvent | `crash` |

## Files Modified

1. **frontend/src/hooks/useOnChainHistory.js**
   - Fixed slot multiplier logic
   - Added detailed debugging logs
   - Added special multiplier calculation for slot

2. **frontend/src/views/components/datatable/index.jsx**
   - Added pagination functionality
   - Added page navigation controls
   - Enhanced logging

3. **frontend/src/views/main/game/mines/utils/HistoryBox.jsx**
   - Fixed gameType from "dice" to "mines"

4. **frontend/src/views/main/game/crash/utils/HistoryBox.jsx**
   - Fixed gameType from "dice" to "crash"

5. **frontend/src/views/main/game/mines/index.jsx**
   - Added HistoryBox import
   - Added HistoryBox component rendering

## Testing Checklist

For each game, verify:
- [ ] Dice: History shows only dice transactions
- [ ] Mines: History shows only mines transactions
- [ ] Crash: History shows only crash transactions
- [ ] Slot: History shows only slot transactions with correct multipliers
- [ ] Plinko: History shows only plinko transactions
- [ ] Scissors: History shows only scissors transactions
- [ ] Turtle Race: History shows only turtle race transactions
- [ ] Pagination works (Previous/Next buttons)
- [ ] "My Bets" vs "All Bets" toggle works
- [ ] Main history page shows all games

## How It Works

1. **Data Fetching:** `useOnChainHistory` hook queries blockchain for all casino transactions
2. **Event Parsing:** Each transaction's events are parsed to identify game type
3. **Filtering:** Transactions are filtered by game type if specified
4. **User Filtering:** "My Bets" further filters by current user's address
5. **Pagination:** DataTable slices the filtered results into pages of 10 items
6. **Display:** Each transaction shows player, bet, payout, multiplier, and transaction link

## Browser Console Logs to Check

When viewing a game's history, you should see:
```
DataTable: Initialized with gameType: [game] historyState: [0 or 1]
useOnChainHistory: Filtering by gameType: [game]
useOnChainHistory: Total transactions: [number]
useOnChainHistory: Filtered transactions: [number]
useOnChainHistory: Game types in all transactions: [array]
DataTable: Received from hook - allBets: [number] myBets: [number]
```

If filtered transactions is 0 but total is > 0, there's a game type mismatch.
