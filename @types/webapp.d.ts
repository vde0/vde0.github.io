import { WebApp } from "@vkruglikov/react-telegram-web-app/lib/core/twa-types";


type TWebApp = WebApp & {
    lockOrientation?:        () => void;
    disableVerticalSwipes?:  () => void;
    requestFullscreen?:      () => void;
};


declare module "@vkruglikov/react-telegram-web-app/lib/core/twa-types" {
    
    export { TWebApp };
}

declare global {
    interface Window {
        Telegram: { WebApp: TWebApp };
    };
}
