import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css'

const tg = window.Telegram.WebApp;
tg.expand();

const root = createRoot( document.getElementById("root") );
root.render(<App telegram={tg} />);