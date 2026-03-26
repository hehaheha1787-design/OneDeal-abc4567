import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useOneDeal } from "hooks/useOneDeal";
import { useToasts } from "react-toast-notifications";
import { LoadingButton } from "@mui/lab";

const FundHouse = () => {
    const { fundHouse, account, isPending } = useOneDeal();
    const { addToast } = useToasts();
    const [amount, setAmount] = useState(100);

    const handleFund = async () => {
        if (!account) {
            addToast('Please connect wallet', { appearance: 'warning', autoDismiss: true });
            return;
        }

        try {
            const amountInSmallestUnit = Math.floor(amount * 1e9);
            await fundHouse(amountInSmallestUnit);
            addToast(`Successfully funded ${amount} OCT to House!`, { appearance: 'success', autoDismiss: true });
        } catch (error) {
            console.error('Fund error:', error);
            addToast(error.message || 'Fund failed', { appearance: 'error', autoDismiss: true });
        }
    };

    return (
        <Box sx={{ 
            position: 'fixed', 
            top: 80, 
            right: 20, 
            background: '#2a1f4a', 
            padding: 2, 
            borderRadius: 2,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
        }}>
            <Box sx={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                Fund House Pool
            </Box>
            <TextField
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                size="small"
                sx={{ 
                    background: '#1a1333',
                    '& input': { color: '#fff' }
                }}
            />
            <LoadingButton
                variant="contained"
                onClick={handleFund}
                loading={isPending}
                disabled={!account}
                sx={{ 
                    background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
                    '&:hover': {
                        background: 'linear-gradient(48.57deg, #4A35C1 24.42%, #AA5AEF 88.19%)',
                    }
                }}
            >
                {account ? 'Fund' : 'Connect Wallet'}
            </LoadingButton>
        </Box>
    );
};

export default FundHouse;
