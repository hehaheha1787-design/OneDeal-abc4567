// Full on-chain - no backend API calls
// All payments handled via OneChain

export const getDepositAddress = async () => {
    // On-chain: user's wallet address is the deposit address
    return { status: true, data: { address: '' } };
};

export const getMyBalance = async () => {
    // Balance fetched from chain via useOneDeal hook
    return { status: true, data: { balance: 0 } };
};

export const withdraw = async () => {
    // Withdrawals are direct on-chain transfers
    return { status: true };
};

export const getDailyReward = async () => {
    return { status: false, message: 'Not available' };
};

export const getCurrencies = async () => {
    // Only OCT on OneChain
    return { 
        status: true, 
        data: [
            { 
                _id: '1',
                currencyName: 'OCT', 
                fullName: 'OneChain Token',
                decimal: 9,
                token: 'native',
                available: true,
                withdrawable: true,
                swapable: false,
            }
        ] 
    };
};

export const getExchangeRate = async () => {
    return { status: true, data: 1 };
};

export const swapCoin = async () => {
    return { status: false, message: 'Only OCT supported' };
};
