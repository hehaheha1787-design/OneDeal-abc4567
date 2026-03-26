import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import clsx from "clsx";
import { LoadingButton } from "@mui/lab";
import SettingBox from "views/components/setting";
import { useOneDeal } from "hooks/useOneDeal";
import MinesPicker from "./utils/MinesPicker";
import HistoryBox from "./utils/HistoryBox";
import BackButton from "components/BackButton";

const useStyles = makeStyles(() => ({
    MinesContainer: {
        width: '100%',
        paddingRight: '50px',
        "@media (max-width: 940px)": {
            padding: '0px'
        }
    },
    GamePanelBox: {
        width: '100%',
        height: '829px',
        borderRadius: '30px',
        backgroundImage: 'url("/assets/images/mines/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        position: 'relative',
        overflow: 'hidden',
        "@media (max-width: 940px)": {
            borderRadius: '0px',
        },
        "@media (max-width: 681px)": {
            height: '641px'
        }
    },
    WolfImage: {
        position: 'absolute',
        width: '346px',
        top: '249px',
        left: 'calc((100% - 284px) / 2 - 536px)'
    },
    ManImage: {
        position: 'absolute',
        width: '388px',
        top: '38px',
        right: 'calc((100% - 388px) / 2 - 432px)'
    },
    MinesGameBox: {
        position: 'absolute',
        backgroundImage: 'url("/assets/images/mines/MinesCardBg.png")',
        width: '500px',
        height: '658px',
        top: '85px',
        backgroundSize: 'cover',
        left: 'calc((100% - 500px) / 2)',
        padding: '26px 17px 0px 19px',
        "@media (max-width: 681px)": {
            width: '100%',
            left: '0px',
            backgroundSize: '100% 100%',
            height: '562px',
            padding: '22px 15px 0px'
        }
    },
    GamePlayContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 0%',
        marginBottom: '14px'
    },
    CellContainer: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        marginBottom: '9px'
    },
    TableContainer: {
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr 1fr 1fr 1fr",
        gap: "3px",
        height: "367px",
        marginBottom: "12px",
        backgroundColor: '#3D2E69',
        padding: '3px',
        "@media (max-width: 681px)": {
            height: '314px',
            marginBottom: '10px'
        }
    },
    ActionBar: {
        display: 'flex',
        marginBottom: '8px',
        "@media (max-width: 681px)": {
            marginBottom: '7px',
        }
    },
    RandomCellButton: {
        width: '100%',
        height: '51px',
        backgroundImage: 'url("/assets/images/mines/RandomCellButton.png")',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "21px",
        lineHeight: "27px",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#FFFFFF",
        "@media (max-width: 681px)": {
            height: '44px'
        }
    },
    InfoBar: {
        padding: "8px",
        lineHeight: "20px",
        WebkitBoxAlign: "center",
        alignItems: "center",
        display: "flex",
        backgroundImage: "url('/assets/images/mines/MultipleBackground.png')",
        width: '100%',
        height: '42px',
        backgroundSize: 'cover',
        justifyContent: 'space-between',
        "@media (max-width: 681px)": {
            height: '36px'
        }
    },
    OutComes: {
        display: 'flex'
    },
    OutComesDetail: {
        display: 'flex',
        alignItems: 'center',
        color: 'rgb(236, 250, 255)',
        "&>span": {
            marginLeft: '4px',
            marginRight: '8px',
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "20px",
            textTransform: "uppercase",
            color: "#FFFFFF"
        },
        "&>img": {
            width: '16px',
            height: '16px'
        }
    },
    PayoutBox: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
        gap: '8px'
    },
    MultiplierBox: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "10px",
        lineHeight: "13px",
        textAlign: "right",
        textTransform: "uppercase",
        color: "#C68CFF",
        padding: "5px 7px",
        borderRadius: "5px",
        background: "#2C2C3A",
        WebkitBoxAlign: "center",
        alignItems: "center",
        display: "flex"
    },
    PayoutText: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "15px",
        lineHeight: "19px",
        textTransform: "uppercase",
        color: "#FFFFFF"
    },
    AmountInfo: {
        display: 'flex',
        gap: '1px',
        alignItems: 'center',
        justifyContent: 'center',
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "18px",
            textTransform: "uppercase",
            color: "#FFFFFF"
        },
        "&>img": {
            width: '32px',
            height: '32px'
        }
    },
    GameActionBar: {
        display: 'flex',
        width: '100%',
        position: 'relative'
    },
    PlayButton: {
        height: '51px',
        backgroundImage: 'url("/assets/images/mines/PlayButton.png")',
        backgroundSize: 'cover',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "21px",
        lineHeight: "27px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        width: '100%',
        "@media (max-width: 681px)": {
            height: '44px'
        }
    },
    FinishButton: {
        background: 'rgb(151 95 239)',
        color: '#FFF'
    },
    CountSelectButton: {
        background: 'linear-gradient(rgb(106 76 217) 0%, rgb(180 108 251) 100%)',
        height: '50px',
        width: '50px',
        maxWidth: '50px',
        minWidth: '50px',
        marginLeft: '5px',
        color: '#FFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0px',
        "&:disabled": {
            color: "rgb(183, 199, 208)",
            cursor: 'not-allowed',
            pointerEvents: 'auto'
        },
        "@media (max-width: 681px)": {
            height: '44px',
            width: '44px',
            minWidth: '44px'
        }
    },
    CountSelect: {
        background: '#1f1e25',
        width: '40px',
        height: '40px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        display: 'flex',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "20px",
        textTransform: "uppercase",
        color: "#FFFFFF"
    },
    BoardCell: {
        background: "rgb(40 40 54)",
        border: "1px solid #363646",
        borderRadius: "5px",
        display: "flex",
        WebkitBoxAlign: "center",
        alignItems: "center",
        WebkitBoxPack: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        opacity: 1,
        cursor: "pointer",
        transition: "opacity 0.3s ease 0s",
        padding: '0px',
        width: '89px',
        height: '70px',
        "&:hover": {
            background: 'rgb(31 30 37)',
            transition: "background 0.3s ease 0s"
        },
        "&:disabled:hover": {
            background: "rgb(40 40 54)",
        },
        "@media (max-width: 681px)": {
            width: '100%',
            height: '100%'
        }
    },
    BoardBackground: {
        backgroundImage: 'url("/assets/images/mines/NormalIcon.png")',
        backgroundSize: '50px 50px',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
        width: "100%",
        height: "100%",
        position: "absolute",
        left: "0px",
        top: "0px",
        zIndex: 1,
    },
    BombCell: {
        borderColor: 'red'
    },
    UnSelect: {
        opacity: '0.5'
    },
    TakeBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        "&>label": {
            color: '#FFF'
        }
    },
    AmountActionBox: {
        display: 'flex',
        height: '100%'
    },
    AmountActionButton: {
        padding: '0px',
        borderLeft: 'solid 1px #2c2c3a',
        "&:disabled": {
            color: "rgb(183, 199, 208)",
            cursor: 'not-allowed',
            pointerEvents: 'auto'
        },
        backgroundColor: '#4D3C6A',
        width: '55px',
        minWidth: '55px',
        borderRadius: '0px',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "16px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        height: '100%'
    },
    AmountMiddleButton: {
        backgroundColor: '#734FA1'
    },
    AmountInputBox: {
        width: '100%',
        color: 'rgb(223, 245, 255)',
        flex: '1 1 0%',
        outline: 'none',
        background: 'transparent',
        border: 'none',
        fontWeight: '700',
        lineHeight: '1',
        margin: '0px 10px 0px 0px',
        fontSize: '24px',
        "&:disabled": {
            color: "rgb(183, 199, 208)",
            cursor: 'not-allowed',
            pointerEvents: 'auto'
        },
        backgroundImage: 'url("/assets/images/mines/InputBg.png")',
        backgroundSize: '100% 100%',
        height: '46px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        "@media (max-width: 681px)": {
            height: '39px'
        }
    },
    AmountInput: {
        width: 'calc(100% - 221px)',
        height: '100%',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "17px",
        lineHeight: "21px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        marginLeft: '5px'
    },
}));

