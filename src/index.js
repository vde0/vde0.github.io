import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './components/App/App';
import './index.css'
import { telegram } from './utils/tg/utils';
import TaskManager from './utils/TaskManager';


window.addEventListener("load", evt => {
    telegram.expand();
}, {once: true});


const rootDOM   = document.getElementById("root");
const root      = createRoot( document.getElementById("root") );

const handlerWrapper = {
    setHandler (eventName, handlerFunc) {
        rootDOM.addEventListener(eventName, handlerFunc);
    }
};

root.render(<App rootHandler={handlerWrapper} />);