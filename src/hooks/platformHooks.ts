export {
    usePlatform,
    useCheckMobile,
    checkMobile,
    checkPlatform,
};


import { TPlatform, TWebApp } from "@tg-types";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { useState } from "react";


const usePlatform = (): TPlatform => {
    const wapp: TWebApp = useWebApp();
    const [platform,]   = useState<TPlatform>( checkPlatform(wapp) );

    return platform;
};

const useCheckMobile = (): boolean => {
    const wapp: TWebApp = useWebApp();
    const [isMobile,]   = useState<boolean>( checkMobile( checkPlatform(wapp) ) );

    return isMobile;
};


function checkMobile (p: TPlatform): boolean { return p !== "tdesktop"; }

function checkPlatform (webApp: TWebApp): TPlatform {
    return webApp.platform;
}
