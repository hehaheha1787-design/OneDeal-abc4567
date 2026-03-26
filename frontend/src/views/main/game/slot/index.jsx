import { Box, Button, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HistoryBox from "./utils/HistoryBox";
import SettingBox from "views/components/setting";
import { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { LoadingButton } from "@mui/lab";
import { SlotApp } from "./SlotApp";
import useSound from "use-sound";
import ReelSound from "assets/sounds/slot/reel.mp3";
import MatchSound from "assets/sounds/slot/match.mp3";
import WinSound from "assets/sounds/slot/win.mp3";
import ClickSound from "assets/sounds/slot/click.mp3";
import { useToasts } from "react-toast-notifications";
import { useOneDeal } from "hooks/useOneDeal";
import { useCurrentAccount } from "@onelabs/dapp-kit";
import BackButton from "components/BackButton";

const useStyles = makeStyles(() => ({
    MainContainer: {
        width: '100%',
        paddingRight: 54,
        "@media (max-width: 940px)": {
            padding: 0
        }
    },
    GamePanel: {
        width: '100%',
        height: 829,
        borderRadius: 30,
        backgroundImage: 'url("/assets/images/slot/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        position: 'relative',
        "@media (max-width: 940px)": {
            borderRadius: '0px',
        },
        "@media (max-width: 1362px)": {
            // backgroundImage: 'unset',
            height: 'auto'
        },
        "@media (max-width: 681px)": {
            // height: '641px'
        }
    },
    HistoryTable: {
        marginTop: '24px'
    },
    GameMainBox: {
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'flex-start',
        gap: 0,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1377,
        "@media (max-width: 1715px)": {
            width: 1177
        },
        "@media (max-width: 1507px)": {
            width: 1077,
        },
        "@media (max-width: 1362px)": {
            flexDirection: 'column-reverse',
            top: 0,
            left: 0,
            width: '100%',
            transform: 'translate(0)',
            position: 'relative'
        }
    },
    GameControlPanel: {
        marginTop: 90,
        background: 'url("/assets/images/slot/panelbg.png")',
        width: 400,
        padding: '21px 14px 24px 11px',
        backgroundSize: '100% 100%',
        flex: 'none',
        "@media (max-width: 1715px)": {
            width: 300,
            marginTop: 80
        },
        "@media (max-width: 1507px)": {
            marginTop: 70
        },
        "@media (max-width: 1362px)": {
            width: '100%',
            background: '#1f1e25'
        },
        "@media (max-width: 940px)": {
            marginTop: 20
        }
    },
    BetTypeBox: {
        background: 'url("/assets/images/slot/selectbg.png")',
        width: '100%',
        height: 68,
        padding: '11px 38px 10px 23px',
        marginBottom: 11,
        gap: 9,
        display: 'flex',
        backgroundSize: '100% 100%',
    },
    BetTypeButton: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        fontFamily: 'Styrene A Web',
        fontSize: 14,
        lineHeight: '18px',
        fontWeight: 700,
        color: '#FFF',
        textTransform: 'uppercase',
        background: 'transparent'
    },
    SelectedBg: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)'
    },
    BetAmountBox: {
        marginBottom: 15,
    },
    CommonLabel: {
        fontFamily: 'Styrene A Web',
        fontSize: 14,
        lineHeight: '18px',
        color: '#FFF',
        fontWeight: 400,
        textTransform: 'uppercase',
        marginBottom: 8
    },
    InputBackground: {
        background: 'url("/assets/images/slot/inputbg.png")',
        backgroundSize: '100% 100%',
        width: '100%',
        height: 55
    },
    BetButton: {
        background: 'url("/assets/images/slot/betbuttonbg.png")',
        backgroundSize: '100% 100%',
        width: '100%',
        height: 70,
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 21,
        lineHeight: '27px',
        color: '#FFF',
        textTransform: 'uppercase'
    },
    InputBox: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 15,
        paddingTop: 2
    },
    CurrencyIcon: {
        width: 25,
        height: 25
    },
    BetAmountInput: {
        width: '100%',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: '#FFFFFF',
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 14,
        lineHeight: '18px',
        paddingLeft: 8,
        height: '100%'
    },
    AmountActionBox: {
        display: 'flex',
        height: '100%'
    },
    AmountActionButton: {
        backgroundColor: '#4D3C6A',
        width: 55,
        minWidth: 55,
        borderRadius: 0,
        fontFamily: 'Styrene A Web',
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: 14,
        lineHeight: "16px",
        textTransform: "uppercase",
        color: "#FFF",
        height: '100%'
    },
    AmountMiddleButton: {
        backgroundColor: '#734FA1'
    },
    CustomSelect: {
        boxSizing: "border-box",
        width: "100%",
        height: 55,
        border: "none",
        borderRadius: 0,
        background: "transparent",
        color: '#FFF',
        "&>svg.MuiSvgIcon-root": {
            color: '#FFF'
        },
        "&>.MuiSelect-select": {
            background: 'transparent',
            color: '#FFF',
            fontSize: 14,
            fontWeight: 700,
            padding: '0px 10px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 5
        },
        "&>.Mui-disabled": {
            "-webkit-text-fill-color": 'unset',
            opacity: '0.6'
        }
    },
    CustomMenuItem: {
        color: '#FFF',
        display: 'flex',
        gap: 5,
        fontSize: 14,
        fontWeight: 700
    },
    GamePlayBox: {
        width: 977,
        height: 726,
        backgroundSize: '100% 100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        "@media (max-width: 1715px)": {
            width: 877,
            height: 651.7
        },
        "@media (max-width: 1507px)": {
            width: 777,
            height: 577.4
        },
        "@media (max-width: 1362px)": {
            width: 'calc(100vw - 323px)',
            height: 'calc((100vw - 323px) * 0.74)'
        },
        "@media (max-width: 940px)": {
            width: '100vw',
            height: '74vw',
            marginTop: 20
        }
    },
    PixiRefBox: {
        width: '100%',
        height: '100%',
        "&>canvas": {
            width: '100%',
            height: '100%'
        }
    }
}));

