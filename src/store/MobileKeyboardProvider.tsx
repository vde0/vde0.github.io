import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { WebApp } from "@vkruglikov/react-telegram-web-app/lib/core/twa-types";
import { createContext, PropsWithChildren, useCallback, useEffect, useRef, useState } from "react"
import { useCheckMobile, usePlatform } from "@hooks";


type MobileKeyboardValue = boolean;

const MobileKeyboardContext = createContext<MobileKeyboardValue | null>(null);

const MobileKeyboardProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const webApp: WebApp            = useWebApp();
    const isMobile: boolean         = useCheckMobile();
    const [isOpened, setIsOpened]   = useState<MobileKeyboardValue>(false);
    const maxHeightRef              = useRef<number>(900);

    const viewportChangedHandler = useCallback(() => {
        console.log("maxHeight: " + maxHeightRef.current);
        setIsOpened( webApp.viewportStableHeight / maxHeightRef.current <= 0.8 );
    }, [webApp]);

    useEffect(() => {
        console.log("call useEffect of MobileKeyboardProvider");
        if (!isMobile) {
            setIsOpened(false);

        } else {
            maxHeightRef.current = webApp.viewportStableHeight;
            webApp.onEvent("viewportChanged", viewportChangedHandler);

            return () => webApp.offEvent("viewportChanged", viewportChangedHandler);
        }
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
    MobileKeyboardValue,
};