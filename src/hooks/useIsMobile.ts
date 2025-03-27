export {
    useIsMobile,
    checkMobile,
};


import { useLayoutEffect, useState } from "react";
import { usePlatform } from "@hooks";
import { addDebug } from "@utils";
import { TPlatform } from "@tg-types";


const useIsMobile = (): boolean => {
    const platform: TPlatform   = usePlatform();
    const [isMobile, setIsMobile]   = useState<boolean>( checkMobile(platform) );

    useLayoutEffect(() => {
        setIsMobile( checkMobile(platform) );
    }, [platform]);

    return isMobile;
};


function checkMobile (p: TPlatform): boolean { return p !== "tdesktop" && p !== "unknown"; }

addDebug("checkMobile", () => checkMobile( window.debug?.getPlatform() ));