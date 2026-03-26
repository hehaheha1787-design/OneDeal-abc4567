import { useState, useEffect } from 'react';
import { useSuiClient, useCurrentAccount } from '@onelabs/dapp-kit';
import { PACKAGE_ID } from '../config/contracts';

export function useOnChainHistory(gameType = null) {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    if (!client) {
      console.log('useOnChainHistory: No client available');
      return;
    }

    console.log('useOnChainHistory: Fetching transactions for package:', PACKAGE_ID);
    setLoading(true);
    setError(null);

    try {
      // Query transactions by package
      const txs = await client.queryTransactionBlocks({
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
          showObjectChanges: false,
          showBalanceChanges: false,
        },
        limit: 50,
        order: 'descending'
      });

      console.log('useOnChainHistory: Fetched transactions:', txs);
      console.log('useOnChainHistory: Transaction count:', txs.data?.length || 0);

      if (!txs.data || txs.data.length === 0) {
        console.log('useOnChainHistory: No transactions found');
        setTransactions([]);
        setLoading(false);
        return;
      }

      // Parse transactions
      const parsedTxs = txs.data.map((tx, index) => {
        const events = tx.events || [];
        
        console.log(`useOnChainHistory: Processing tx ${index + 1}/${txs.data.length}:`, tx.digest);
        console.log(`useOnChainHistory: Events count:`, events.length);
        if (events.length > 0) {
          console.log(`useOnChainHistory: Event types in this tx:`, events.map(e => e.type));
        }
        
        // Find game event
        const scissorsEvent = events.find(e => e.type?.includes('ScissorsResultEvent'));
        const diceEvent = events.find(e => e.type?.includes('DiceResultEvent'));
        const turtleEvent = events.find(e => e.type?.includes('TurtleResultEvent'));
        const slotEvent = events.find(e => e.type?.includes('SlotResultEvent'));
        const plinkoEvent = events.find(e => e.type?.includes('PlinkoResultEvent'));
        const minesEvent = events.find(e => e.type?.includes('MinesResultEvent'));
        const crashEvent = events.find(e => e.type?.includes('CrashResultEvent'));

        let gameEvent = null;
        let gameTypeName = 'unknown';

        if (scissorsEvent) {
          gameEvent = scissorsEvent;
          gameTypeName = 'sicssor';
        } else if (diceEvent) {
          gameEvent = diceEvent;
          gameTypeName = 'dice';
        } else if (turtleEvent) {
          gameEvent = turtleEvent;
          gameTypeName = 'turtle';
        } else if (slotEvent) {
          gameEvent = slotEvent;
          gameTypeName = 'slot';
        } else if (plinkoEvent) {
          gameEvent = plinkoEvent;
          gameTypeName = 'plinko';
        } else if (minesEvent) {
          gameEvent = minesEvent;
          gameTypeName = 'mines';
        } else if (crashEvent) {
          gameEvent = crashEvent;
          gameTypeName = 'crash';
        }

        if (!gameEvent) {
          console.log(`useOnChainHistory: No game event found for tx ${tx.digest}`);
          console.log('useOnChainHistory: Available event types:', events.map(e => e.type));
          return null;
        }

        console.log(`useOnChainHistory: Found ${gameTypeName} event:`, gameEvent);

        const eventData = gameEvent.parsedJson;
        console.log(`useOnChainHistory: Event data for ${gameTypeName}:`, JSON.stringify(eventData, null, 2));
        
        const player = eventData.player;
        const betAmount = Number(eventData.bet_amount) / 1e9;
        const payout = Number(eventData.payout) / 1e9;
        
        console.log(`useOnChainHistory: Processing ${gameTypeName} event data:`, {
          won: eventData.won,
          wonType: typeof eventData.won,
          result: eventData.result,
          multiplier: eventData.multiplier,
          payout,
          betAmount
        });
        
        // Determine result
        let roundResult = 'lost';
        
        // Check for won field (used by dice, plinko, turtle, etc.)
        // Handle both boolean and string values
        if (eventData.won !== undefined) {
          if (eventData.won === true || eventData.won === 'true') {
            roundResult = 'win';
            console.log(`useOnChainHistory: Set roundResult to 'win' based on won=${eventData.won}`);
          } else {
            roundResult = 'lost';
            console.log(`useOnChainHistory: Set roundResult to 'lost' based on won=${eventData.won}`);
          }
        }
        // Check for result field (used by scissors game: 0=lost, 1=draw, 2=win)
        else if (eventData.result !== undefined && gameTypeName === 'sicssor') {
          const resultCode = Number(eventData.result);
          if (resultCode === 2) {
            roundResult = 'win';
            console.log(`useOnChainHistory: Set roundResult to 'win' based on result=2`);
          } else if (resultCode === 1) {
            roundResult = 'draw';
            console.log(`useOnChainHistory: Set roundResult to 'draw' based on result=1`);
          } else {
            roundResult = 'lost';
            console.log(`useOnChainHistory: Set roundResult to 'lost' based on result=${resultCode}`);
          }
        }
        // Check for multiplier field (used by slot game)
        // Slot multiplier is stored as basis points (100 = 1.0x, 200 = 2.0x, etc.)
        else if (eventData.multiplier !== undefined && gameTypeName === 'slot') {
          const multiplierValue = Number(eventData.multiplier);
          if (multiplierValue > 0) { // Any multiplier > 0 means win
            roundResult = 'win';
            console.log(`useOnChainHistory: Set roundResult to 'win' based on multiplier=${multiplierValue}`);
          } else {
            roundResult = 'lost';
            console.log(`useOnChainHistory: Set roundResult to 'lost' based on multiplier=${multiplierValue}`);
          }
        }
        // Check for draw conditions (mines game)
        else if (eventData.hit_mine === false) {
          roundResult = 'draw';
          console.log(`useOnChainHistory: Set roundResult to 'draw' based on hit_mine=false`);
        }
        // Fallback: Check if payout > 0 means win
        else if (payout > 0 && payout > betAmount) {
          roundResult = 'win';
          console.log(`useOnChainHistory: Set roundResult to 'win' based on payout > betAmount`);
        } else if (payout > 0 && payout === betAmount) {
          roundResult = 'draw';
          console.log(`useOnChainHistory: Set roundResult to 'draw' based on payout === betAmount`);
        } else {
          console.log(`useOnChainHistory: Keeping roundResult as 'lost' (default)`);
        }

        // Calculate multiplier
        // For slot game, use the multiplier from event (stored as basis points, e.g., 100 = 1.0x)
        let multiplier;
        if (gameTypeName === 'slot' && eventData.multiplier !== undefined) {
          multiplier = Number(eventData.multiplier) / 100; // Convert basis points to decimal
          console.log(`useOnChainHistory: Using slot multiplier from event: ${eventData.multiplier} -> ${multiplier}x`);
        } else {
          multiplier = betAmount > 0 ? payout / betAmount : 0;
          console.log(`useOnChainHistory: Calculated multiplier from payout/betAmount: ${multiplier}x`);
        }

        const parsedTx = {
          digest: tx.digest,
          txHash: tx.digest,
          player,
          userName: `${player.substring(0, 6)}...${player.substring(player.length - 4)}`,
          userLevel: 1,
          betAmount: betAmount.toFixed(4),
          payout: multiplier,
          roundResult,
          gameType: gameTypeName,
          timestamp: tx.timestampMs,
          coinType: {
            coinType: 'OCT'
          }
        };

        console.log(`useOnChainHistory: Parsed tx:`, parsedTx);
        return parsedTx;
      }).filter(tx => tx !== null);

      console.log('useOnChainHistory: Parsed transactions count:', parsedTxs.length);
      setTransactions(parsedTxs);
    } catch (err) {
      console.error('useOnChainHistory: Error fetching transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useOnChainHistory: Effect triggered, client:', !!client, 'account:', account?.address);
    fetchTransactions();
    
    // Refresh every 10 seconds
    const interval = setInterval(() => {
      console.log('useOnChainHistory: Auto-refresh triggered');
      fetchTransactions();
    }, 10000);
    
    return () => {
      console.log('useOnChainHistory: Cleanup');
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [client, account]);

  // Filter by game type if specified
  const filteredTransactions = gameType 
    ? transactions.filter(tx => {
        const matches = tx.gameType === gameType;
        if (!matches) {
          console.log(`useOnChainHistory: Filtering out tx with gameType '${tx.gameType}' (looking for '${gameType}')`);
        }
        return matches;
      })
    : transactions;

  console.log('useOnChainHistory: Filtering by gameType:', gameType);
  console.log('useOnChainHistory: Total transactions:', transactions.length);
  console.log('useOnChainHistory: Filtered transactions:', filteredTransactions.length);
  console.log('useOnChainHistory: Game types in all transactions:', [...new Set(transactions.map(tx => tx.gameType))]);
  
  if (filteredTransactions.length > 0) {
    console.log('useOnChainHistory: Sample filtered transaction:', filteredTransactions[0]);
  }

  // Filter by current user for "My Bets"
  const myTransactions = account 
    ? filteredTransactions.filter(tx => tx.player === account.address)
    : [];

  console.log('useOnChainHistory: Returning - allBets:', filteredTransactions.length, 'myBets:', myTransactions.length);

  return {
    allBets: filteredTransactions,
    myBets: myTransactions,
    loading,
    error,
    refresh: fetchTransactions
  };
}

export default useOnChainHistory;
