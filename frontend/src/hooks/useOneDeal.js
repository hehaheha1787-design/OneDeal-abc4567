import { 
  useCurrentAccount, 
  useSignAndExecuteTransaction, 
  useSuiClient 
} from "@onelabs/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, HOUSE_ID, RANDOM_ID } from "../config/contracts";

export function useOneDeal() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute, isPending } = useSignAndExecuteTransaction();

  // Helper function to wait for transaction and get events
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
        // 如果有events就返回，否则继续重试几次后也返回
        if (txDetails.events && txDetails.events.length > 0) {
          break;
        }
        retries++;
        // 如果重试5次还没有events，就返回（可能交易成功但没有emit event）
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

  // ============ SCISSORS ============
  const playScissors = async (betAmount, choice) => {
    if (!account) throw new Error("Wallet not connected");

    const tx = new Transaction();
    tx.setGasBudget(10000000); // 0.01 OCT gas budget
    
    // 从 gas coin 分割下注金额
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(betAmount)]);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::casino::play_scissors`,
      arguments: [
        tx.object(HOUSE_ID),
        coin,
        tx.pure.u64(choice),
        tx.object(RANDOM_ID),
      ],
    });

    const result = await signAndExecute({ 
      transaction: tx,
      options: {
        showEffects: true,
        showEvents: true,
      }
    });
    
    // 等待交易上链后获取完整信息
    let txDetails = null;
    let retries = 0;
    while (retries < 10) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // 等待500ms
        txDetails = await client.getTransactionBlock({
          digest: result.digest,
          options: {
            showEvents: true,
            showEffects: true,
          }
        });
        break;
      } catch (e) {
        retries++;
        if (retries >= 10) throw e;
      }
    }

    return txDetails;
  };

  // ============ DICE ============
  const playDice = async (betAmount, target, isOver) => {
    if (!account) throw new Error("Wallet not connected");

    const tx = new Transaction();
    tx.setGasBudget(10000000);
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(betAmount)]);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::casino::play_dice`,
      arguments: [
        tx.object(HOUSE_ID),
        coin,
        tx.pure.u64(target),
        tx.pure.bool(isOver),
        tx.object(RANDOM_ID),
      ],
    });

    const result = await signAndExecute({ 
      transaction: tx,
      options: {
        showEffects: true,
        showEvents: true,
      }
    });

    // 等待交易上链后获取完整信息
    return await waitForTransaction(result.digest);
  };

  // ============ MINES ============
  const startMines = async (betAmount, mineCount) => {
    if (!account) throw new Error("Wallet not connected");

    const tx = new Transaction();
    tx.setGasBudget(10000000);
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(betAmount)]);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::casino::start_mines`,
      arguments: [
        tx.object(HOUSE_ID),
        coin,
        tx.pure.u64(mineCount),
        tx.object(RANDOM_ID),
      ],
    });

    const result = await signAndExecute({ 
      transaction: tx,
      options: {
        showEffects: true,
        showEvents: true,
      }
    });

    // 等待交易上链后获取完整信息
    let txDetails = null;
    let retries = 0;
    while (retries < 10) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        txDetails = await client.getTransactionBlock({
          digest: result.digest,
          options: {
            showEvents: true,
            showEffects: true,
            showObjectChanges: true,
          }
        });
        break;
      } catch (e) {
        retries++;
        if (retries >= 10) throw e;
      }
    }

    return txDetails;
  };

  const revealTile = async (gameId, position) => {
    if (!account) throw new Error("Wallet not connected");

    const tx = new Transaction();
    tx.setGasBudget(10000000);
    tx.moveCall({
      target: `${PACKAGE_ID}::casino::reveal_tile`,
      arguments: [
        tx.object(gameId),
        tx.object(HOUSE_ID),
        tx.pure.u64(position),
      ],
    });

    const result = await signAndExecute({ 
      transaction: tx,
      options: {
        showEffects: true,
        showEvents: true,
      }
    });

    return await waitForTransaction(result.digest);
  };

  const cashoutMines = async (gameId) => {
    if (!account) throw new Error("Wallet not connected");

    const tx = new Transaction();
    tx.setGasBudget(10000000);
    tx.moveCall({
      target: `${PACKAGE_ID}::casino::cashout_mines`,
      arguments: [
        tx.object(gameId),
        tx.object(HOUSE_ID),
      ],
    });

    const result = await signAndExecute({ 
      transaction: tx,
      options: {
        showEffects: true,
        showEvents: true,
      }
    });

    // 等待交易上链后获取完整信息
    let txDetails = null;
    let retries = 0;
    while (retries < 10) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        txDetails = await client.getTransactionBlock({
          digest: result.digest,
          options: {
            showEvents: true,
            showEffects: true,
            showObjectChanges: true,
          }
        });
        break;
      } catch (e) {
        retries++;
        if (retries >= 10) throw e;
      }
    }

    return txDetails;
  };

  // ============ PLINKO ============
  const playPlinko = async (betAmount, rows, risk) => {
    if (!account) throw new Error("Wallet not connected");

    const tx = new Transaction();
    tx.setGasBudget(10000000);
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(betAmount)]);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::casino::play_plinko`,
      arguments: [
        tx.object(HOUSE_ID),
        coin,
        tx.pure.u64(rows),
        tx.pure.u64(risk),
        tx.object(RANDOM_ID),
      ],
    });

    const result = await signAndExecute({ 
      transaction: tx,
      options: {
        showEffects: true,
        showEvents: true,
      }
    });

    // Wait for transaction to be indexed and get events
    const txDetails = await waitForTransaction(result.digest);
    return txDetails;
  };

  // ============ CRASH ============
  const playCrash = async (betAmount) => {
    if (!account) throw new Error("Wallet not connected");

    const tx = new Transaction();
    tx.setGasBudget(10000000);
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(betAmount)]);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::casino::play_crash`,
      arguments: [
        tx.object(HOUSE_ID),
        coin,
        tx.object(RANDOM_ID),
      ],
    });

    const result = await signAndExecute({ 
      transaction: tx,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      }
    });

    // 等待交易上链后获取完整信息
    return await waitForTransaction(result.digest);
  };

  const cashoutCrash = async (gameId, multiplier) => {
    if (!account) throw new Error("Wallet not connected");

    const tx = new Transaction();
    tx.setGasBudget(10000000);
    tx.moveCall({
      target: `${PACKAGE_ID}::casino::cashout_crash`,
      arguments: [
        tx.object(gameId),
        tx.object(HOUSE_ID),
        tx.pure.u64(multiplier),
      ],
    });

    const result = await signAndExecute({ 
      transaction: tx,
      options: {
        showEffects: true,
        showEvents: true,
      }
    });

    // 等待交易上链后获取完整信息
    return await waitForTransaction(result.digest);
  };

  // ============ TURTLE RACE ============
  const playTurtle = async (betAmount, chosenTurtle) => {
    if (!account) throw new Error("Wallet not connected");

    const tx = new Transaction();
    tx.setGasBudget(10000000);
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(betAmount)]);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::casino::play_turtle`,
      arguments: [
        tx.object(HOUSE_ID),
        coin,
        tx.pure.u64(chosenTurtle),
        tx.object(RANDOM_ID),
      ],
    });

    const result = await signAndExecute({ 
      transaction: tx,
      options: {
        showEffects: true,
        showEvents: true,
      }
    });

    // 等待交易上链后获取完整信息
    let txDetails = null;
    let retries = 0;
    while (retries < 10) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // 等待500ms
        txDetails = await client.getTransactionBlock({
          digest: result.digest,
          options: {
            showEvents: true,
            showEffects: true,
          }
        });
        break;
      } catch (e) {
        retries++;
        if (retries >= 10) throw e;
      }
    }

    return txDetails;
  };

  // ============ SLOT ============
  const playSlot = async (betAmount) => {
    if (!account) throw new Error("Wallet not connected");

    const tx = new Transaction();
    tx.setGasBudget(10000000);
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(betAmount)]);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::casino::play_slot`,
      arguments: [
        tx.object(HOUSE_ID),
        coin,
        tx.object(RANDOM_ID),
      ],
    });

    const result = await signAndExecute({ 
      transaction: tx,
      options: {
        showEffects: true,
        showEvents: true,
      }
    });

    // Wait for transaction to be processed and get events
    let txDetails = null;
    let retries = 0;
    while (retries < 10) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        txDetails = await client.getTransactionBlock({
          digest: result.digest,
          options: {
            showEvents: true,
            showEffects: true,
          }
        });
        if (txDetails.events && txDetails.events.length > 0) {
          break;
        }
        retries++;
      } catch (e) {
        retries++;
        if (retries >= 10) throw e;
      }
    }

    return txDetails || result;
  };

  // ============ VIEW ============
  const getHouseBalance = async () => {
    const result = await client.getObject({
      id: HOUSE_ID,
      options: { showContent: true },
    });
    return result.data?.content?.fields?.balance;
  };

  return {
    account,
    isPending,
    playScissors,
    playDice,
    startMines,
    revealTile,
    cashoutMines,
    playPlinko,
    playCrash,
    cashoutCrash,
    playTurtle,
    playSlot,
    getHouseBalance,
  };
}

export default useOneDeal;
