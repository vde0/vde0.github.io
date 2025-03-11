import { WebApp } from "@vkruglikov/react-telegram-web-app/lib/core/twa-types";


declare module "@vkruglikov/react-telegram-web-app/lib/core/twa-types" {
    
    export type TWebApp = WebApp & {
        lockOrientation: () => void;
    };
}
