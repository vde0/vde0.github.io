export { useMobileKeyboard, checkMobileKeyboard };


import { TEventHandler, TWebApp } from "@tg-types";
import { useCallback, useLayoutEffect, useState } from "react"
import { useMaxHeight } from "./useMaxHeight";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { useIsMobile } from "./useIsMobile";
import { addDebug, getWebApp } from "@utils";


type MobileKeyboard = boolean;


const MK_COEF   = 0.85;


const useMobileKeyboard = (): MobileKeyboard => {

    const wapp:         TWebApp = useWebApp();
    const maxHeight:    number  = useMaxHeight();
    const isMobile:     boolean = useIsMobile();
    //
    const [mkb, setMkb] = useState<MobileKeyboard>(
        isMobile
        ? checkMobileKeyboard(wapp, maxHeight)
        : false
    );

    const vpChangedHandler      = useCallback<TEventHandler>(function () {
        setMkb(
            isMobile
            ? checkMobileKeyboard(this, maxHeight)
            : false
        );
    }, []);

    useLayoutEffect(() => {
        wapp.onEvent("viewportChanged", vpChangedHandler);
        return () => wapp.offEvent("viewportChanged", vpChangedHandler)
    }, [wapp, maxHeight]);

    return mkb;
}


function checkMobileKeyboard (webApp: TWebApp | null, maxHeight: number): MobileKeyboard {
    if (!webApp) { console.error("webApp is null or undefined"); return false; }
    return webApp.viewportHeight / maxHeight <= MK_COEF;
}


addDebug("checkMK", () => checkMobileKeyboard( getWebApp() , window.debug?.getMaxHeight() ));