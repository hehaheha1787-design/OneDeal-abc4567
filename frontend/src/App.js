import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import themes from "./themes";
import { LoadingProvider } from "./layout/Context/loading";
import ContextLoading from "./ui-component/loading";
import MainRoutes from "./routes/main";
import { useCurrentAccount, useSuiClient } from "@onelabs/dapp-kit";

const App = () => {
    const dispatch = useDispatch();
    const customization = useSelector((state) => state.customization);
    const account = useCurrentAccount();
    const client = useSuiClient();

    // Sync wallet connection with Redux auth state
    useEffect(() => {
        const syncWalletState = async () => {
            console.log('Wallet account:', account);
            if (account) {
                // Wallet connected - set auth state
                dispatch({ type: 'SET_AUTH' });
                dispatch({ 
                    type: 'SET_USERDATA', 
                    data: { 
                        _id: account.address,
                        walletAddress: account.address,
                        userName: `${account.address.slice(0, 6)}...${account.address.slice(-4)}`,
                        currency: { coinType: 'OCT', type: 'native' }
                    } 
                });

                // Fetch OCT balance from chain
                try {
                    console.log('Fetching balance for:', account.address);
                    const balance = await client.getBalance({
                        owner: account.address,
                    });
                    console.log('Balance response:', balance);
                    const octBalance = Number(balance.totalBalance) / 1e9;
                    console.log('OCT Balance:', octBalance);
                    dispatch({ 
                        type: 'SET_BALANCEDATA', 
                        data: [{ 
                            coinType: 'OCT', 
                            type: 'native', 
                            balance: octBalance
                        }] 
                    });
                } catch (e) {
                    console.error('Balance fetch error:', e);
                    dispatch({ type: 'SET_BALANCEDATA', data: [{ coinType: 'OCT', type: 'native', balance: 0 }] });
                }
            } else {
                // Wallet disconnected - clear auth state
                dispatch({ type: 'CLEAR_AUTH' });
            }
        };
        syncWalletState();
    }, [account, client, dispatch]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <LoadingProvider>
                    <ContextLoading />
                    <MainRoutes />
                </LoadingProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    )
};

export default App;