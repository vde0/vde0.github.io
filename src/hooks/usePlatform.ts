export {
    usePlatform,
    definePlatform,
    GetPlatform,
    SetPlatform,
    UpdateState, Updater,
};


import { TPlatform, TWebApp } from "@tg-types";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { useLayoutEffect, useState } from "react";


type GetPlatform    = (webApp: TWebApp) => TPlatform;
type SetPlatform    = (nextPlatform: TPlatform, updateFunc: () => {}) => void;
type SetUpdater     = (updateState: UpdateState, updater: Updater) => void;
//
type Updater        = (updateState: UpdateState) => void;
type UpdateState    = boolean;


const [getPlatformVal, setPlatformVal, setUpdater] = definePlatform();

if (!window.debug) window.debug = {};
window.debug.setPlatform = setPlatformVal;

const usePlatform = (
    getPl: GetPlatform = getPlatformVal,
    setUp: SetUpdater = setUpdater
): TPlatform => {

    const wapp: TWebApp             = useWebApp();
    const [platform, setPlatform]   = useState<TPlatform>( getPl(wapp) );

    const [updateState, updater]         = useState<boolean>(false);
    setUp(updateState, updater);

    useLayoutEffect(() => {
        setPlatform( getPl(wapp) );
    }, [updateState]);

    return platform;
};


function definePlatform (): [GetPlatform, SetPlatform, SetUpdater] {

    let platformInChest:    TPlatform | null    = null;
    let updaterInChest:     Updater             = () => {};
    let updateStateInChest: UpdateState         = false;

    const getPlatform: GetPlatform = (webApp) => {
        if (!webApp) throw Error("Missing the webApp arg.");

        platformInChest = webApp.platform;
        return platformInChest;
    };
    const setPlatform: SetPlatform = (nextPlatform) => {
        platformInChest = nextPlatform;
        updaterInChest(!updateStateInChest);
    };
    const setUpdater: SetUpdater = (updateState, updater) => {
        updaterInChest      = updater;
        updateStateInChest  = updateState;
    };

    return [getPlatform, setPlatform, setUpdater];
}
