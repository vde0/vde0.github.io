import { useContext, useEffect, useState } from "react";
import { PlatformContext, PlatformState, PlatformValue } from "@store";

const usePlatform = (): PlatformValue => {
    const context = useContext(PlatformContext);
    if (!context) {
        throw new Error("usePlatform() must be used within a PlatformProvider");
    }

    return context;
};


const checkMobile = (p: PlatformState): boolean => p !== "tdesktop";
const useCheckMobile = (): boolean => {
    const context = useContext(PlatformContext);
    if (!context) {
        throw new Error("useCheckMobile() must be used within a PlatformProvider")
    }

    const platform                  = context[0];
    const [isMobile, setIsMobile]   = useState<boolean>( checkMobile(platform) );

    useEffect(() => { setIsMobile( checkMobile(platform) ) }, [platform]);

    return isMobile;
};


export {
    usePlatform,
    useCheckMobile,
};