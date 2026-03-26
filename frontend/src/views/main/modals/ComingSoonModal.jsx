import { Box, Modal, Typography, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Close } from "@mui/icons-material";
import { keyframes } from "@mui/system";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8) rotate(-5deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
  }
`;

const useStyles = makeStyles(() => ({
    modalContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
    },
    modalContent: {
        position: 'relative',
        width: '90%',
        maxWidth: '550px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '30px',
        padding: '50px 40px',
        outline: 'none',
        animation: `${fadeIn} 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6)',
        border: '3px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
        "&::before": {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '200%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
            animation: `${shimmer} 3s infinite`,
        },
        "&::after": {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            animation: `${rotate} 20s linear infinite`,
        }
    },
    closeButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: '#FFF',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.1)',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'rotate(90deg)',
        },
        transition: 'all 0.3s ease',
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        animation: `${float} 3s ease-in-out infinite`,
        position: 'relative',
        zIndex: 1,
    },
    icon: {
        fontSize: '100px',
        animation: `${pulse} 2s ease-in-out infinite`,
        filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3))',
    },
    title: {
        fontFamily: 'Styrene A Web',
        fontSize: '42px',
        fontWeight: 700,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: '20px',
        textShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        zIndex: 1,
        letterSpacing: '2px',
    },
    subtitle: {
        fontFamily: 'Styrene A Web',
        fontSize: '17px',
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        lineHeight: '28px',
        marginBottom: '30px',
        position: 'relative',
        zIndex: 1,
    },
    gameName: {
        fontFamily: 'Styrene A Web',
        fontSize: '24px',
        fontWeight: 700,
        color: '#FFD700',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        marginBottom: '12px',
        textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)',
        position: 'relative',
        zIndex: 1,
        animation: `${glow} 2s ease-in-out infinite`,
    },
    decorativeLine: {
        width: '120px',
        height: '4px',
        background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
        margin: '0 auto 30px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    },
    notifyButton: {
        width: '100%',
        padding: '16px 32px',
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        border: 'none',
        borderRadius: '15px',
        color: '#000',
        fontFamily: 'Styrene A Web',
        fontSize: '18px',
        fontWeight: 700,
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 6px 20px rgba(255, 215, 0, 0.5)',
        position: 'relative',
        zIndex: 1,
        letterSpacing: '1px',
        '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 10px 30px rgba(255, 215, 0, 0.7)',
            background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
        },
        '&:active': {
            transform: 'translateY(-1px)',
        }
    },
    sparkle: {
        position: 'absolute',
        width: '6px',
        height: '6px',
        background: '#FFD700',
        borderRadius: '50%',
        boxShadow: '0 0 15px #FFD700, 0 0 30px #FFD700',
        animation: `${float} 2s ease-in-out infinite`,
        zIndex: 1,
        '&:nth-child(1)': {
            top: '15%',
            left: '8%',
            animationDelay: '0s',
        },
        '&:nth-child(2)': {
            top: '65%',
            left: '12%',
            animationDelay: '0.5s',
        },
        '&:nth-child(3)': {
            top: '25%',
            right: '8%',
            animationDelay: '1s',
        },
        '&:nth-child(4)': {
            top: '75%',
            right: '12%',
            animationDelay: '1.5s',
        },
        '&:nth-child(5)': {
            top: '45%',
            left: '5%',
            animationDelay: '0.7s',
        },
        '&:nth-child(6)': {
            top: '50%',
            right: '5%',
            animationDelay: '1.2s',
        },
    }
}));

const ComingSoonModal = ({ open, onClose, gameName = "This Game" }) => {
    const classes = useStyles();

    return (
        <Modal
            open={open}
            onClose={onClose}
            className={classes.modalContainer}
        >
            <Box className={classes.modalContent}>
                {/* Sparkles */}
                <Box className={classes.sparkle} />
                <Box className={classes.sparkle} />
                <Box className={classes.sparkle} />
                <Box className={classes.sparkle} />
                <Box className={classes.sparkle} />
                <Box className={classes.sparkle} />

                {/* Close Button */}
                <IconButton className={classes.closeButton} onClick={onClose}>
                    <Close />
                </IconButton>

                {/* Icon */}
                <Box className={classes.iconContainer}>
                    <span className={classes.icon}>🎮</span>
                </Box>

                {/* Game Name */}
                <Typography className={classes.gameName}>
                    {gameName}
                </Typography>

                {/* Decorative Line */}
                <Box className={classes.decorativeLine} />

                {/* Title */}
                <Typography className={classes.title}>
                    Coming Soon!
                </Typography>

                {/* Subtitle */}
                <Typography className={classes.subtitle}>
                    We're working hard to bring you this exciting new game. 
                    Stay tuned for updates and get ready for an amazing gaming experience!
                </Typography>

                {/* Notify Button */}
                <button className={classes.notifyButton} onClick={onClose}>
                    Got It!
                </button>
            </Box>
        </Modal>
    );
};

export default ComingSoonModal;
