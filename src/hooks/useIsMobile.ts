export {
    useIsMobile,
    checkMobile,
};


import { TPlatform, TWebApp } from "@tg-types";
import { useLayoutEffect, useState } from "react";
import { usePlatform } from "./usePlatform";


const useIsMobile = (): boolean => {
    const platform: TPlatform   = usePlatform();
    const [isMobile, setIsMobile]   = useState<boolean>( checkMobile(platform) );

    useLayoutEffect(() => {
        setIsMobile( checkMobile(platform) );
    }, [platform]);

    return isMobile;
};


function checkMobile (p: TPlatform): boolean { return p !== "tdesktop"; }