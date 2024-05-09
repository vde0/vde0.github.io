import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css'
import { isMobile, resetStartHeight, telegram } from './utils/utils';


telegram.expand();

let wasInit = false;
const initApp = () => {
    if (wasInit) return;
    resetStartHeight();
    document.documentElement.classList.add("root-document_placing_tg");
    window.dispatchEvent( new Event("initapp") );

}

window.addEventListener("load", evt => {
    if (isMobile) {
        window.addEventListener("touchend", initApp, {once: true});
    } else {
        initApp();
    }
}, {once: true});


const rootDOM   = document.getElementById("root");
const root      = createRoot( document.getElementById("root") );

const handlerWrapper = {
    setHandler (eventName, handlerFunc) {
        rootDOM.addEventListener(eventName, handlerFunc);
    }
};

root.render(<App rootHandler={handlerWrapper} />);