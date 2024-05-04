import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css'

const tg = window.Telegram.WebApp;
tg.expand();


const rootDOM   = document.getElementById("root");
const root      = createRoot( document.getElementById("root") );

const handlerWrapper = {
    setHandler (eventName, handlerFunc) {
        rootDOM.addEventListener(eventName, handlerFunc);
    }
};

root.render(<App telegram={tg} rootHandler={handlerWrapper} />);