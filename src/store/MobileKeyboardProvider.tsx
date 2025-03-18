import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { WebApp } from "@vkruglikov/react-telegram-web-app/lib/core/twa-types";
import { createContext, PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useCheckMobile, usePlatform } from "@hooks";


if (!window.debug) window.debug = {};
window.debug.mobileKeyboard = {};
const debug = window.debug.mobileKeyboard;


type MobileKeyboardValue = boolean;

const MobileKeyboardContext = createContext<MobileKeyboardValue | null>(null);

const MobileKeyboardProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const webApp: WebApp            = useWebApp();
    const isMobile: boolean         = useCheckMobile();
    const [isOpened, setIsOpened]   = useState<MobileKeyboardValue>(false);
    const maxHeightRef              = useRef<number>(900);

    debug["maxHeight"] = maxHeightRef;

    console.log(`init isMobile: ${isMobile}`);
    console.log(`init isOpened: ${isOpened}`);
    console.log(`init maxHeight: ${maxHeightRef.current}`);

    const viewportChangedHandler = useCallback(() => {
        console.log("viewportChanged | maxHeight: " + maxHeightRef.current);
        setIsOpened( webApp.viewportStableHeight / maxHeightRef.current <= 0.8 );
    }, [webApp]);

    // isOpened effect
    useEffect(() => {
        console.log("isOpened effect");
        if (!isMobile) {
            console.log("isOpened effect | The Desktop part");
            console.log("isOpened effect | isOpened: false");
            setIsOpened(false);

        } else {
            console.log("isOpened effect | The Mobile part");
            maxHeightRef.current = webApp.viewportStableHeight;
            console.log(`isOpened effect | maxHeight: ${maxHeightRef.current}`);
            webApp.onEvent("viewportChanged", viewportChangedHandler);

            return () => webApp.offEvent("viewportChanged", viewportChangedHandler);
        }
    }, [webApp, viewportChangedHandler]);

    return (
        <MobileKeyboardContext.Provider value={isOpened}>
            <div data-testid="isMobile" className="invisible">
                {String(isMobile)}
            </div>
            <div data-testid="maxHeight" className="invisible">
                {maxHeightRef.current}
            </div>
            <div data-testid="isOpened" className="invisible">
                {String(isOpened)}
            </div>
            {children}
        </MobileKeyboardContext.Provider>
    );
};


export default MobileKeyboardProvider
export {
    MobileKeyboardContext,
    MobileKeyboardValue,
};