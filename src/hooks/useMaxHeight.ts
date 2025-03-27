export { useMaxHeight, defineMaxHeight, GetMaxHeight };


import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { TWebApp } from "@tg-types"
import { useLayoutEffect, useState } from "react";
import { addDebug, getWebApp } from "@utils";


type GetMaxHeight = () => number;
const getMaxHeight: GetMaxHeight = defineMaxHeight( getWebApp() );

addDebug("getMaxHeight", getMaxHeight);


const useMaxHeight = ( getMX: GetMaxHeight = getMaxHeight ): number => {

    const webApp: TWebApp           = useWebApp();
    if (!webApp)    throw Error("webApp was undefined");

    const [maxHeight, setMaxHeight] = useState<number>( getMX() );

    useLayoutEffect(() => {
        webApp.onEvent("viewportChanged", vpChangedHandler);
        return () => webApp.offEvent("viewportChanged", vpChangedHandler);
    }, [webApp]);

    function vpChangedHandler ({ isStateStable }: { isStateStable: boolean }): void {
        if (!isStateStable) return;
        setMaxHeight( getMX() );
    };

    return maxHeight;
};


function defineMaxHeight (webApp: TWebApp | null): GetMaxHeight {

    if (!webApp)    console.error("Missing the webApp arg.");
    let maxHeight: number  = webApp?.viewportHeight ?? 0;

    const getMaxHeight: GetMaxHeight = () => {

        const curHeight: number     = webApp?.viewportHeight ?? maxHeight;
        maxHeight = curHeight > maxHeight ? curHeight : maxHeight;
        //
        return maxHeight;
    };

    return getMaxHeight;
};
