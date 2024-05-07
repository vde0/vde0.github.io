import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css'
import { telegram } from './utils';


telegram.expand();


const rootDOM   = document.getElementById("root");
const root      = createRoot( document.getElementById("root") );

const handlerWrapper = {
    setHandler (eventName, handlerFunc) {
        rootDOM.addEventListener(eventName, handlerFunc);
    }
};

root.render(<App rootHandler={handlerWrapper} />);