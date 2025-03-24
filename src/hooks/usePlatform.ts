export {
    usePlatform,
    definePlatform,
    GetPlatform,
    SetPlatform,
    Updater, Update, ChestOfUpdate,
};


import { TPlatform, TWebApp } from "@tg-types";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { useLayoutEffect, useState } from "react";


type GetPlatform    = (webApp: TWebApp) => TPlatform;
type SetPlatform    = (nextPlatform: TPlatform, updateFunc: () => {}) => void;
//
type ChestOfUpdate  = {updater: Updater, update: Update};
type Updater        = boolean;
type Update         = (updater: Updater) => void;


const chestOfUpdate: ChestOfUpdate      = { updater: false, update: () => {} };
const [getPlatformVal, setPlatformVal]  = definePlatform(chestOfUpdate);

if (!window.debug) window.debug = {};
window.debug.setPlatform = setPlatformVal;

const usePlatform = (
    getPl: GetPlatform      = getPlatformVal,
    chest: ChestOfUpdate    = chestOfUpdate
): TPlatform => {

    const wapp: TWebApp             = useWebApp();
    const [platform, setPlatform]   = useState<TPlatform>( getPl(wapp) );

    const [updater, update]         = useState<boolean>(false);

    useLayoutEffect(() => {
        chest.updater   = updater;
        chest.update    = update;
    }, []);

    useLayoutEffect(() => {
        setPlatform( getPl(wapp) );
    }, [updater]);

    return platform;
};


function definePlatform ( {updater, update}: ChestOfUpdate ): [GetPlatform, SetPlatform] {

    let platform:   TPlatform | null    = null;

    const getPlatform: GetPlatform = (webApp) => {
        if (!webApp) throw Error("Missing the webApp arg.");

        platform = webApp.platform;
        return platform;
    };
    const setPlatform: SetPlatform = (nextPlatform) => {
        platform = nextPlatform;
        update(!updater);
    };

    return [getPlatform, setPlatform];
}
