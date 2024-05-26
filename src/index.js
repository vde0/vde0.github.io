import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './components/App/App';
import './index.css'
import { appParams, initApp, telegram } from './utils/utils';
import TaskManager from './utils/TaskManager';


window.addEventListener("load", evt => {
    telegram.expand();
    if (appParams.isMobile) {
        window.addEventListener(
            "click", _ => TaskManager.setMacrotask(initApp, 1), {once: true});
    } else {
        TaskManager.setMacrotask(initApp, 1);
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