const BoardRows = 5;
const BoardCols = 5;
const TotalCellCount = BoardRows * BoardCols;
const MinMinesCount = 2;
const MaxMinesCount = TotalCellCount - 1;

const Mines = () => {
    const setting = { max: 1000, min: 1 };
    const classes = useStyles();
    const { addToast } = useToasts();
    const { account, isPending, startMines, revealTile, cashoutMines } = useOneDeal();

    const [gamePlay, setGamePlay] = useState(false);
    const [betAmount, setBetAmount] = useState(1);
    const [minesCount, setMinesCount] = useState(MinMinesCount);
    const [diamondCount, setDiamondCount] = useState(0);
    const [nextPayout, setNextPayout] = useState(1);
    const [curPayout, setCurPayout] = useState(1);
    const [countPickerShow, setCountPickerShow] = useState(false);
    const [boardData, setBoardData] = useState(Array.from(Array(BoardRows), () => Array(BoardCols).fill(0)));
    const [selectData, setSelectData] = useState(Array.from(Array(BoardRows), () => Array(BoardCols).fill(false)));
    const [gameId, setGameId] = useState(null);
    const [revealLoading, setRevealLoading] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');

    const payoutAmount = Number(betAmount * curPayout).toFixed(6);
    const nextPayoutAmount = Number(betAmount * nextPayout).toFixed(4);

    useEffect(() => {
        if (betAmount < setting.min) {
            setBetAmount(setting.min);
        }
        if (betAmount > setting.max) {
            setBetAmount(setting.max);
        }
    }, [betAmount, setting.min, setting.max]);

    const handleBetAmount = (e) => {
        e.preventDefault();
        setBetAmount(Number(e.target.value));
    };

    const handleCountPicker = () => {
        setCountPickerShow(!countPickerShow);
    };

    const handleJoinBet = async () => {
        if (!account) {
            addToast('Please connect your wallet first', { appearance: 'warning', autoDismiss: true });
            return;
        }

        // 关闭mines picker
        setCountPickerShow(false);

        try {
            const betAmountInSmallestUnit = Math.floor(betAmount * 1e9);
            console.log('Starting mines game:', { betAmount: betAmountInSmallestUnit, minesCount });

            const result = await startMines(betAmountInSmallestUnit, minesCount);
            console.log('Mines start result:', result);
            setDebugInfo(`Started game. Digest: ${result.digest}`);

            // 从objectChanges获取game ID
            if (result.objectChanges) {
                const createdObjects = result.objectChanges.filter(obj => obj.type === 'created');
                
                const minesGameObj = createdObjects.find(obj => 
                    obj.objectType && obj.objectType.includes('::casino::MinesGame')
                );
                
                if (minesGameObj) {
                    console.log('Game started with ID:', minesGameObj.objectId);
                    setGameId(minesGameObj.objectId);
                    setGamePlay(true);
                    setBoardData(Array.from(Array(BoardRows), () => Array(BoardCols).fill(0)));
                    setSelectData(Array.from(Array(BoardRows), () => Array(BoardCols).fill(false)));
                    setDiamondCount(0);
                    setCurPayout(1);
                    setNextPayout(calculateNextPayout(0, minesCount));
                    setDebugInfo(`Game ID: ${minesGameObj.objectId.slice(0, 10)}... Ready to play!`);
                    addToast('Game started! Click tiles to reveal', { appearance: 'success', autoDismiss: true });
                } else {
                    console.error('No MinesGame object found in created objects:', createdObjects);
                    setDebugInfo('Error: No game object found');
                    addToast('Failed to start game - no game object found', { appearance: 'error', autoDismiss: true });
                }
            } else {
                console.error('No objectChanges in result');
                setDebugInfo('Error: Invalid response');
                addToast('Failed to start game - invalid response', { appearance: 'error', autoDismiss: true });
            }
        } catch (error) {
            console.error('Mines start error:', error);
            addToast(error.message || 'Transaction failed', { appearance: 'error', autoDismiss: true });
        }
    };

    const handlePickCell = async (i, j) => {
        if (!gamePlay || boardData[i][j] !== 0 || revealLoading || selectData[i][j]) return;

        try {
            setRevealLoading(true);
            const position = i * BoardCols + j;
            console.log('Revealing tile:', { gameId, position, i, j });

            const result = await revealTile(gameId, position);
            console.log('Reveal result:', result);
            setDebugInfo(`Revealed tile at ${i},${j}`);

            // 解析事件
            if (result.events && result.events.length > 0) {
                console.log('All events:', result.events);
                const revealEvent = result.events.find(e => 
                    e.type && e.type.includes('::casino::MinesResultEvent')
                );

                if (revealEvent && revealEvent.parsedJson) {
                    const hitMine = revealEvent.parsedJson.hit_mine;
                    const revealedCount = parseInt(revealEvent.parsedJson.revealed_count);

                    console.log('Reveal event:', revealEvent.parsedJson);

                    let board = [...boardData];
                    board[i][j] = hitMine ? 2 : 1; // 2=bomb, 1=diamond
                    setBoardData(board);

                    let select = [...selectData];
                    select[i][j] = true;
                    setSelectData(select);

                    if (hitMine) {
                        // Hit mine - game over
                        setDebugInfo(`Hit mine! Game over. Lost ${betAmount.toFixed(4)} OCT`);
                        addToast(`You hit a mine! Lost ${betAmount.toFixed(4)} OCT`, { appearance: 'error', autoDismiss: true });
                        setGamePlay(false);
                        setGameId(null);
                    } else {
                        // Found diamond
                        setDiamondCount(revealedCount);
                        const newPayout = calculateCurrentPayout(revealedCount, minesCount);
                        setCurPayout(newPayout);
                        setNextPayout(calculateNextPayout(revealedCount, minesCount));
                        setDebugInfo(`Diamond ${revealedCount}/${TotalCellCount - minesCount}. Payout: ${(betAmount * newPayout).toFixed(4)} OCT`);
                        addToast(`Diamond found! ${revealedCount}/${TotalCellCount - minesCount}`, { appearance: 'success', autoDismiss: true });
                    }
                } else {
                    console.error('No MinesResultEvent found in events');
                    setDebugInfo('Error: No event found');
                    addToast('Failed to parse game result', { appearance: 'error', autoDismiss: true });
                }
            } else {
                console.error('No events found in result');
                setDebugInfo('Error: No events in result');
                addToast('Failed to get game result', { appearance: 'error', autoDismiss: true });
            }
        } catch (error) {
            console.error('Reveal tile error:', error);
            addToast(error.message || 'Transaction failed', { appearance: 'error', autoDismiss: true });
        } finally {
            setRevealLoading(false);
        }
    };

    const handleFinishBet = async () => {
        if (!gamePlay || !gameId) return;

        try {
            console.log('Cashing out:', { gameId, currentPayout: curPayout });
            const result = await cashoutMines(gameId);
            console.log('Cashout result:', result);

            if (result.events && result.events.length > 0) {
                const cashoutEvent = result.events.find(e => 
                    e.type && e.type.includes('::casino::MinesResultEvent')
                );

                if (cashoutEvent && cashoutEvent.parsedJson) {
                    const payout = parseInt(cashoutEvent.parsedJson.payout) / 1e9;
                    addToast(`Cashed out ${payout.toFixed(4)} OCT!`, { appearance: 'success', autoDismiss: true });
                }
            }

            setGamePlay(false);
            setGameId(null);
            setCurPayout(1);
            setNextPayout(1);
        } catch (error) {
            console.error('Cashout error:', error);
            addToast(error.message || 'Transaction failed', { appearance: 'error', autoDismiss: true });
        }
    };

    const handleRandomPick = () => {
        if (!gamePlay) return;

        let availableCells = [];
        for (let i = 0; i < BoardRows; i++) {
            for (let j = 0; j < BoardCols; j++) {
                if (boardData[i][j] === 0) {
                    availableCells.push({ i, j });
                }
            }
        }

        if (availableCells.length > 0) {
            const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
            handlePickCell(randomCell.i, randomCell.j);
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

    // Calculate payout multiplier based on revealed tiles
    const calculateCurrentPayout = (revealed, mines) => {
        if (revealed === 0) return 1;
        const safeTiles = TotalCellCount - mines;
        let multiplier = 1;
        for (let i = 0; i < revealed; i++) {
            const remaining = safeTiles - i;
            const total = TotalCellCount - i;
            multiplier *= (total * 0.98) / remaining;
        }
        return multiplier;
    };

    const calculateNextPayout = (revealed, mines) => {
        return calculateCurrentPayout(revealed + 1, mines);
    };

    return (
        <Box className={classes.MinesContainer}>
            <BackButton />
            <Box className={classes.GamePanelBox}>
                <SettingBox />
                <img src="/assets/images/mines/cat.png" alt="cat" className={classes.WolfImage} />
                <img src="/assets/images/mines/woman.png" alt="woman" className={classes.ManImage} />
                <Box className={classes.MinesGameBox}>
                    <Box className={classes.GamePlayContainer}>
                        <Box className={classes.CellContainer}>
                            <Box className={classes.TableContainer}>
                                {
                                    boardData.map((colsData, i) => {
                                        return (
                                            colsData.map((rowData, j) => {
                                                return (
                                                    <Button
                                                        key={j + i * BoardRows}
                                                        className={clsx(
                                                            classes.BoardCell, 
                                                            rowData === 2 ? classes.BombCell : '', 
                                                            !selectData[i][j] ? classes.UnSelect : ''
                                                        )}
                                                        disabled={!gamePlay || revealLoading}
                                                        onClick={() => handlePickCell(i, j)}
                                                    >
                                                        {rowData === 0 && <i className={classes.BoardBackground}></i>}
                                                        {rowData === 1 && <img src={"/assets/images/mines/DiamondIcon.png"} width="55px" height="51px" alt="icon" />}
                                                        {rowData === 2 && <img src={"/assets/images/mines/BombIcon.png"} width="50px" height="49px" alt="icon" />}
                                                    </Button>
                                                )
                                            })
                                        )
                                    })
                                }
                            </Box>
                            <Box className={classes.ActionBar}>
                                <Button 
                                    className={classes.RandomCellButton} 
                                    disabled={!gamePlay || revealLoading} 
                                    onClick={handleRandomPick}
                                >
                                    Pick Random Cell
                                </Button>
                            </Box>
                            <Box className={classes.InfoBar}>
                                <Box className={classes.OutComes}>
                                    <Box className={classes.OutComesDetail}>
                                        <img src="/assets/images/mines/BombIcon.png" alt="icon" />
                                        <span>{minesCount}</span>
                                    </Box>
                                    <Box className={classes.OutComesDetail}>
                                        <img src="/assets/images/mines/DiamondIcon.png" alt="icon" />
                                        <span>{TotalCellCount - minesCount - diamondCount}</span>
                                    </Box>
                                </Box>
                                <Box className={classes.PayoutBox}>
                                    <span className={classes.PayoutText}>Next multiplier</span>
                                    <Box className={classes.MultiplierBox}>x<span>{nextPayout.toFixed(2)}</span></Box>
                                </Box>
                                <Box className={classes.AmountInfo}>
                                    <img src="/assets/images/coins/oct.png" alt="coin icon" />
                                    <span>{Number(nextPayoutAmount).toFixed(4)}</span>
                                </Box>
                            </Box>
                            {debugInfo && (
                                <Box style={{ 
                                    marginTop: '8px', 
                                    padding: '8px', 
                                    background: 'rgba(0,0,0,0.3)', 
                                    borderRadius: '5px',
                                    fontSize: '12px',
                                    color: '#fff'
                                }}>
                                    {debugInfo}
                                </Box>
                            )}
                        </Box>
                        <Box className={classes.GameActionBar}>
                            {
                                !gamePlay ?
                                    <LoadingButton 
                                        className={classes.PlayButton} 
                                        loading={isPending} 
                                        onClick={handleJoinBet}
                                        disabled={!account}
                                    >
                                        {account ? 'Play' : 'Connect Wallet'}
                                    </LoadingButton>
                                    :
                                    <LoadingButton 
                                        loading={isPending} 
                                        className={clsx(classes.PlayButton, classes.FinishButton)} 
                                        onClick={handleFinishBet}
                                        disabled={diamondCount === 0}
                                    >
                                        {
                                            diamondCount === 0 ? <span>End</span> :
                                            <Box className={classes.TakeBox}>
                                                Take <img alt="icon" src="/assets/images/coins/oct.png" width="24px" height="24px" /> 
                                                <label>{payoutAmount}</label>
                                            </Box>
                                        }
                                    </LoadingButton>
                            }
                            <Button 
                                className={classes.CountSelectButton} 
                                onClick={handleCountPicker} 
                                disabled={gamePlay}
                            >
                                <Box className={classes.CountSelect}>{minesCount}</Box>
                            </Button>
                            {
                                countPickerShow &&
                                <MinesPicker 
                                    minMinesCount={MinMinesCount} 
                                    maxMinesCount={MaxMinesCount} 
                                    minesCount={minesCount} 
                                    setMinesCount={setMinesCount} 
                                />
                            }
                        </Box>
                    </Box>
                    <Box className={classes.AmountInputBox}>
                        <img src="/assets/images/coins/oct.png" alt="oct" className={classes.CoinItem} style={{ width: '35px', marginLeft: '16px', marginTop: '3px' }} />
                        <input 
                            className={classes.AmountInput} 
                            type="number" 
                            value={betAmount} 
                            onChange={handleBetAmount}
                            disabled={gamePlay}
                        />
                        <Box className={classes.AmountActionBox}>
                            <Button onClick={() => handleAmountAction(0)} className={classes.AmountActionButton} disabled={gamePlay}>1/2</Button>
                            <Button onClick={() => handleAmountAction(1)} className={clsx(classes.AmountActionButton, classes.AmountMiddleButton)} disabled={gamePlay}>2X</Button>
                            <Button onClick={() => handleAmountAction(2)} className={classes.AmountActionButton} disabled={gamePlay}>Max</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box style={{ marginTop: '24px' }}>
                <HistoryBox />
            </Box>
        </Box>
    );
};

export default Mines;
