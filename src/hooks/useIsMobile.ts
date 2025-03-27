export {
    useIsMobile,
    checkMobile,
};


import { useLayoutEffect, useState } from "react";
import { Platform, usePlatform } from "@hooks";
import { addDebug } from "@utils";


const useIsMobile = (): boolean => {
    const platform: Platform   = usePlatform();
    const [isMobile, setIsMobile]   = useState<boolean>( checkMobile(platform) );

    useLayoutEffect(() => {
        setIsMobile( checkMobile(platform) );
    }, [platform]);

    return isMobile;
};


function checkMobile (p: Platform): boolean { return p !== "tdesktop" && p !== "unknown"; }

addDebug("checkMobile", () => checkMobile( window.debug.getPlatform() ));