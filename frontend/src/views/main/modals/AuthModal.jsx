import { Modal, Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { toast } from 'react-toastify';
import { ConnectButton, useCurrentAccount } from "@onelabs/dapp-kit";

const useStyles = makeStyles(() => ({
    ModalBox: {
        marginTop: '160px',
        width: '533px',
        height: '400px',
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
            padding: '28px',
            borderRadius: '0px'
        }
    },
    ModalCloseButton: {
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
    ModalBodyBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '422px',
        flexDirection: 'column',
        gap: '30px',
        "@media (max-width: 370px)": {
            width: '90%'
        }
    },
    ModalLogoBox: {
        marginBottom: '20px',
        "&>img": {
            width: '245px',
            height: '32px'
        }
    },
    WalletConnectBox: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
    Title: {
        color: '#FFF',
        fontSize: '18px',
        fontFamily: 'Styrene A Web',
        textTransform: 'uppercase',
        fontWeight: '700',
    },
    backdrop: {
        backgroundColor: '#1F1E25',
        opacity: '0.95 !important'
    },
}));

const AuthenticationModal = ({ open, setOpen }) => {
    const classes = useStyles();
    const account = useCurrentAccount();

    const handleClose = () => setOpen(false);

    // Auto close when wallet connected
    useEffect(() => {
        if (account) {
            toast.success('Wallet connected!');
            setOpen(false);
        }
    }, [account, setOpen]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            slotProps={{ backdrop: { className: classes.backdrop } }}
        >
            <Box className={classes.ModalBox}>
                <IconButton className={classes.ModalCloseButton} onClick={handleClose}>
                    <Close />
                </IconButton>
                <Box className={classes.ModalBodyBox}>
                    <Box className={classes.ModalLogoBox}>
                        <img src={`/assets/images/Logo.png`} alt="Logo" />
                    </Box>
                    <span className={classes.Title}>Connect Your Wallet</span>
                    <Box className={classes.WalletConnectBox}>
                        <ConnectButton />
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

AuthenticationModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired
};

export default AuthenticationModal;
