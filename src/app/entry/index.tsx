import React from 'react';
import {createRoot} from 'react-dom/client';
import App from '../../pages/App/App.tsx';
import './index.css'
import { onResizeEnd, telegram } from '../../shared/utils/tg/utils.js';
import TaskManager from '../../shared/utils/TaskManager.js';
import { isMobile } from '../../shared/utils/utils.js';
import { ReactNode } from 'react';


window.addEventListener("load", evt => {
    telegram.expand();
    const expandedEvt = new Event("expanded", {bubbles: true});
    if (isMobile)   onResizeEnd(() => window.dispatchEvent( expandedEvt ), true);
    else            TaskManager.setMacrotask(() => window.dispatchEvent( expandedEvt ));
}, {once: true});


const root      = createRoot(document.getElementById( "root" ));
root.render(<App />);