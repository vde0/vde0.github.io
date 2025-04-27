export { getWebApp };


import { TWebApp } from "@tg-types";


function getWebApp (): TWebApp | null {
    return window.Telegram?.WebApp ?? null;
}