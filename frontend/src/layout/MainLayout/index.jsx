import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import MainHeader from "./header";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import clsx from "clsx";
import MainFooter from "./footer";

const useStyles = makeStyles(() => ({
    MainContainer: {
        overflowY: 'auto',
        width: '100%',
        transition: 'transform .3s ease-in-out,margin .3s ease-in-out,-webkit-transform .3s ease-in-out',
        "&>section": {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    },
    RemovedMenu: {
        marginLeft: '60px'
    },
    MainWrapper: {
        paddingTop: '107px',
        display: 'flex',
        "@media (max-width: 681px)": {
            paddingTop: '63px'
        }
    }
}));

const MainLayout = () => {
    const classes = useStyles();
    const menuOption = useSelector((state) => state.menuOption);

    return (
        <Box>
            <CssBaseline />
            <MainHeader />
            <Box className={classes.MainWrapper}>
                {/* <MainMenu /> */}
                <main className={!menuOption.menuVisible ? clsx(classes.MainContainer, 'NoScroll') : clsx(classes.MainContainer, classes.RemovedMenu, 'NoScroll')}>
                    <section>
                        <Outlet />
                    </section>
                </main>
            </Box>
            <MainFooter />
        </Box>
    );
};

export default MainLayout;