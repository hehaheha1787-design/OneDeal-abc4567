import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useState, useEffect } from "react";

import { useToasts } from "react-toast-notifications";
import { useOneDeal } from "hooks/useOneDeal";
import SettingBox from "views/components/setting";
import HistoryBox from "./components/HistoryBox";
import Turtle_Red_Idle from "assets/images/turtle_red_idle.png";
import Turtle_Red_Run from "assets/images/turtle_red_run.png";
import Turtle_Blue_Idle from "assets/images/turtle_blue_idle.png";
import Turtle_Blue_Run from "assets/images/turtle_blue_run.png";
import Turtle_Yellow_Idle from "assets/images/turtle_yellow_idle.png";
import Turtle_Yellow_Run from "assets/images/turtle_yellow_run.png";
import { LoadingButton } from "@mui/lab";
import BackButton from "components/BackButton";

const MaxAmount = 1000;

const useStyles = makeStyles(() => ({
    TurtleLayout: {
        width: '100%',
        paddingRight: '50px',
        "@media (max-width: 940px)": {
            padding: '0px'
        }
    },
    TurtleGameLayout: {
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        gap: '16px',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundImage: 'url("/assets/images/turtle/Main_Bg.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '829px',
        padding: '22px 0px 0px 22px',
        borderRadius: '30px',
        position: 'relative',
        "@media (max-width: 1444px)": {
            padding: '0px',
            borderRadius: '0px',
            height: 520
        }
    },
    HistoryBox: {
        margin: '24px auto 0',
        color: '#f0ecff'
    },
    AnimationBox: {
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        padding: '24px 32px 0px',
        flexDirection: 'column',
        width: '100%',
        "@media (max-width: 1444px)": {
            padding: '24px 0px 0px'
        }
    },
    AnimationLine: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: '150px',
        width: '100%',
        "@media (max-width: 1444px)": {
            height: 68.65
        }
    },
    FlagBox: {
        position: 'relative',
        marginLeft: 'auto',
        "&>img": {
            height: '100px',
            width: '74px',
            "@media (max-width: 1444px)": {
                width: 50,
                height: 67
            }
        }
    },
    ResultNumber: {
        position: 'absolute',
        top: '15px',
        left: '-20px',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        fontFamily: "'Styrene A Web'",
        fontWeight: 900,
        fontSize: "21px",
        color: "#FFFFFF",
        "@media (max-width: 1444px)": {
            width: 22,
            height: 22,
            fontSize: 14
        }
    },
    YellowBox: { backgroundColor: '#E1B600' },
    RedBox: { backgroundColor: '#E40253' },
    BlueBox: { backgroundColor: '#005CF3' },
    TurtleYellowIdle: {
        width: 156,
        "@media (max-width: 1444px)": { width: 93 }
    },
    TurtleYellowRun: {
        width: 158,
        marginTop: 30,
        marginLeft: -158,
        "@media (max-width: 1444px)": {
            width: 94.2,
            marginLeft: -94.2,
            marginTop: 16
        }
    },
    TurtleRedIdle: {
        width: 156,
        "@media (max-width: 1444px)": { width: 93 }
    },
    TurtleRedRun: {
        width: 159,
        marginTop: 30,
        marginLeft: -159,
        "@media (max-width: 1444px)": {
            width: 94.8,
            marginLeft: -94.8,
            marginTop: 16
        }
    },
    TurtleBlueIdle: {
        width: 158,
        "@media (max-width: 1444px)": { width: 94.2 }
    },
    TurtleBlueRun: {
        width: 162,
        marginTop: 30,
        marginLeft: -162,
        "@media (max-width: 1444px)": {
            width: 96.6,
            marginLeft: -96.6,
            marginTop: 16
        }
    },
    FirstAnimation: {
        transition: 'margin 3s ease-out',
        marginLeft: 'calc(100% - 162px - 50px - 20px - 162px) !important',
        "@media (max-width: 1444px)": {
            marginLeft: 'calc(100% - 96.6px - 50px - 20px - 96.6px) !important'
        }
    },
    SecondAnimation: {
        transition: 'margin 3.5s ease-out',
        marginLeft: 'calc(100% - 162px - 50px - 20px - 162px) !important',
        "@media (max-width: 1444px)": {
            marginLeft: 'calc(100% - 96.6px - 50px - 20px - 96.6px) !important'
        }
    },
    ThirdAnimation: {
        transition: 'margin 4s ease-out',
        marginLeft: 'calc(100% - 162px - 50px - 20px - 162px) !important',
        "@media (max-width: 1444px)": {
            marginLeft: 'calc(100% - 96.6px - 50px - 20px - 96.6px) !important'
        }
    },
    BetInputBoxContainer: {
        maxWidth: '653px',
        width: '653px',
        height: '243px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("/assets/images/turtle/Action_Bg.png")',
        backgroundSize: '100% 243px',
        marginLeft: 'auto',
        marginRight: 'auto',
        "@media (max-width: 1444px)": {
            width: '100%',
            maxWidth: '100%',
            height: 150
        }
    },
    BetInputBoxWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        flexDirection: 'column',
        "@media (max-width: 1444px)": { gap: '8px' }
    },
    TurtleSelectBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
    },
    TurtleButton: {
        display: 'flex',
        width: '179px',
        height: '48px',
        borderRadius: '4px',
        color: '#FFF',
        fontFamily: 'Styrene A Web',
        fontWeight: '900',
        fontSize: '15px',
        justifyContent: 'space-between',
        backgroundSize: '100% 100%',
        textTransform: 'uppercase',
        "&>div": {
            backgroundImage: 'url("/assets/images/turtle/Payout_Amount.png")',
            backgroundSize: '69px 32.5px',
            color: '#1F1E25',
            fontWeight: '700',
            fontSize: '17px',
            width: '69px',
            height: '32.5px',
            "@media (max-width: 1444px)": {
                height: 22,
                fontSize: 12
            }
        },
        "@media (max-width: 1444px)": { height: 33 }
    },
    YellowButton: {
        backgroundImage: 'url("/assets/images/turtle/Payout_Yellow.png")',
    },
    ActivedYellow: {
        boxShadow: '0 0 24px #ff9314',
        opacity: '1'
    },
    RedButton: {
        backgroundImage: 'url("/assets/images/turtle/Payout_Red.png")'
    },
    ActivedRed: {
        boxShadow: '0 0 24px #f23068',
        opacity: '1'
    },
    BlueButton: {
        backgroundImage: 'url("/assets/images/turtle/Payout_Blue.png")'
    },
    ActivedBlue: {
        boxShadow: '0 0 24px #0d42ff',
        opacity: '1'
    },
    AmountInputBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '4px',
        width: '100%',
        backgroundImage: 'url("/assets/images/turtle/Bet_Amount.png")',
        backgroundSize: 'cover'
    },
    BetAmountInput: {
        color: '#fff',
        background: 'unset',
        border: 'unset',
        width: '100%',
        fontSize: '18px',
        fontWeight: 'bold',
        outline: 'none',
        padding: '1px'
    },
    InputActionButtons: {
        fontSize: '16px',
        height: '56px',
        backgroundColor: '#7A5C5C',
        color: '#FFF',
        padding: '0px',
        minWidth: '48px',
        width: '67px',
        borderRadius: '0px',
        "@media (max-width: 1444px)": {
            height: 33,
            width: 40,
            minWidth: 40
        }
    },
    BetButtonsBox: {
        width: '100%',
        height: '53px',
        backgroundImage: 'url("/assets/images/turtle/Button_Play.png")',
        backgroundSize: '100% 100%',
        "@media (max-width: 1444px)": { height: 33 }
    },
    BetButton: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: '16px',
        color: '#FFFFFF'
    },
    InputBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginLeft: '20px',
        "&>img": {
            width: '40px',
            height: '40px',
            "@media (max-width: 1444px)": {
                width: 30,
                height: 30
            }
        }
    }
}));

