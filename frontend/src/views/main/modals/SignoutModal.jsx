import { Modal, Box, IconButton, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useDisconnectWallet } from "@onelabs/dapp-kit";
import { toast } from 'react-toastify';

const useStyles = makeStyles(() => ({
    ModalBox: {
        marginTop: '160px',
        width: '533px',
        height: '245px',
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
        gap: '24px',
        padding: '0px 26px 0px 45px',
        flexDirection: 'column',
        width: '100%',
        "@media (max-width: 370px)": {
            width: '90%'
        },
        "@media (max-width: 681px)": {
            padding: '20px'
        }
    },
    backdrop: {
        backgroundColor: '#1F1E25',
        opacity: '0.95 !important'
    },
    ModalButton: {
        borderRadius: '8px',
        fontFamily: "'Styrene A Web'",
        fontWeight: 700,
        fontSize: "16px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        height: '55px'
    },
    CloseButton: {
        background: "#2C2C3A",
        border: "1px solid #363646",
        width: '183px'
    },
    ConfirmButton: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        width: '242px'
    },
    ActionBox: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    ModalText: {
        fontFamily: "'Styrene A Web'",
        fontWeight: 900,
        fontSize: "18px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        opacity: 0.5,
    }
}));

const SignoutModal = ({ open, setOpen }) => {
    const classes = useStyles();
    const handleClose = () => setOpen(false);
    const { mutate: disconnect } = useDisconnectWallet();

    const handleSignout = () => {
        disconnect();
        toast.success('Wallet disconnected');
        setOpen(false);
    };

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
                    <span className={classes.ModalText}>Disconnect wallet?</span>
                    <Box className={classes.ActionBox}>
                        <Button className={clsx(classes.ModalButton, classes.CloseButton)} onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button className={clsx(classes.ModalButton, classes.ConfirmButton)} onClick={handleSignout}>
                            Disconnect
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

SignoutModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired
};

export default SignoutModal;
