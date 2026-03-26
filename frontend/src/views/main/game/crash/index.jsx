import { Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HistoryBox from "./utils/HistoryBox";
import SettingBox from "views/components/setting";
import { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { LoadingButton } from "@mui/lab";
import { CrashApp } from "./CrashApp";
import { BET_STATUS } from "./data/Constant";
import useSound from "use-sound";
import BgSound from "assets/sounds/crash/background.mp3";
import ExplosionSound from "assets/sounds/crash/explosion.mp3";
import FlyingSound from "assets/sounds/crash/flying.mp3";
import ClickSound from "assets/sounds/slot/click.mp3";
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
        background: '#2C2C3A',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        position: 'relative',
        "@media (max-width: 940px)": {
            borderRadius: '0px',
        },
        "@media (max-width: 1560px)": {
            backgroundImage: 'unset',
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
        gap: 17,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 32px)',
        "@media (max-width: 1560px)": {
            flexDirection: 'column-reverse',
            top: 0,
            left: 0,
            width: '100%',
            transform: 'translate(0)',
            position: 'relative'
        },
    },
    GameControlPanel: {
        background: 'url("/assets/images/crash/panelbg.png")',
        maxWidth: 401,
        width: '100%',
        padding: '21px 14px 24px 11px',
        backgroundSize: '100% 100%',
        "@media (max-width: 1560px)": {
            maxWidth: 'unset',
            width: '100%'
        },
        "@media (max-width: 1210px)": {
            marginTop: '-185px'
        },
        "@media (max-width: 940px)": {
            marginTop: '0px'
        },
        "@media (max-width: 888px)": {
            marginTop: '-185px'
        },
        "@media (max-width: 685px)": {
            marginTop: '-36.45vw'
        }
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
        background: 'url("/assets/images/crash/inputbg.png")',
        backgroundSize: '100% 100%',
        width: '100%',
        height: 55
    },
    BetButton: {
        background: 'url("/assets/images/crash/betbuttonbg.png")',
        backgroundSize: '100% 100%',
        width: '100%',
        height: 70,
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 21,
        lineHeight: '27px',
        color: '#FFF',
        textTransform: 'uppercase',
        display: 'flex',
        flexDirection: 'column'
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
    GamePlayBox: {
        flex: 'none',
        width: 1128,
        height: 771,
        backgroundSize: '100% 100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        "@media (max-width: 1800px)": {
            width: 1008
        },
        "@media (max-width: 1680px)": {
            width: 888
        },
        "@media (max-width: 1560px)": {
            width: '100%',
        },
        "@media (max-width: 685px)": {
            height: '150vw'
        }
    },
    PixiRefBox: {
        width: '100%',
        height: '100%',
        "&>canvas": {
            width: '100%',
            height: '100%'
        }
    },
}));

export var gameApp = null;

