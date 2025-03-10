import { webAppContext } from "@vkruglikov/react-telegram-web-app/lib/core";
import { WebApp } from "@vkruglikov/react-telegram-web-app/lib/core/twa-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type PlatformState = "tdesktop" | "android" | "ios" | null;
type PlatformValue = [PlatformState, (s: PlatformState) => void];

const PlatformContext = createContext<PlatformValue | null>(null);


const PlatformProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    
    const webApp: WebApp | null = useContext(webAppContext);
    const [platform, setPlatform] = useState<PlatformState>(null);

    useEffect(() => {
        const platformInit = webApp?.platform;

        setPlatform(false
            || platformInit === "tdesktop"
            || platformInit === "android"
            || platformInit === "ios"
            ? platformInit
            : null);
    }, [webApp]);

    useEffect(() => {
        if (webApp?.platform || webApp?.platform === null) {
            webApp.platform = platform ? platform : "";
        }
    }, [platform]);

    return (
        <PlatformContext.Provider value={[platform, setPlatform]}>
            {children}
        </PlatformContext.Provider>
    );
};


export default PlatformProvider
// Context
export { PlatformContext };
// Types
export {
    PlatformState,
    PlatformValue,
};