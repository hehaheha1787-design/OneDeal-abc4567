# 🎰 OneDeal Casino

**A Decentralized Casino Platform on OneChain Blockchain**

OneDeal is a fully on-chain casino platform built on the OneChain blockchain, featuring provably fair games and transparent smart contract interactions.

---

## 🎮 Available Games

| Game | Description | Status |
|------|-------------|--------|
| 🎲 **Dice** | Roll the dice and predict over/under | ✅ Live |
| 💣 **Mines** | Find diamonds, avoid mines | ✅ Live |
| 🚀 **Crash** | Cash out before the crash | ✅ Live |
| 🎰 **Slot** | Spin the reels for big wins | ✅ Live |
| 🎯 **Plinko** | Drop the ball and watch it bounce | ✅ Live |
| ✂️ **Scissors** | Rock, Paper, Scissors on-chain | ✅ Live |
| 🐢 **Turtle Race** | Bet on racing turtles | ✅ Live |

---

## 🏗️ Project Structure

```
OneDeal/
├── contracts/              # Move smart contracts
│   ├── sources/
│   │   └── casino.move    # Main casino contract
│   └── Move.toml
│
└── frontend/              # React frontend application
    ├── src/
    │   ├── views/         # Game components
    │   ├── hooks/         # Custom React hooks
    │   ├── config/        # Contract configuration
    │   └── providers/     # OneChain wallet providers
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v16 or higher
- OneChain CLI (for contract deployment)
- OneChain Wallet (for playing games)

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The application will start on `http://localhost:3000`

### Smart Contract Deployment

```bash
cd contracts
sui move build
sui client publish --gas-budget 100000000
```

---

## 🔧 Configuration

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# OneDeal Contract Configuration - OneChain Testnet

# RPC Configuration
REACT_APP_RPC_URL=https://rpc-testnet.onelabs.cc:443
REACT_APP_NETWORK=testnet

# Contract Addresses
REACT_APP_PACKAGE_ID=0xfca16699e2c5e331047c8a82f2a30b8f09a5d148d6448dc44335b45445ec7e7d
REACT_APP_HOUSE_ID=0x012756ce9e624658ca1d3208670c2d2800cebadfde5f2ff642ffd80fbdb36673
REACT_APP_ADMIN_CAP_ID=0xb3b294bb4dc1880d0cc504507a79d93549cc3b3de21f297d70758a995e1781f1
REACT_APP_RANDOM_ID=0x8
```

**Environment Variables Explained:**
- `REACT_APP_RPC_URL`: OneChain RPC endpoint URL
- `REACT_APP_NETWORK`: Network type (testnet/mainnet)
- `REACT_APP_PACKAGE_ID`: Deployed casino contract package ID
- `REACT_APP_HOUSE_ID`: House object ID for managing casino funds
- `REACT_APP_ADMIN_CAP_ID`: Admin capability object ID
- `REACT_APP_RANDOM_ID`: OneChain random module ID (0x8 for testnet)

### Contract Configuration

The contract addresses are automatically loaded from environment variables in `frontend/src/config/contracts.js`.

For mainnet deployment, update the `.env` file with your mainnet contract addresses.

---

## 🎲 How to Play

1. **Connect Wallet**: Click "WALLET" button and connect your OneChain wallet
2. **Get OCT Tokens**: Ensure you have OCT tokens in your wallet
3. **Choose a Game**: Select from the available games
4. **Place Your Bet**: Set your bet amount (minimum 1 OCT)
5. **Play**: Follow game-specific instructions
6. **Win**: Winnings are automatically sent to your wallet

---

## 🔐 Smart Contract Features

- **Provably Fair**: All game outcomes are verifiable on-chain
- **Transparent**: Open-source smart contracts
- **Secure**: Audited Move code
- **Instant Payouts**: Automatic on-chain settlements
- **House Management**: Decentralized house fund management

---

## 📊 Game Mechanics

### Dice
- Choose over/under and target number
- Multipliers based on probability
- Instant results

### Mines
- Select number of mines (1-24)
- Reveal tiles to find diamonds
- Cash out anytime or risk it all

### Crash
- Watch the multiplier increase
- Cash out before it crashes
- Higher risk, higher reward

### Slot
- 5-reel slot machine
- Multiple paylines
- Free spins and multipliers

### Plinko
- Drop ball from top
- Ball bounces through pegs
- Land in multiplier slots

### Scissors
- Rock, Paper, Scissors
- Play against the house
- 2x payout on win

### Turtle Race
- Bet on turtle #1-5
- Watch the race
- 5x payout on winner

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Material-UI** - Component library
- **@onelabs/dapp-kit** - OneChain wallet integration
- **PIXI.js** - Game rendering (Crash, Slot)
- **Redux** - State management

### Smart Contracts
- **Move** - OneChain blockchain language
- **OneChain Framework** - Standard libraries
- **Random Module** - On-chain randomness

---

## 📈 Transaction History

All game transactions are recorded on-chain and can be viewed:
- In-game history tabs (My Bets / All Bets)
- On OneScan Explorer
- Paginated view with transaction details

---

## 🔗 Blockchain Integration

### OneChain Network
- Testnet: Available via OneChain RPC
- Mainnet: Available via OneChain RPC

### Wallet Support
- OneChain Wallet
- All @onelabs/dapp-kit compatible wallets

---

## 🎯 Default Bet Amounts

All games have a default bet amount of **1 OCT**:
- Minimum: 1 OCT
- Maximum: 1000 OCT

---

## 📝 Recent Updates

- ✅ Fixed history display for Dice and Slot games
- ✅ Added pagination for transaction history
- ✅ Implemented on-chain history fetching
- ✅ Updated default bet amounts to 1 OCT
- ✅ Added OCT coin icon to Slot game
- ✅ Removed Blackjack game
- ✅ Fixed game type filtering in history

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🔗 Links

- [OneChain Documentation](https://docs.onechain.io/)
- [Move Language](https://move-language.github.io/move/)
- [OneLabs Dapp Kit](https://github.com/onelabs-io/dapp-kit)

---

## ⚠️ Disclaimer

This is a casino platform. Please gamble responsibly. Only bet what you can afford to lose.

---

**Built with ❤️ on OneChain Blockchain**
