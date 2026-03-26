import { makeStyles } from "@mui/styles";
import { Box, Button } from "@mui/material";
import AuthenticationModal from "views/main/modals/AuthModal";
import WalletModal from "views/main/modals/WalletModal";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileWidget from "views/main/pages/profile";
import ChatWidget from "views/main/pages/chat";
import SignoutModal from "views/main/modals/SignoutModal";
import UserSetting from "views/main/pages/userSetting";
import { useCurrentAccount } from "@onelabs/dapp-kit";

const useStyles = makeStyles(() => ({
    MainHeaderBox: {
        width: '100%',
        padding: '30px 50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        background: '#1f1e25',
        zIndex: '10',
        "@media (max-width: 681px)": {
            padding: '8px 14px'
        }
    },
    LogoBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '21px'
    },
    LogoIcon: {
        height: '40px',
        width: 'auto',
        "@media (max-width: 1024px)": {
            display: 'none'
        }
    },
    LoginBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        gap: "5px"
    },
    HeaderButton: {
        padding: '0px 1rem',
        borderRadius: '0.5rem',
        height: '40px',
        "&>span": {
            textTransform: 'uppercase',
            fontWeight: '600',
            fontSize: '14px',
            "@media (max-width: 764px)": {
                fontSize: '12px'
            }
        }
    },
    SignInButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "14px 23px",
        gap: "10px",
        width: "160px",
        height: "47px",
        background: "linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)",
        borderRadius: "8px",
        color: '#FFF',
        "@media (max-width: 764px)": {
            width: '120px',
            minWidth: '120px',
            padding: '0px'
        }
    },
    ChatButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        width: "50px",
        height: "47px",
        background: "#2C2C3A",
        border: "1px solid #363646",
        borderRadius: "8px",
        padding: '0px',
        "@media (max-width: 764px)": {
            display: 'none'
        }
    },
    ProfileButton: {
        borderRadius: '50%',
        background: '#282836',
        padding: '0px',
        width: "50px",
        height: "47px"
    },
    HeaderMiddleBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: '10px'
    },
    WalletButton: {
        background: "linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)",
        borderRadius: "8px",
        color: "#FFF",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "14px 23px",
        gap: "10px",
        width: "115px",
        height: "47px",
        "&:disabled": {
            color: 'rgba(255, 255, 255, 150)',
            opacity: '0.5'
        },
        "@media (max-width: 681px)": {
            display: 'none'
        }
    },
    BalanceBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '47px',
        padding: '0 20px',
        background: '#2C2C3A',
        border: '1px solid #363646',
        borderRadius: '8px',
        gap: '8px'
    },
    BalanceText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: '16px'
    },
    CoinIcon: {
        width: '20px',
        height: '20px'
    },
    LevelIconBox: {
        position: 'absolute',
        right: '0px',
        bottom: '0px',
        width: '18.7px',
        height: '18.7px',
        borderRadius: '50%',
        background: '#1F1E25',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ProfileBox: {
        position: 'absolute',
        right: '0px',
        top: '90px'
    },
    ChatBox: {
        position: 'absolute',
        right: '0px',
        top: '90px'
    },
    UserSettingBox: {
        position: 'absolute',
        right: '0px',
        top: '90px',
        zIndex: '3'
    },
    AddressText: {
        color: '#AAA',
        fontSize: '12px'
    }
}));

let signoutModal = false;

const MainHeader = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const account = useCurrentAccount();

    const modalOption = useSelector((state) => state.modalOption);
    const authData = useSelector((state) => state.authentication);

    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [signoutModalOpen, setSignoutModalOpen] = useState(false);
    const walletModalOpen = modalOption.walletModal;

    const [profileMenu, setProfileMenu] = useState(false);
    const [chatPage, setChatPage] = useState(false);
    const [userSetting, setUserSetting] = useState(false);

    const profileButtonRef = useRef();
    const profileWidgetRef = useRef();
    const chatButtonRef = useRef();
    const chatWidgetRef = useRef();

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            signoutModal = signoutModalOpen;
        }, 100)
    }, [signoutModalOpen]);

    const handleClickOutside = (e) => {
        if (signoutModal) return;
        if (profileWidgetRef.current && !profileWidgetRef.current.contains(e.target)) {
            if (profileButtonRef.current && !profileButtonRef.current.contains(e.target)) {
                setProfileMenu(false);
            }
        }
        if (chatWidgetRef.current && !chatWidgetRef.current.contains(e.target)) {
            if (chatButtonRef.current && !chatButtonRef.current.contains(e.target)) {
                setChatPage(false);
            }
        }
    };

    const setWalletModalOpen = (flag) => {
        dispatch({ type: 'SET_WALLET_MODAL', data: flag });
    };

    const handleLogin = () => {
        setAuthModalOpen(true);
    };

    const handleWalletOpen = () => {
        setWalletModalOpen(true)
    };

    const handleUserSetting = (flag) => {
        setUserSetting(flag);
        if (flag) setProfileMenu(false);
    };

    // Get OCT balance from Redux
    const getBalance = () => {
        if (authData.balanceData && Array.isArray(authData.balanceData)) {
            const octBalance = authData.balanceData.find(b => b.coinType === 'OCT');
            return octBalance ? octBalance.balance.toFixed(4) : '0.0000';
        }
        return '0.0000';
    };

    return (
        <header className={classes.MainHeaderBox}>
            <Box className={classes.LogoBox}>
                <img src={`/assets/images/Logo.png`} className={classes.LogoIcon} alt="Logo" />
            </Box>
            
            <Box className={classes.HeaderMiddleBox}>
                {account && (
                    <>
                        <Box className={classes.BalanceBox}>
                            <img className={classes.CoinIcon} src={`/assets/images/coins/oct.png`} alt='OCT' />
                            <span className={classes.BalanceText}>{getBalance()}</span>
                            <span className={classes.AddressText}>OCT</span>
                        </Box>
                        <Button className={clsx(classes.HeaderButton, classes.WalletButton)} onClick={handleWalletOpen}>
                            <span>Wallet</span>
                        </Button>
                    </>
                )}
            </Box>
            
            <Box className={classes.LoginBox}>
                {!account ? (
                    <Button className={clsx(classes.HeaderButton, classes.SignInButton)} onClick={handleLogin}>
                        <span>Connect Wallet</span>
                    </Button>
                ) : (
                    <>
                    </>
                )}
                
                {profileMenu && (
                    <Box className={classes.ProfileBox} ref={profileWidgetRef}>
                        <ProfileWidget
                            closeProfileMenu={() => setProfileMenu(false)}
                            setSignoutModal={setSignoutModalOpen}
                            handleUserSetting={handleUserSetting}
                        />
                    </Box>
                )}
                {chatPage && (
                    <Box className={classes.ChatBox} ref={chatWidgetRef}>
                        <ChatWidget />
                    </Box>
                )}
                {userSetting && (
                    <Box className={classes.UserSettingBox}>
                        <UserSetting setUserSetting={setUserSetting} />
                    </Box>
                )}
            </Box>
            
            <AuthenticationModal open={authModalOpen} setOpen={setAuthModalOpen} />
            <WalletModal open={walletModalOpen} setOpen={setWalletModalOpen} />
            <SignoutModal open={signoutModalOpen} setOpen={setSignoutModalOpen} />
        </header>
    )
}

export default MainHeader;
