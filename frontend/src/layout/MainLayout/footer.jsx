import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
    FooterBox: {
        width: '100%',
        background: '#282836',
        marginTop: '30px',
        padding: '37px 70px 13px 70px',
        "@media (max-width: 940px)": {
            padding: '20px'
        }
    },
    FooterCoinBox: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '44px',
        marginBottom: '33px',
        "@media (max-width: 681px)": {
            gap: '10px'
        }
    },
    DividLine: {
        width: '100%',
        height: '1px',
        background: '#FFF',
        opacity: '0.1',
        border: 'none'
    },
    GambleWareBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '22px',
        marginTop: '16px',
        marginBottom: '15px',
        "@media (max-width: 681px)": {
            flexWrap: 'wrap'
        }
    },
    CopyRightBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '25px',
        marginBottom: '20px'
    },
    CopyRightText: {
        fontWeight: '400',
        opacity: '0.4',
        color: '#FFF',
        fontSize: '13px',
        lineHeight: '16px'
    },
    ContactBox: {
        display: 'flex',
        flexDirection: 'row',
        gap: '6px',
        alignItems: 'center'
    },
    GambleIcon: {
        width: '225px',
        height: '54px'
    },
    GameCareIcon: {
        width: '94px',
        height: '27px'
    },
    LogoIcon: {
        height: '30px',
        width: 'auto'
    }
}));


const MainFooter = () => {
    const classes = useStyles();

    return (
        <Box className={classes.FooterBox}>
            <Box className={classes.DividLine}></Box>
            <Box className={classes.DividLine}></Box>
            <Box className={classes.CopyRightBox}>
                <img src={`/assets/images/Logo.png`} className={classes.LogoIcon} alt="Logo" />
                <span className={classes.CopyRightText}>copyright ©2026</span>
            </Box>
        </Box>
    );
};

export default MainFooter;