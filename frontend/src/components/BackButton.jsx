import { IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const useStyles = makeStyles(() => ({
    BackButton: {
        position: 'fixed',
        top: '100px',
        left: '20px',
        zIndex: 1000,
        backgroundColor: 'rgba(190, 168, 228, 0.9)',
        color: '#FFFFFF',
        width: '50px',
        height: '50px',
        '&:hover': {
            backgroundColor: 'rgba(115, 79, 161, 0.9)',
        },
        "@media (max-width: 940px)": {
            top: '80px',
            left: '10px',
            width: '40px',
            height: '40px',
        }
    }
}));

const BackButton = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/app/home');
    };

    return (
        <IconButton 
            className={classes.BackButton} 
            onClick={handleBack}
            aria-label="back to home"
        >
            <ArrowBackIcon />
        </IconButton>
    );
};

export default BackButton;