export var gameApp = null;

const BET_TYPE = { manual: 0, auto: 1 };
const TOTAL_LINES = 3; // Only 3 horizontal lines supported by contract

const SlotGame = () => {
    const classes = useStyles();
    const pixiRef = useRef(null);
    const { addToast } = useToasts();
    const { playSlot, account, isPending } = useOneDeal();
    const currentAccount = useCurrentAccount();

    const setting = { min: 0.01, max: 1000 };
    const [betType, setBetType] = useState(BET_TYPE.manual);
    const [remainAutoRound, setRemainAutoRound] = useState(0);
    const [playLoading, setPlayLoading] = useState(false);

    const [betAmount, setBetAmount] = useState(setting.min);
    const [linesCount, setLinesCount] = useState(TOTAL_LINES)
    const [autoCount, setAutoCount] = useState(1);

    const [soundEvent, setSoundEvent] = useState(null);
    const [playReelSound] = useSound(ReelSound);
    const [playMatchSound] = useSound(MatchSound);
    const [playWinSound] = useSound(WinSound);
    const [playClickSound] = useSound(ClickSound);

    useEffect(() => {
        window.addEventListener('message', onWindowMessage);
        window.addEventListener("resize", resizeHandler);

        gameApp = new SlotApp({
            backgroundColor: 0x000000,
            backgroundAlpha: 0,
            antialiasing: true,
            autoDensity: true
        });
        pixiRef.current.appendChild(gameApp.view);
        gameApp.startGame();
        
        // Set currency to OCT
        gameApp.updateCurrency({ coinType: 'OCT' });

        resizeHandler();

        return () => {
            window.removeEventListener('message', onWindowMessage);
            window.removeEventListener("resize", resizeHandler);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (gameApp !== null && currentAccount) {
            // Set on-chain callback when wallet is connected
            gameApp.setPlaySlotCallback(playSlot);
            
            gameApp.updateAuthData({
                isAuth: !!currentAccount,
                userData: currentAccount ? { _id: currentAccount.address } : null
            });
        } else if (gameApp !== null && !currentAccount) {
            // Clear callback when wallet is disconnected
            gameApp.setPlaySlotCallback(null);
            
            gameApp.updateAuthData({
                isAuth: false,
                userData: null
            });
        }
    }, [currentAccount, playSlot]);

    useEffect(() => {
        if (soundEvent !== null) {
            if (soundEvent?.data?.data === 'reel')
                playReelSound();
            if (soundEvent?.data?.data === 'match')
                playMatchSound();
            if (soundEvent?.data?.data === 'win')
                playWinSound();
        }
        // eslint-disable-next-line
    }, [soundEvent]);

    const resizeHandler = () => {
        if (!gameApp)
            return;

        const parent = document.getElementsByClassName(classes.GamePlayBox);
        gameApp.onResize(parent[0].clientWidth, parent[0].clientHeight);
    }

    const onWindowMessage = (event) => {
        if (event?.data?.type === 'playzelo-Slot-UpdateLoading') {
            setPlayLoading(event.data.data);
        }
        if (event?.data?.type === 'playzelo-Slot-UpdateGameState') {
            // Balance will be updated by App.js
        }
        if (event?.data?.type === 'playzelo-Slot-Sound') {
            setSoundEvent(event);
        }
        if (event?.data?.type === 'playzelo-Slot-Error') {
            addToast(event.data.data, { appearance: 'error', autoDismiss: true });
        }
        if (event?.data?.type === 'playzelo-Slot-Win') {
            addToast(event.data.data, { appearance: 'success', autoDismiss: true });
        }
        if (event?.data?.type === 'playzelo-Slot-Lose') {
            addToast(event.data.data, { appearance: 'info', autoDismiss: true });
        }
    };

    const handleBet = () => {
        if (!account) {
            addToast('Please connect your wallet first', { appearance: 'warning', autoDismiss: true });
            return;
        }
        
        if (gameApp !== null) {
            playClickSound();
            gameApp.updateBetLines(linesCount);
            gameApp.updateBetAmount(betAmount);
            gameApp.updateAutoCount(0);
            gameApp.bet();
        }
    };

    const handleAutoBet = () => {
        if (!account) {
            addToast('Please connect your wallet first', { appearance: 'warning', autoDismiss: true });
            return;
        }
        
        if (gameApp !== null) {
            playClickSound();
            gameApp.updateBetLines(linesCount);
            gameApp.updateBetAmount(betAmount);
            gameApp.updateAutoCount(autoCount - 1);
            gameApp.bet();
        }
    };

    const handleStopAutoBet = () => {
        setRemainAutoRound(0);
    };

    const handleAmountAction = (type) => {
        switch (type) {
            case 0:
                setBetAmount(betAmount / 2);
                break;
            case 1:
                setBetAmount(betAmount * 2);
                break;
            case 2:
                setBetAmount(setting.max);
                break;
            default:
                break;
        }
    };

    const handleLineCount = (e) => {
        setLinesCount(e.target.value);
    }

    return (
        <Box className={classes.MainContainer}>
            <BackButton />
            <Box className={classes.GamePanel}>
                <SettingBox />
                <Box className={classes.GameMainBox}>
                    <Box className={classes.GameControlPanel}>
                        <Box className={classes.BetTypeBox}>
                            <Button
                                disabled={playLoading}
                                className={clsx(classes.BetTypeButton, betType === 0 ? classes.SelectedBg : '')}
                                onClick={() => setBetType(0)}
                            >
                                Manual
                            </Button>
                            <Button
                                disabled={playLoading}
                                className={clsx(classes.BetTypeButton, betType === 1 ? classes.SelectedBg : '')}
                                onClick={() => setBetType(1)}
                            >
                                Auto
                            </Button>
                        </Box>
                        <Box className={classes.BetAmountBox}>
                            <Typography className={classes.CommonLabel}>Bet Amount</Typography>
                            <Box className={classes.InputBackground}>
                                <Box className={classes.InputBox}>
                                    <img className={classes.CurrencyIcon} src={`/assets/images/coins/oct.png`} alt="OCT" />
                                    <input disabled={playLoading || isPending} type="number" value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} className={classes.BetAmountInput} />
                                    <Box className={classes.AmountActionBox}>
                                        <Button disabled={playLoading || isPending} onClick={() => handleAmountAction(0)} className={classes.AmountActionButton}>1/2</Button>
                                        <Button disabled={playLoading || isPending} onClick={() => handleAmountAction(1)} className={clsx(classes.AmountActionButton, classes.AmountMiddleButton)}>2X</Button>
                                        <Button disabled={playLoading || isPending} onClick={() => handleAmountAction(2)} className={classes.AmountActionButton}>Max</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        {/* <Box className={classes.BetAmountBox}>
                            <Typography className={classes.CommonLabel}>Risk</Typography>
                            <Box className={classes.InputBackground}>
                                <FormControl fullWidth>
                                    <Select
                                        labelId="riskType"
                                        id="riskType"
                                        value={risk}
                                        onChange={handleRisk}
                                        className={classes.CustomSelect}
                                        disabled={!authData.isAuth || playLoading}
                                    >
                                        {
                                            Object.keys(RISKS).map((key, index) => (
                                                <MenuItem key={index} value={RISKS[key]} className={classes.CustomMenuItem}>
                                                    {key}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box> */}
                        <Box className={classes.BetAmountBox}>
                            <Typography className={classes.CommonLabel}>Rows</Typography>
                            <Box className={classes.InputBackground}>
                                <FormControl fullWidth>
                                    <Select
                                        labelId="rowsCount"
                                        id="rowsCount"
                                        value={linesCount}
                                        onChange={handleLineCount}
                                        className={classes.CustomSelect}
                                        disabled={!account || playLoading || isPending}
                                    >
                                        {
                                            new Array(TOTAL_LINES).fill(0).map((value, index) => (
                                                <MenuItem key={index} value={index + 1} className={classes.CustomMenuItem}>
                                                    {index + 1}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        {
                            (betType === BET_TYPE.auto) &&
                            <Box className={classes.BetAmountBox}>
                                <Typography className={classes.CommonLabel}>Number of Bets</Typography>
                                <Box className={classes.InputBackground}>
                                    <input disabled={playLoading || isPending} type="number" value={autoCount} onChange={(e) => setAutoCount(Number(e.target.value))} className={classes.BetAmountInput} />
                                </Box>
                            </Box>
                        }
                        {
                            betType === BET_TYPE.manual &&
                            <LoadingButton 
                                loading={playLoading || isPending} 
                                onClick={handleBet} 
                                className={classes.BetButton}
                                disabled={!account}
                            >
                                {account ? 'Bet' : 'Connect Wallet'}
                            </LoadingButton>
                        }
                        {
                            (betType === BET_TYPE.auto && remainAutoRound <= 0) &&
                            <Button onClick={handleAutoBet} className={classes.BetButton}>
                                Start Auto Bet
                            </Button>
                        }
                        {
                            (betType === BET_TYPE.auto && remainAutoRound > 0) &&
                            <Button onClick={handleStopAutoBet} className={classes.BetButton}>
                                Stop Auto Bet
                            </Button>
                        }
                    </Box>
                    <Box className={classes.GamePlayBox}>
                        <Box className={classes.PixiRefBox} ref={pixiRef}>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.HistoryTable}>
                <HistoryBox />
            </Box>
        </Box>
    );
}

export default SlotGame;