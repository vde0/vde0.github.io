import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { TWebApp } from "@tg-types";
import { createContext, useEffect, useState } from "react";


type PlatformState = "tdesktop" | "android" | "ios";
type PlatformValue = [PlatformState, (s: PlatformState) => void];


const DEFAULT_PLATFORM: PlatformState = "android";
const PlatformContext = createContext<PlatformValue | null>(null);


const PlatformProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    
    const webApp: TWebApp | null = useWebApp();
    const [platform, setPlatform] = useState<PlatformState>(DEFAULT_PLATFORM);

    useEffect(() => {
        const platformInit = webApp?.platform;

        setPlatform(false
            || platformInit === "tdesktop"
            || platformInit === "android"
            || platformInit === "ios"
            ? platformInit
            : DEFAULT_PLATFORM);
    }, [webApp]);
    

    return (
        <PlatformContext.Provider value={[platform, setPlatform]}>
            <div data-testid="state" className="invisible">{platform}</div>
            {children}
        </PlatformContext.Provider>
    );
};


export default PlatformProvider
// Context
export {
    PlatformContext,
    DEFAULT_PLATFORM,
};
// Types
export {
    PlatformState,
    PlatformValue,
};