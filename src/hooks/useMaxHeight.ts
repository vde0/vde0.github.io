import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { TWebApp } from "@tg-types"
import { useLayoutEffect, useState } from "react";


type GetMaxHeight = (w: TWebApp) => number;
const getMaxHeight: GetMaxHeight = defineMaxHeight();

if (!window.debug) window.debug = {};
window.debug.getMaxHeight = () => getMaxHeight(window.Telegram.WebApp);

const useMaxHeight = ( getMX: GetMaxHeight = getMaxHeight ): number => {

    const webApp: TWebApp           = useWebApp();
    if (!webApp)    throw Error("webApp was undefined");

    const [maxHeight, setMaxHeight] = useState<number>( getMX(webApp) );

    useLayoutEffect(() => {
        webApp.onEvent("viewportChanged", vpChangedHandler);
        return () => webApp.offEvent("viewportChanged", vpChangedHandler);
    }, [webApp]);

    function vpChangedHandler (this: TWebApp, { isStateStable }: { isStateStable: boolean }): void {
        if (!isStateStable) return;
        setMaxHeight( getMX(this) );
    };

    return maxHeight;
};


function defineMaxHeight (): GetMaxHeight {

    let maxHeight: number | null  = null;

    const getMaxHeight: GetMaxHeight = (wapp: TWebApp) => {

        if (!wapp)  throw Error("Missing the wapp arg.");
        if (maxHeight === null)     { maxHeight = wapp.viewportHeight; return maxHeight; }

        const curHeight: number     = wapp.viewportHeight;
        maxHeight = curHeight > maxHeight ? curHeight : maxHeight;
        //
        return maxHeight;
    };

    return getMaxHeight;
};


export { useMaxHeight, defineMaxHeight, GetMaxHeight };