const CrashGame = () => {
    const classes = useStyles();
    const { addToast } = useToasts();

    const pixiRef = useRef(null);
    const gameIdRef = useRef(null);

    const account = useCurrentAccount();
    const { playCrash, cashoutCrash, isPending } = useOneDeal();

    const settingData = useSelector((state) => state.settingOption);

    const [soundEvent, setSoundEvent] = useState(null);
    const [playBgSound, bgSoundOption] = useSound(BgSound);
    const [playExplosionSound] = useSound(ExplosionSound);
    const [playFlyingSound] = useSound(FlyingSound);
    const [playClickSound] = useSound(ClickSound);

    const setting = { min: 1, max: 1000 };
    const [betStatus, setBetStatus] = useState(BET_STATUS.BET);
    const [betAmount, setBetAmount] = useState(setting.min);
    const [currentMultiplier, setCurrentMultiplier] = useState(100);

    useEffect(() => {
        window.addEventListener('message', onWindowMessage);
        window.addEventListener("resize", resizeHandler);

        gameApp = new CrashApp({
            backgroundColor: 0x000000,
            backgroundAlpha: 0,
            antialiasing: true,
            autoDensity: true
        });
        pixiRef.current.appendChild(gameApp.view);
        gameApp.startGame();

        resizeHandler();

        return () => {
            window.removeEventListener('message', onWindowMessage);
            window.removeEventListener("resize", resizeHandler);
            bgSoundOption.stop();
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (settingData.sound && settingData.backgroundSound) {
            playBgSound();
        }
        if (!settingData.sound || !settingData.backgroundSound) {
            bgSoundOption.stop();
        }
        return () => {
            bgSoundOption.stop();
        }
        // eslint-disable-next-line
    }, [settingData]);

    useEffect(() => {
        if (soundEvent !== null) {
            if (soundEvent?.data?.data === 'explosion')
                playEffectSound(playExplosionSound);
            if (soundEvent?.data?.data === 'flying')
                playEffectSound(playFlyingSound);
        }
        // eslint-disable-next-line
    }, [soundEvent]);

    const playEffectSound = (soundPlay) => {
        if (settingData.sound && settingData.effectSound) {
            soundPlay();
        }
    };

    const onWindowMessage = (event) => {
        if (event?.data?.type === 'playzelo-Crash-Sound') {
            setSoundEvent(event);
        }
    };

    const resizeHandler = () => {
        if (!gameApp)
            return;

        const parent = document.getElementsByClassName(classes.GamePlayBox);
        gameApp.onResize(parent[0].clientWidth, parent[0].clientHeight);
    }

    const handleBet = async () => {
        if (!account) {
            addToast('Please connect wallet', { appearance: 'warning', autoDismiss: true });
            return;
        }

        playEffectSound(playClickSound);

        try {
            const betAmountInOCT = Math.floor(betAmount * 1_000_000_000);
            console.log('Starting crash game with bet:', betAmountInOCT);
            
            const result = await playCrash(betAmountInOCT);
            console.log('Crash game result:', result);

            // 检查交易是否成功
            if (result.effects?.status?.status !== 'success') {
                throw new Error('Transaction failed: ' + (result.effects?.status?.error || 'Unknown error'));
            }

            // 从 objectChanges 中获取创建的 CrashGame 对象
            const createdObject = result.objectChanges?.find(
                change => change.type === 'created' && change.objectType.includes('::casino::CrashGame')
            );

            console.log('Created CrashGame object:', createdObject);

            if (createdObject) {
                gameIdRef.current = createdObject.objectId;
                setBetStatus(BET_STATUS.CASHOUT);
                
                // 开始游戏动画
                if (gameApp !== null) {
                    gameApp.setNeedSound(true);
                    gameApp.countDown(0);
                }

                // 模拟飞行过程
                startFlying();
                
                addToast('Crash game started!', { appearance: 'info', autoDismiss: true });
            } else {
                console.error('No CrashGame object created');
                addToast('Failed to start game - no game object created', { 
                    appearance: 'error', 
                    autoDismiss: true 
                });
            }
        } catch (error) {
            console.error('Crash play error:', error);
            addToast(error.message || 'Transaction failed', { 
                appearance: 'error', 
                autoDismiss: true 
            });
        }
    };

    const startFlying = () => {
        let multiplier = 100;
        const interval = setInterval(() => {
            multiplier += 5;
            setCurrentMultiplier(multiplier);
            
            if (gameApp !== null) {
                const time = (multiplier - 100) / 100;
                gameApp.fly(multiplier / 100, time);
            }
        }, 100);

        // 存储 interval ID 以便在 cashout 时清除
        gameIdRef.currentInterval = interval;
    };

    const handleCashout = async () => {
        if (!account || !gameIdRef.current) {
            addToast('No active game', { appearance: 'warning', autoDismiss: true });
            return;
        }

        try {
            // 停止飞行动画
            if (gameIdRef.currentInterval) {
                clearInterval(gameIdRef.currentInterval);
            }

            const cashoutMultiplier = currentMultiplier;
            console.log('Cashing out at multiplier:', cashoutMultiplier, 'Game ID:', gameIdRef.current);
            
            const result = await cashoutCrash(gameIdRef.current, cashoutMultiplier);
            console.log('Cashout result:', result);

            // 检查交易是否成功
            if (result.effects?.status?.status !== 'success') {
                throw new Error('Transaction failed: ' + (result.effects?.status?.error || 'Unknown error'));
            }

            // 从事件中解析结果
            const crashEvent = result.events?.find(e => 
                e.type.includes('::casino::CrashResultEvent')
            );

            console.log('Crash event:', crashEvent);

            if (crashEvent) {
                const { crash_point, won, payout } = crashEvent.parsedJson;
                console.log('Crash result - crash_point:', crash_point, 'won:', won, 'payout:', payout);

                if (gameApp !== null) {
                    gameApp.crash(crash_point / 100);
                }

                setTimeout(() => {
                    if (gameApp !== null) {
                        gameApp.complete();
                    }
                    
                    setBetStatus(BET_STATUS.BET);
                    gameIdRef.current = null;
                    setCurrentMultiplier(100);

                    if (won) {
                        addToast(`Won ${(payout / 1_000_000_000).toFixed(4)} OCT at ${(cashoutMultiplier / 100).toFixed(2)}x!`, { 
                            appearance: 'success', 
                            autoDismiss: true 
                        });
                    } else {
                        addToast(`Crashed at ${(crash_point / 100).toFixed(2)}x!`, { 
                            appearance: 'error', 
                            autoDismiss: true 
                        });
                    }
                }, 2000);
            } else {
                console.error('No crash event found in result');
                addToast('Failed to get game result', { 
                    appearance: 'error', 
                    autoDismiss: true 
                });
                
                // 重置状态
                setBetStatus(BET_STATUS.BET);
                gameIdRef.current = null;
                setCurrentMultiplier(100);
            }
        } catch (error) {
            console.error('Crash cashout error:', error);
            addToast(error.message || 'Cashout failed', { 
                appearance: 'error', 
                autoDismiss: true 
            });
            
            // 重置状态
            if (gameIdRef.currentInterval) {
                clearInterval(gameIdRef.currentInterval);
            }
            setBetStatus(BET_STATUS.BET);
            gameIdRef.current = null;
            setCurrentMultiplier(100);
        }
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

    return (
        <Box className={classes.MainContainer}>
            <BackButton />
            <Box className={classes.GamePanel}>
                <SettingBox />
                <Box className={classes.GameMainBox}>
                    <Box className={classes.GameControlPanel}>
                        <Box className={classes.BetAmountBox}>
                            <Typography className={classes.CommonLabel}>Bet Amount</Typography>
                            <Box className={classes.InputBackground}>
                                <Box className={classes.InputBox}>
                                    <img className={classes.CurrencyIcon} src="/assets/images/coins/oct.png" alt="OCT" />
                                    <input 
                                        disabled={isPending || betStatus === BET_STATUS.CASHOUT} 
                                        type="number" 
                                        value={betAmount} 
                                        onChange={(e) => setBetAmount(e.target.value)} 
                                        className={classes.BetAmountInput} 
                                    />
                                    <Box className={classes.AmountActionBox}>
                                        <Button disabled={isPending || betStatus === BET_STATUS.CASHOUT} onClick={() => handleAmountAction(0)} className={classes.AmountActionButton}>1/2</Button>
                                        <Button disabled={isPending || betStatus === BET_STATUS.CASHOUT} onClick={() => handleAmountAction(1)} className={clsx(classes.AmountActionButton, classes.AmountMiddleButton)}>2X</Button>
                                        <Button disabled={isPending || betStatus === BET_STATUS.CASHOUT} onClick={() => handleAmountAction(2)} className={classes.AmountActionButton}>Max</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={classes.BetAmountBox}>
                            <Typography className={classes.CommonLabel}>Current Multiplier</Typography>
                            <Box className={classes.InputBackground}>
                                <Box className={classes.InputBox}>
                                    <Typography style={{color: '#FFF', fontSize: 18, fontWeight: 700}}>
                                        {(currentMultiplier / 100).toFixed(2)}x
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        {
                            betStatus === BET_STATUS.BET &&
                            <LoadingButton loading={isPending} onClick={handleBet} className={classes.BetButton}>
                                Bet
                            </LoadingButton>
                        }
                        {
                            betStatus === BET_STATUS.CASHOUT &&
                            <LoadingButton loading={isPending} onClick={handleCashout} className={classes.BetButton}>
                                Cashout
                            </LoadingButton>
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

export default CrashGame;
