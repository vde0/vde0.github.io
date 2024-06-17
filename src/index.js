import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './components/App/App';
import './index.css'
import { onResizeEnd, telegram } from './utils/tg/utils';
import TaskManager from './utils/TaskManager';
import { isMobile } from './utils/utils';


window.addEventListener("load", evt => {
    telegram.expand();
    const expandedEvt = new Event("expanded", {bubbles: true});
    if (isMobile)   onResizeEnd(_ => window.dispatchEvent( expandedEvt ), true);
    else            TaskManager.setMacrotask(_ => window.dispatchEvent( expandedEvt ));
}, {once: true});


const root      = createRoot(document.getElementById( "root" ));
root.render(<App />);