// Full on-chain - no backend API calls
// All auth is handled by OneWallet

export const userGoogleLogin = async () => {
    return { status: false, message: 'Use wallet login' };
};

export const metamaskLogin = async () => {
    return { status: false, message: 'Use OneWallet' };
};

export const emailLogin = async () => {
    return { status: false, message: 'Use wallet login' };
};

export const verifyEmailCode = async () => {
    return { status: false, message: 'Use wallet login' };
};

export const updateProfileSet = async () => {
    return { status: true };
};

export const getMyBalances = async () => {
    // Balance is on-chain, fetched via useOneDeal hook
    return { status: true, data: { data: [] } };
};

export const getAuthData = async () => {
    return { status: false };
};

export const getProfileData = async () => {
    return { status: true, data: {} };
};

export const getDepositBonus = async () => {
    return { status: true, data: [] };
};

export const getBetHistoryData = async () => {
    // Can be fetched from chain events
    return { status: true, data: [] };
};

export const updateCurrency = async () => {
    return { status: true };
};

export const updateProfileHistory = async () => {
    return { status: true };
};

export const updateUserGameSetting = async () => {
    return { status: true };
};

export const getSeedData = async () => {
    // On-chain randomness, no seeds needed
    return { status: true, data: { serverSeed: '', clientSeed: '' } };
};

export const updateClientSeed = async () => {
    return { status: true };
};

export const updateServerSeed = async () => {
    return { status: true };
};

export const getLevelData = async () => {
    return { status: true, data: [] };
};

export const getAvailableGames = async () => {
    // All games available on-chain
    return { 
        status: true, 
        data: [
            { gameName: 'Dice', available: true },
            { gameName: 'Mines', available: true },
            { gameName: 'Plinko', available: true },
            { gameName: 'Crash', available: true },
            { gameName: 'Scissors', available: true },
            { gameName: 'Turtle', available: true },
            { gameName: 'Slot', available: true },
        ] 
    };
};

export const getBannerText = async () => {
    return { 
        status: true, 
        data: [
            { type: 'top', text1: 'Welcome to', text2: 'OneDeal Casino', text3: 'Full On-Chain Gaming on OneChain!' },
            { type: 'bottom', text1: 'Play & Win', text2: 'OCT Tokens', text3: 'Dice, Mines, Plinko, Crash, Scissors, Turtle Race & Slot!' }
        ] 
    };
};

export const getPrivacyData = async () => {
    return { status: true, data: {} };
};

export const updatePrivacyData = async () => {
    return { status: true };
};

export const getCampaignCode = async () => {
    return { status: true, data: '' };
};

export const getCampaignData = async () => {
    return { status: true, data: [] };
};

export const claimCampaignAmount = async () => {
    return { status: true };
};

export const getUnlockBalance = async () => {
    return { status: true, data: [] };
};

export const getWargerBalance = async () => {
    return { status: true, data: { wargerBalance: 0 } };
};

export const claimLockedBalance = async () => {
    return { status: true };
};

export const getSpinCount = async () => {
    return { status: true, data: { count: 0 } };
};

export const updateSpinCount = async () => {
    return { status: true };
};

export const getTournamentList = async () => {
    return { status: true, data: [] };
};

export const participateTournament = async () => {
    return { status: true };
};

export const getAffiliateUsersData = async () => {
    return { status: true, data: [] };
};

export const getAffiliateEarningData = async () => {
    return { status: true, data: [] };
};

export const getTournamentWargerDetail = async () => {
    return { status: true, data: [] };
};

export const getCampaignList = async () => {
    return { status: true, data: [] };
};

export const addCampaignList = async () => {
    return { status: true };
};

export const getCampaignDetail = async () => {
    return { status: true, data: {} };
};

export const getTransactionHistory = async () => {
    return { status: true, data: [] };
};
