import { useContext, useEffect, useState } from "react";
import { PlatformContext, PlatformState, PlatformValue } from "@store";

const usePlatform = (): PlatformState => {
    const context: PlatformValue | null = useContext(PlatformContext);
    if (!context) {
        throw new Error("usePlatform() must be used within a PlatformProvider");
    }

    return context[0];
};


const checkMobile = (p: PlatformState): boolean => p !== "tdesktop";
const useCheckMobile = (): boolean => {
    const context: PlatformValue | null = useContext(PlatformContext);
    if (!context) {
        throw new Error("useCheckMobile() must be used within a PlatformProvider")
    }

    const platform: PlatformState   = context[0];
    const [isMobile, setIsMobile]   = useState<boolean>( checkMobile(platform) );

    useEffect(() => { setIsMobile( checkMobile(platform) ) }, [platform]);

    return isMobile;
};


export {
    usePlatform,
    useCheckMobile,
    checkMobile
};