const TurtleRaceWidget = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const { playTurtle, account, isPending } = useOneDeal();

    const [turtleNum, setTurtleNum] = useState(0);
    const [betAmount, setBetAmount] = useState(1);
    const [racing, setRacing] = useState(false);
    const [raceResult, setRaceResult] = useState(null);
    const [betHistory, setBetHistory] = useState([]);
    const [animationKey, setAnimationKey] = useState(0); // Force re-render for animation reset

    useEffect(() => {
        if (betAmount > MaxAmount) setBetAmount(MaxAmount);
    }, [betAmount]);

    useEffect(() => {
        if (raceResult) {
            setRacing(true);
            
            // 根据winner决定哪个乌龟第一名
            const winner = raceResult.winner; // 0=Yellow, 1=Red, 2=Blue
            
            // 创建一个数组来存储每个乌龟的名次
            // turtlePositions[i] 表示第 i 只乌龟的名次 (0=第一, 1=第二, 2=第三)
            const turtlePositions = [1, 1, 1]; // 默认都是第二名
            
            // 设置赢家为第一名
            turtlePositions[winner] = 0;
            
            // 随机分配其他两只乌龟的名次
            const otherTurtles = [0, 1, 2].filter(i => i !== winner);
            const otherPositions = [1, 2].sort(() => Math.random() - 0.5);
            turtlePositions[otherTurtles[0]] = otherPositions[0];
            turtlePositions[otherTurtles[1]] = otherPositions[1];
            
            console.log('Turtle positions:', {
                winner,
                yellow: turtlePositions[0],
                red: turtlePositions[1],
                blue: turtlePositions[2]
            });
            
            setTimeout(() => {
                const yellowEl = document.getElementById(`Turtle-Yellow-${animationKey}`);
                const redEl = document.getElementById(`Turtle-Red-${animationKey}`);
                const blueEl = document.getElementById(`Turtle-Blue-${animationKey}`);
                
                if (yellowEl && redEl && blueEl) {
                    // 根据每只乌龟的名次添加对应的动画类
                    yellowEl.classList.add(
                        turtlePositions[0] === 0 ? classes.FirstAnimation : 
                        turtlePositions[0] === 1 ? classes.SecondAnimation : 
                        classes.ThirdAnimation
                    );
                    redEl.classList.add(
                        turtlePositions[1] === 0 ? classes.FirstAnimation : 
                        turtlePositions[1] === 1 ? classes.SecondAnimation : 
                        classes.ThirdAnimation
                    );
                    blueEl.classList.add(
                        turtlePositions[2] === 0 ? classes.FirstAnimation : 
                        turtlePositions[2] === 1 ? classes.SecondAnimation : 
                        classes.ThirdAnimation
                    );
                }
            }, 50);

            // 4秒后显示结果
            setTimeout(() => {
                setRacing(false);
                setBetHistory(prev => [raceResult.winner, ...prev.slice(0, 9)]);
            }, 4000);
        }
    }, [raceResult, animationKey, classes]);

    const handleBet = async () => {
        if (!account) {
            addToast('Please connect your wallet first', { appearance: 'warning', autoDismiss: true });
            return;
        }

        try {
            // 重置动画 - 增加 key 强制重新渲染
            setAnimationKey(prev => prev + 1);
            setRaceResult(null);
            
            const betAmountInSmallestUnit = Math.floor(betAmount * 1e9);
            
            console.log('Playing turtle race:', { betAmount: betAmountInSmallestUnit, turtle: turtleNum });
            
            const result = await playTurtle(betAmountInSmallestUnit, turtleNum);
            console.log('Turtle race result:', result);
            console.log('Result keys:', Object.keys(result));
            console.log('Effects:', result.effects);
            console.log('RawEffects:', result.rawEffects);

            // 从链上事件解析结果
            let winner = 0;
            let won = false;
            
            // 尝试从不同位置获取events
            const events = result.events || result.effects?.events || [];
            console.log('Events found:', events);
            
            if (events && events.length > 0) {
                console.log('All events:', events);
                
                // 查找 TurtleResultEvent
                const turtleEvent = events.find(e => 
                    e.type && e.type.includes('::casino::TurtleResultEvent')
                );
                
                if (turtleEvent && turtleEvent.parsedJson) {
                    console.log('Raw turtle event:', turtleEvent.parsedJson);
                    winner = parseInt(turtleEvent.parsedJson.winner);
                    // 确保won是boolean类型
                    won = turtleEvent.parsedJson.won === true || turtleEvent.parsedJson.won === 'true';
                    console.log('Parsed event:', { 
                        winner, 
                        won, 
                        wonRaw: turtleEvent.parsedJson.won,
                        wonType: typeof turtleEvent.parsedJson.won,
                        chosenTurtle: turtleNum,
                        match: winner === turtleNum
                    });
                } else {
                    console.error('TurtleResultEvent not found in events');
                }
            } else {
                console.error('No events found in result');
            }

            setRaceResult({ winner, won });

            if (won) {
                addToast(`You won ${(betAmount * 2.8).toFixed(4)} OCT!`, { appearance: 'success', autoDismiss: true });
            } else {
                addToast(`You lost ${betAmount.toFixed(4)} OCT`, { appearance: 'error', autoDismiss: true });
            }

        } catch (error) {
            console.error('Turtle race error:', error);
            addToast(error.message || 'Transaction failed', { appearance: 'error', autoDismiss: true });
        }
    };

    return (
        <Box className={classes.TurtleLayout}>
            <BackButton />
            <Box className={classes.TurtleGameLayout}>
                <SettingBox />
                <Box className={classes.AnimationBox}>
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }} key={animationKey}>
                        <Box className={classes.AnimationLine}>
                            <img src={Turtle_Yellow_Idle} alt="turtle" className={classes.TurtleYellowIdle} style={{ opacity: racing ? 0 : 1 }} />
                            <img id={`Turtle-Yellow-${animationKey}`} src={Turtle_Yellow_Run} alt="turtle" className={classes.TurtleYellowRun} style={{ opacity: racing ? 1 : 0 }} />
                            <Box className={classes.FlagBox}>
                                <img src="/assets/images/turtle/Flag_Yellow.png" alt='flag' />
                                {raceResult && !racing && raceResult.winner === 0 && (
                                    <Box className={clsx(classes.ResultNumber, classes.YellowBox)}>1</Box>
                                )}
                            </Box>
                        </Box>
                        <Box className={classes.AnimationLine}>
                            <img src={Turtle_Red_Idle} alt="turtle" className={classes.TurtleRedIdle} style={{ opacity: racing ? 0 : 1 }} />
                            <img id={`Turtle-Red-${animationKey}`} src={Turtle_Red_Run} alt="turtle" className={classes.TurtleRedRun} style={{ opacity: racing ? 1 : 0 }} />
                            <Box className={classes.FlagBox}>
                                <img src="/assets/images/turtle/Flag_Red.png" alt='flag' />
                                {raceResult && !racing && raceResult.winner === 1 && (
                                    <Box className={clsx(classes.ResultNumber, classes.RedBox)}>1</Box>
                                )}
                            </Box>
                        </Box>
                        <Box className={classes.AnimationLine}>
                            <img src={Turtle_Blue_Idle} alt="turtle" className={classes.TurtleBlueIdle} style={{ opacity: racing ? 0 : 1 }} />
                            <img id={`Turtle-Blue-${animationKey}`} src={Turtle_Blue_Run} alt="turtle" className={classes.TurtleBlueRun} style={{ opacity: racing ? 1 : 0 }} />
                            <Box className={classes.FlagBox}>
                                <img src="/assets/images/turtle/Flag_Blue.png" alt='flag' />
                                {raceResult && !racing && raceResult.winner === 2 && (
                                    <Box className={clsx(classes.ResultNumber, classes.BlueBox)}>1</Box>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Box className={classes.BetInputBoxContainer}>
                        <Box className={classes.BetInputBoxWrapper}>
                            <Box className={classes.TurtleSelectBox}>
                                <Button 
                                    disabled={racing || isPending} 
                                    onClick={() => setTurtleNum(0)} 
                                    className={clsx(classes.TurtleButton, classes.YellowButton, turtleNum === 0 ? classes.ActivedYellow : '')}
                                >
                                    <span>Yellow</span>
                                    <Box>2.8x</Box>
                                </Button>
                                <Button 
                                    disabled={racing || isPending} 
                                    onClick={() => setTurtleNum(1)} 
                                    className={clsx(classes.TurtleButton, classes.RedButton, turtleNum === 1 ? classes.ActivedRed : '')}
                                >
                                    <span>Red</span>
                                    <Box>2.8x</Box>
                                </Button>
                                <Button 
                                    disabled={racing || isPending} 
                                    onClick={() => setTurtleNum(2)} 
                                    className={clsx(classes.TurtleButton, classes.BlueButton, turtleNum === 2 ? classes.ActivedBlue : '')}
                                >
                                    <span>Blue</span>
                                    <Box>2.8x</Box>
                                </Button>
                            </Box>
                            <Box className={classes.BetButtonsBox}>
                                <LoadingButton 
                                    className={classes.BetButton} 
                                    onClick={handleBet} 
                                    loading={racing || isPending}
                                    disabled={!account}
                                >
                                    {account ? 'Race' : 'Connect Wallet'}
                                </LoadingButton>
                            </Box>
                            <Box className={classes.AmountInputBox}>
                                <Box className={classes.InputBox}>
                                    <img src="/assets/images/coins/oct.png" alt="oct" />
                                    <input 
                                        value={betAmount} 
                                        onChange={(e) => setBetAmount(Number(e.target.value))} 
                                        className={classes.BetAmountInput} 
                                        disabled={racing || isPending}
                                        type="number"
                                    />
                                </Box>
                                <Box style={{ flex: 'none' }}>
                                    <Button disabled={racing || isPending} className={classes.InputActionButtons} style={{ background: '#4D3C6A' }} onClick={() => setBetAmount(betAmount / 2)}>½</Button>
                                    <Button disabled={racing || isPending} className={classes.InputActionButtons} onClick={() => setBetAmount(betAmount * 2)}>2x</Button>
                                    <Button disabled={racing || isPending} className={classes.InputActionButtons} style={{ background: '#4D3C6A' }} onClick={() => setBetAmount(MaxAmount)}>Max</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.HistoryBox}>
                <HistoryBox history={betHistory} />
            </Box>
        </Box>
    );
};

export default TurtleRaceWidget;
