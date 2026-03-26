import { Avatar, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Config from "config/index";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useDispatch } from "react-redux";
import { OpenInNew } from "@mui/icons-material";
import { getPackageUrl, getTransactionUrl } from "config/contracts";
import { useOnChainHistory } from "hooks/useOnChainHistory";

const useStyles = makeStyles(() => ({
    DataTableBox: {
        width: '100%'
    },
    ScrollContainer: {
        width: '100%',
        overflowX: 'auto',
        overflowY: 'visible',
        "@media (max-width: 768px)": {
            '&::-webkit-scrollbar': {
                height: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: 'rgba(186, 106, 255, 0.5)',
                borderRadius: '4px',
                '&:hover': {
                    background: 'rgba(186, 106, 255, 0.7)',
                }
            }
        }
    },
    TableContent: {
        minWidth: '800px',
        "@media (max-width: 768px)": {
            minWidth: '900px',
        }
    },
    DataTableHeader: {
        display: 'flex',
        borderBottom: 'solid 1px rgba(255, 255, 255, 0.1)',
        padding: '9px 11px 9px 17px',
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '18px',
        textTransform: 'uppercase',
        color: '#FFF',
        marginBottom: '13px',
        "@media (max-width: 1045px)": {
            display: 'flex'
        }
    },
    DataTableRow: {
        width: '100%',
        height: '70px',
        background: '#2C2C3A',
        borderRadius: '8px',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        minWidth: '800px',
        "@media (max-width: 768px)": {
            minWidth: '900px',
        }
    },
    PlayerInfoBox: {
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        alignItems: 'center',
        marginLeft: '19px',
        "&>img": {
            "@media (max-width: 681px)": {
                display: 'none'
            }
        }
    },
    PlayerDetailBox: {
        display: 'flex',
        gap: '2px',
        flexDirection: 'column',
        "&>span": {
            fontSize: '17px',
            fontWeight: '700',
            lineHeight: '21px',
            color: '#FFF'
        },
        "&>label": {
            color: '#6FE482',
            textTransform: 'uppercase',
            fontWeight: '700',
            fontSize: '12px',
            lineHeight: '15px'
        }
    },
    FlexBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        "&>span": {
            fontFamily: 'Styrene A Web',
            fontWeight: '700',
            fontSize: '14px',
            lineHeight: '18px',
            textTransform: 'uppercase',
            color: '#FFF'
        }
    },
    WinSpan: {
        color: '#6FE482 !important'
    },
    LostSpan: {
        color: 'red !important'
    },
    DetailButton: {
        color: '#BA6AFF',
        padding: '4px',
        '&:hover': {
            color: '#5A45D1',
            background: 'rgba(186, 106, 255, 0.1)'
        }
    },
    PackageLink: {
        color: '#BA6AFF',
        textDecoration: 'none',
        fontSize: '12px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        '&:hover': {
            color: '#5A45D1'
        }
    },
    TxHashLink: {
        color: '#BA6AFF',
        textDecoration: 'none',
        fontSize: '12px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        '&:hover': {
            color: '#5A45D1',
            textDecoration: 'underline'
        }
    },
    TxHashText: {
        fontFamily: 'monospace',
        fontSize: '11px'
    }
}));

