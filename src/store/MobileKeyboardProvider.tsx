import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { WebApp } from "@vkruglikov/react-telegram-web-app/lib/core/twa-types";
import { createContext, PropsWithChildren, useCallback, useEffect, useRef, useState } from "react"


const MobileKeyboardContext = createContext<boolean>(false);

const MobileKeyboardProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const webApp: WebApp            = useWebApp();
    const [isOpened, setIsOpened]   = useState<boolean>(false);
    const maxHeightRef              = useRef<number>(900);

    const viewportChangedHandler = useCallback(() => {
        setIsOpened( webApp.viewportStableHeight / maxHeightRef.current <= 2/3 );
    }, [webApp]);

    useEffect(() => {
        maxHeightRef.current = webApp.viewportStableHeight;
        webApp.onEvent("viewportChanged", viewportChangedHandler);

        return webApp.offEvent("viewportChanged", viewportChangedHandler);
    }, [webApp, viewportChangedHandler]);

    return (
        <MobileKeyboardContext.Provider value={isOpened}>
            {children}
        </MobileKeyboardContext.Provider>
    );
};


export default MobileKeyboardProvider
export {
    MobileKeyboardContext,
};