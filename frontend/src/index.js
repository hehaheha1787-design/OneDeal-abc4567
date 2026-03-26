import "./polyfill";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from "./redux/configStore";
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter } from 'react-router-dom';
import { OneProvider } from './providers/OneProvider';
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "assets/scss/style.scss";
import "assets/scss/dice.scss";
import "assets/scss/fonts.scss";
import "assets/scss/timer.scss";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={configureStore()}>
        <BrowserRouter>
            <ToastContainer />
            <ToastProvider>
                <OneProvider>
                    <App />
                </OneProvider>
            </ToastProvider>
        </BrowserRouter>
    </Provider>
);

serviceWorker.unregister();