const DataTable = ({ historyState, gameType = "all" }) => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const dispatch = useDispatch();

    console.log('DataTable: Initialized with gameType:', gameType, 'historyState:', historyState);

    const [tableData, setTableData] = useState([]);
    const [newBetData, setNewBetData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Use on-chain history
    const { allBets, myBets, loading, error } = useOnChainHistory(gameType === 'all' ? null : gameType);

    console.log('DataTable: Received from hook - allBets:', allBets.length, 'myBets:', myBets.length);

    // Reset to page 1 when historyState or gameType changes
    useEffect(() => {
        setCurrentPage(1);
    }, [historyState, gameType]);

    // Update table data based on historyState (0 = My Bets, 1 = All Bets)
    // Show items for current page
    useEffect(() => {
        console.log('DataTable: historyState changed to', historyState);
        console.log('DataTable: gameType filter:', gameType);
        console.log('DataTable: myBets count:', myBets.length);
        console.log('DataTable: allBets count:', allBets.length);
        console.log('DataTable: myBets sample:', myBets.slice(0, 2));
        console.log('DataTable: allBets sample:', allBets.slice(0, 2));
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        if (historyState === 0) {
            console.log('DataTable: Setting My Bets');
            setTableData(myBets.slice(startIndex, endIndex));
        } else {
            console.log('DataTable: Setting All Bets');
            setTableData(allBets.slice(startIndex, endIndex));
        }
    }, [historyState, myBets, allBets, gameType, currentPage]);

    useEffect(() => {
        if (error) {
            console.error('DataTable: On-chain history error:', error);
        }
    }, [error]);

    useEffect(() => {
        console.log('DataTable: tableData updated, count:', tableData.length);
        if (tableData.length > 0) {
            console.log('DataTable: First item:', tableData[0]);
        }
    }, [tableData]);

    // Keep the old socket-based updates for backward compatibility
    useEffect(() => {
        Config?.Root?.socket?.off("updateBetHistory");
        Config?.Root?.socket?.on("updateBetHistory", (data) => {
            setNewBetData(data);
        });
        // eslint-disable-next-line
    }, [dispatch]);

    useEffect(() => {
        if (newBetData !== null) {
            let oldData = tableData;
            if (Array.isArray(newBetData)) {
                oldData = newBetData.concat(oldData);
            }
            else {
                oldData = [newBetData].concat(oldData);
            }
            if (oldData.length > 10) {
                oldData.splice(10, oldData.length - 10);
            }
            setTableData([...oldData]);
        }
        // eslint-disable-next-line
    }, [newBetData]);

    const handleViewTransaction = (txHash) => {
        if (txHash) {
            window.open(getTransactionUrl(txHash), '_blank');
        } else {
            addToast('Transaction hash not available', { appearance: 'warning', autoDismiss: true });
        }
    };

    const handleViewPackage = () => {
        window.open(getPackageUrl(), '_blank');
    };

    const formatTxHash = (txHash) => {
        if (!txHash) return 'N/A';
        if (txHash.length > 16) {
            return `${txHash.substring(0, 8)}...${txHash.substring(txHash.length - 6)}`;
        }
        return txHash;
    };

    const getGameName = (gameType) => {
        const gameNames = {
            'sicssor': 'Scissors',
            'dice': 'Dice',
            'turtle': 'Turtle Race',
            'slot': 'Slot',
            'plinko': 'Plinko',
            'mines': 'Mines',
            'crash': 'Crash'
        };
        return gameNames[gameType] || gameType;
    };

    // Calculate pagination
    const totalItems = historyState === 0 ? myBets.length : allBets.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading && tableData.length === 0) {
        return (
            <Box className={classes.DataTableBox}>
                <Box style={{ textAlign: 'center', padding: '40px', color: '#FFF' }}>
                    Loading on-chain transactions...
                </Box>
            </Box>
        );
    }

    return (
        <Box className={classes.DataTableBox}>
            <Box style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end', paddingRight: '20px' }}>
                <button className={classes.PackageLink} onClick={handleViewPackage} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    View Contract on OneScan <OpenInNew fontSize="small" />
                </button>
            </Box>
            
            <Box className={classes.ScrollContainer}>
                <Box className={classes.TableContent}>
                    <Box className={classes.DataTableHeader}>
                        <Box style={{ width: '30%' }}>Player</Box>
                        <Box style={{ width: '15%' }}>Bet</Box>
                        <Box style={{ width: '15%' }}>Payout</Box>
                        <Box style={{ width: '10%' }}>Multiplier</Box>
                        <Box style={{ width: '10%', textAlign: 'center' }}>Game</Box>
                        <Box style={{ width: '20%', textAlign: 'left' }}>Details</Box>
                    </Box>
                    <Box className={classes.DataTableBody}>
                        {tableData.length === 0 ? (
                            <Box style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                                {historyState === 0 ? 'No bets yet. Play a game to see your history!' : 'No transactions found'}
                            </Box>
                        ) : (
                            tableData.map((item, index) => {
                                const txHash = item.txHash || item.transactionHash || item.digest;
                                return (
                                    <Box className={classes.DataTableRow} key={index}>
                                        <Box style={{ width: '30%' }}>
                                    <Box className={classes.PlayerInfoBox}>
                                        <img alt={item.userName} src="/assets/images/player_avatar.svg" />
                                        <Box className={classes.PlayerDetailBox}>
                                            <span>{item.userName}</span>
                                            <label>{`Adventurer-lv${item.userLevel}`}</label>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box style={{ width: '15%' }}>
                                    <Box className={classes.FlexBox}>
                                        <Avatar alt={item.coinType.coinType} src={`/assets/images/coins/${item.coinType.coinType.toLowerCase()}.png`} sx={{ width: 28, height: 28 }} />
                                        <span>{item.betAmount}</span>
                                    </Box>
                                </Box>
                                <Box style={{ width: '15%' }}>
                                    <Box className={classes.FlexBox}>
                                        <Avatar alt={item.coinType.coinType} src={`/assets/images/coins/${item.coinType.coinType.toLowerCase()}.png`} sx={{ width: 28, height: 28 }} />
                                        <span
                                            className={
                                                item.roundResult === 'win' || item.roundResult === 'payout' ? classes.WinSpan
                                                    : item.roundResult === 'lost' ? classes.LostSpan
                                                        : ''
                                            }
                                        >
                                            {
                                                (item.roundResult === 'win' || item.roundResult === 'payout') ? (item.betAmount * item.payout).toFixed(2)
                                                    : item.roundResult === 'draw' || item.roundResult === 'finish' ? item.betAmount : `-${item.betAmount}`
                                            }
                                        </span>
                                    </Box>
                                </Box>
                                <Box style={{ width: '10%' }}>
                                    <span style={{ color: '#FFF' }}>x{item.payout.toFixed(2)}</span>
                                </Box>
                                <Box style={{ width: '10%', textAlign: 'center' }}>
                                    <span style={{ 
                                        color: '#FFF', 
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        textTransform: 'uppercase'
                                    }}>
                                        {getGameName(item.gameType)}
                                    </span>
                                </Box>
                                <Box style={{ width: '20%', textAlign: 'left', paddingLeft: '10px' }}>
                                    {txHash ? (
                                        <button 
                                            className={classes.TxHashLink}
                                            onClick={() => handleViewTransaction(txHash)}
                                            title={txHash}
                                            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                                        >
                                            <span className={classes.TxHashText}>{formatTxHash(txHash)}</span>
                                            <OpenInNew fontSize="small" />
                                        </button>
                                    ) : (
                                        <span style={{ color: '#666', fontSize: '12px' }}>N/A</span>
                                    )}
                                </Box>
                            </Box>
                        );
                    })
                )}
                    </Box>
                </Box>
            </Box>
            
            {totalPages > 1 && (
                <Box style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '10px', 
                    marginTop: '20px',
                    padding: '20px'
                }}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                            padding: '8px 16px',
                            background: currentPage === 1 ? '#2C2C3A' : '#BA6AFF',
                            color: currentPage === 1 ? '#666' : '#FFF',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            fontWeight: '700',
                            fontSize: '14px'
                        }}
                    >
                        Previous
                    </button>
                    <span style={{ color: '#FFF', fontSize: '14px', fontWeight: '700' }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '8px 16px',
                            background: currentPage === totalPages ? '#2C2C3A' : '#BA6AFF',
                            color: currentPage === totalPages ? '#666' : '#FFF',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontWeight: '700',
                            fontSize: '14px'
                        }}
                    >
                        Next
                    </button>
                </Box>
            )}
        </Box>
    )
};

export default DataTable; 