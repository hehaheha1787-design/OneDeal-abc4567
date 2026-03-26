// OneDeal Contract Config - Read from Environment Variables
export const RPC_URL = process.env.REACT_APP_RPC_URL || "https://rpc-testnet.onelabs.cc:443";
export const NETWORK = process.env.REACT_APP_NETWORK || "testnet";

// Contract addresses
export const PACKAGE_ID = process.env.REACT_APP_PACKAGE_ID || "";
export const HOUSE_ID = process.env.REACT_APP_HOUSE_ID || "";
export const ADMIN_CAP_ID = process.env.REACT_APP_ADMIN_CAP_ID || "";
export const RANDOM_ID = process.env.REACT_APP_RANDOM_ID || "0x8";

// OneScan Explorer URLs
export const getPackageUrl = () => {
  return `https://onescan.cc/${NETWORK}/packageDetail?packageId=${PACKAGE_ID}`;
};

export const getTransactionUrl = (txDigest) => {
  return `https://onescan.cc/${NETWORK}/transactionBlocksDetail?digest=${txDigest}`;
};

export const getObjectUrl = (objectId) => {
  return `https://onescan.cc/${NETWORK}/object/${objectId}`;
};