import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css'

const tg = window.Telegram.WebApp;
tg.expand();


const clickWrapper = {
    onClick: () => {},
};

const rootDOM   = document.getElementById("root");
const root      = createRoot( document.getElementById("root") );
rootDOM.onclick = evt => {
    clickWrapper.onClick(evt);
};

root.render(<App telegram={tg} clickWrapper={clickWrapper} />);