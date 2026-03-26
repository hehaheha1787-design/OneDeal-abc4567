import { Close, CopyAllSharp } from "@mui/icons-material";
import { Modal, Box, IconButton, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { useCurrentAccount } from "@onelabs/dapp-kit";

const useStyles = makeStyles(() => ({
    ModalBox: {
        marginTop: '100px',
        width: '600px',
        left: '50%',
        transform: 'translate(-50%)',
        background: '#2C2C3A',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '30px',
        "@media (max-width: 681px)": {
            width: '100%',
            borderRadius: '0px'
        }
    },
    ModalBodyBox: {
        width: '100%',
        height: '100%',
        position: 'relative',
        padding: '20px'
    },
    CloseButton: {
        position: 'absolute',
        top: '-32px',
        right: '-32px',
        width: '64px',
        height: '64px',
        color: '#55556F',
        background: '#2C2C3A',
        border: '6px solid #24252D',
        "&:hover": {
            background: '#2C2C3AEE'
        },
        "@media (max-width: 681px)": {
            transform: 'translate(-50%)',
            right: 'unset',
            left: '50%'
        }
    },
    TitleBox: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 900,
        fontSize: "32px",
        lineHeight: "49px",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#FFFFFF",
        opacity: 0.5
    },
    PageOptionBox: {
        width: '100%',
        height: '54px',
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '10px'
    },
    PageOptionButton: {
        color: '#FFF',
        textTransform: 'uppercase',
        fontSize: '15px',
        fontWeight: '700',
        height: '100%',
        width: '141px',
        borderRadius: '8px'
    },
    SelectedOption: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%);',
    },
    CurrencyBlock: {
        marginBottom: '20px',
        color: '#FFF',
        fontWeight: '700',
        fontSize: '14px',
    },
    CurrencyIcon: {
        width: '24px',
        height: '24px'
    },
    CurrencyTitle: {
        margin: '10px 0px'
    },
    DepositBalanceBlock: {
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '15px',
        border: 'solid 1px #424253',
        borderRadius: '8px',
        background: '#1F1E25'
    },
    AmountInputWrapper: {
        borderRadius: '5px',
        backgroundColor: '#424253',
        position: 'relative',
        width: '100%'
    },
    AmountInput: {
        background: 'transparent',
        outline: 'none',
        border: 'none',
        color: '#FFF',
        fontWeight: '700',
        fontSize: '14px',
        width: '100%',
        height: '100%',
        padding: '10px 60px 10px 15px'
    },
    AmountInputUtils: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'absolute',
        inset: '0px 16px 0px 8px',
        pointerEvents: 'none'
    },
    CopyAllButton: {
        color: '#FFF',
        pointerEvents: 'all'
    },
    BalanceRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 0',
        borderBottom: '1px solid #424253'
    },
    BalanceLabel: {
        color: '#888',
        fontSize: '14px'
    },
    BalanceValue: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#FFF',
        fontWeight: '700',
        fontSize: '18px'
    },
    AddressBox: {
        wordBreak: 'break-all',
        color: '#FFF',
        fontSize: '14px',
        padding: '10px',
        background: '#424253',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
    },
    InfoText: {
        color: '#888',
        fontSize: '13px',
        marginTop: '15px',
        textAlign: 'center'
    },
    backdrop: {
        backgroundColor: '#1F1E25',
        opacity: '0.95 !important'
    }
}));

const WalletModal = ({ open, setOpen }) => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const account = useCurrentAccount();
    const balanceData = useSelector((state) => state.authentication.balanceData);

    const [pageType, setPageType] = useState(0);

    const handleClose = () => setOpen(false);

    const handlePageType = (type) => {
        setPageType(type);
    };

    const handleCopyAddress = () => {
        if (account?.address) {
            window.navigator.clipboard.writeText(account.address);
            addToast('Address copied!', { appearance: 'success', autoDismiss: true });
        }
    };

    const getBalance = () => {
        if (balanceData && Array.isArray(balanceData)) {
            const octBalance = balanceData.find(b => b.coinType === 'OCT');
            return octBalance ? octBalance.balance.toFixed(9) : '0.000000000';
        }
        return '0.000000000';
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            slotProps={{ backdrop: { className: classes.backdrop } }}
        >
            <Box className={classes.ModalBox}>
                <Box className={classes.ModalBodyBox}>
                    <IconButton className={classes.CloseButton} onClick={handleClose}>
                        <Close />
                    </IconButton>
                    <Box className={classes.TitleBox}>
                        Wallet
                    </Box>
                    <Box className={classes.PageOptionBox}>
                        <Button
                            onClick={() => handlePageType(0)}
                            className={pageType === 0 ? clsx(classes.PageOptionButton, classes.SelectedOption) : classes.PageOptionButton}
                        >
                            Balance
                        </Button>
                        <Button
                            onClick={() => handlePageType(1)}
                            className={pageType === 1 ? clsx(classes.PageOptionButton, classes.SelectedOption) : classes.PageOptionButton}
                        >
                            Deposit
                        </Button>
                    </Box>
                    
                    {pageType === 0 && (
                        <Box>
                            <Box className={classes.CurrencyBlock}>
                                <Box className={classes.CurrencyTitle}>Your Balance</Box>
                                <Box className={classes.DepositBalanceBlock}>
                                    <Box className={classes.BalanceRow}>
                                        <span className={classes.BalanceLabel}>OCT (OneChain Token)</span>
                                        <Box className={classes.BalanceValue}>
                                            <img className={classes.CurrencyIcon} src={`/assets/images/coins/oct.png`} alt='OCT' />
                                            {getBalance()}
                                        </Box>
                                    </Box>
                                </Box>
                                <p className={classes.InfoText}>
                                    Your balance is stored on-chain. All game transactions are fully on-chain.
                                </p>
                            </Box>
                        </Box>
                    )}
                    
                    {pageType === 1 && (
                        <Box>
                            <Box className={classes.CurrencyBlock}>
                                <Box className={classes.CurrencyTitle}>Deposit Address</Box>
                                <Box className={classes.DepositBalanceBlock}>
                                    <span className={classes.BalanceLabel}>
                                        Send OCT to your wallet address:
                                    </span>
                                    <Box className={classes.AddressBox} style={{ marginTop: '10px' }}>
                                        <span>{account?.address || 'Connect wallet first'}</span>
                                        <IconButton onClick={handleCopyAddress} className={classes.CopyAllButton} size="small">
                                            <CopyAllSharp />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <p className={classes.InfoText}>
                                    This is your OneChain wallet address. Send OCT tokens directly to this address to deposit.
                                </p>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default WalletModal;
