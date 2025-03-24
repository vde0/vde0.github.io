export {
    usePlatform,
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


function checkPlatform (webApp: TWebApp): TPlatform {
    return webApp.platform;
}
