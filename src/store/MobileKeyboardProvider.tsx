import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { TWebApp } from "@tg-types";
import { createContext, PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useCheckMobile, useMaxHeight, usePlatform } from "@hooks";


if (!window.debug) window.debug = {};
window.debug.mobileKeyboard = {};
const debug = window.debug.mobileKeyboard;


type MobileKeyboardValue = boolean;

const MobileKeyboardContext = createContext<MobileKeyboardValue | null>(null);

const MobileKeyboardProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const webApp:       TWebApp     = useWebApp();
    const isMobile:     boolean     = useCheckMobile();
    const [isOpened, setIsOpened]   = useState<MobileKeyboardValue>(false);
    const maxHeight:    number      = useMaxHeight();

    debug["maxHeight"]  = maxHeight;
    debug["isMobile"]   = isMobile;
    debug["isOpened"]   = isOpened;

    console.log(`init isMobile: ${isMobile}`);
    console.log(`init isOpened: ${isOpened}`);
    console.log(`init maxHeight: ${maxHeight}`);

    // isOpened setting
    useLayoutEffect(() => {
        console.log("isOpened effect");
        if (!isMobile) {
            console.log("isOpened effect | The Desktop part");
            console.log("isOpened effect | isOpened: false");
            setIsOpened(false);

        } else {
            console.log("isOpened effect | The Mobile part");
            const newIsOpened: boolean = webApp.viewportHeight / maxHeight <= 0.8;
            console.log(`isOpened effect | isOpened: ${newIsOpened}`);
            setIsOpened(newIsOpened);
        }
    }, [webApp, maxHeight]);

    return (
        <MobileKeyboardContext.Provider value={isOpened}>
            <div data-testid="isMobile" className="invisible">
                {String(isMobile)}
            </div>
            <div data-testid="maxHeight" className="invisible">
                {maxHeight}
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