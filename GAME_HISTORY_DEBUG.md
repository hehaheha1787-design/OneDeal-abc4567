# Game History Debug Guide

## Problem
Games like Mines, Dice, and Crash show history in the main history page but not in their individual game pages.

## Debug Steps

### 1. Check Browser Console
Open the browser console (F12) and look for these logs when viewing a game page:

```
useOnChainHistory: Filtering by gameType: [gametype]
useOnChainHistory: Total transactions: [number]
useOnChainHistory: Filtered transactions: [number]
useOnChainHistory: Game types in all transactions: [array]
```

### 2. Verify Game Type Names
The game type names used in the code:
- Scissors: `sicssor`
- Dice: `dice`
- Turtle Race: `turtle`
- Slot: `slot`
- Plinko: `plinko`
- Mines: `mines`
- Crash: `crash`

### 3. Check HistoryBox Components
Each game should pass the correct gameType to DataTable:

**Correct configurations:**
- `frontend/src/views/main/game/dice/utils/HistoryBox.jsx`: `gameType="dice"`
- `frontend/src/views/main/game/mines/utils/HistoryBox.jsx`: `gameType="mines"`
- `frontend/src/views/main/game/crash/utils/HistoryBox.jsx`: `gameType="crash"`
- `frontend/src/views/main/game/slot/utils/HistoryBox.jsx`: `gameType="slot"`

### 4. Check Event Types in Smart Contract
The events emitted by the contract:
- `DiceResultEvent`
- `MinesResultEvent`
- `CrashResultEvent`
- `SlotResultEvent`
- `PlinkoResultEvent`
- `ScissorsResultEvent`
- `TurtleResultEvent`

### 5. Common Issues

#### Issue 1: No transactions found
**Symptom:** Console shows "Filtered transactions: 0"
**Cause:** No transactions exist for this game type
**Solution:** Play the game to create transactions

#### Issue 2: Wrong game type filter
**Symptom:** Console shows different game types than expected
**Cause:** HistoryBox.jsx passing wrong gameType prop
**Solution:** Check the gameType prop in the HistoryBox component

#### Issue 3: Event not recognized
**Symptom:** Console shows "No game event found for tx"
**Cause:** Event type name doesn't match the search pattern
**Solution:** Check if the event type includes the expected string (e.g., "MinesResultEvent")

### 6. Test Each Game

For each game (Dice, Mines, Crash, Slot):

1. Play the game and make a bet
2. Wait for transaction to complete
3. Check the main history page - transaction should appear
4. Go to the game's history tab
5. Check console logs for filtering information
6. Verify the transaction appears in the game's history

### 7. Manual Test Commands

Open browser console and run:

```javascript
// Check what's in localStorage
console.log('All transactions:', JSON.parse(localStorage.getItem('transactions') || '[]'));

// Check current game type filter
console.log('Current filter:', document.querySelector('[data-game-type]')?.dataset.gameType);
```

## Expected Behavior

When viewing a game's history:
1. The hook fetches all transactions from the blockchain
2. Filters by the game type (e.g., "mines", "dice", "crash")
3. Displays filtered results in the DataTable
4. Shows pagination if more than 10 results

## Files Modified

1. `frontend/src/hooks/useOnChainHistory.js` - Added detailed logging
2. `frontend/src/views/main/game/mines/utils/HistoryBox.jsx` - Fixed gameType="mines"
3. `frontend/src/views/main/game/crash/utils/HistoryBox.jsx` - Fixed gameType="crash"
4. `frontend/src/views/components/datatable/index.jsx` - Added pagination

## Next Steps if Still Not Working

1. Clear browser cache and reload
2. Check if transactions are actually being created (check OneScan)
3. Verify the PACKAGE_ID in `frontend/src/config/contracts.js` is correct
4. Check network tab for API calls to the Sui RPC
5. Verify the wallet is connected and has the correct address
