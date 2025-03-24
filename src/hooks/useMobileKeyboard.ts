export { useMobileKeyboard, checkMobileKeyboard };


import { TEventHandler, TWebApp } from "@tg-types";
import { useCallback, useLayoutEffect, useState } from "react"
import { useMaxHeight } from "./useMaxHeight";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";


type MobileKeyboard = boolean;


const MK_COEF   = 0.8;


const useMobileKeyboard = (): MobileKeyboard => {

    const wapp:         TWebApp = useWebApp();
    const maxHeight:    number  = useMaxHeight();
    //
    const [mkb, setMkb] = useState<MobileKeyboard>( checkMobileKeyboard(wapp, maxHeight) );

    const vpChangedHandler      = useCallback<TEventHandler>(function () {
        setMkb( checkMobileKeyboard(this, maxHeight) );
    }, []);

    useLayoutEffect(() => {
        wapp.onEvent("viewportChanged", vpChangedHandler);
        return () => wapp.offEvent("viewportChanged", vpChangedHandler)
    }, [wapp, maxHeight]);

    return mkb;
}


function checkMobileKeyboard (webApp: TWebApp, maxHeight: number): MobileKeyboard {
    return webApp.viewportHeight / maxHeight <= MK_COEF;
}
