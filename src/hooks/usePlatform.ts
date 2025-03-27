export {
    usePlatform,
    definePlatform,
    GetPlatform,
    SetPlatform,
    Updater, Update, ChestOfUpdate,
};


import { TPlatform, TWebApp } from "@tg-types";
import { addDebug, getWebApp } from "@utils";
import { useLayoutEffect, useState } from "react";


type GetPlatform    = () => TPlatform;
type SetPlatform    = (nextPlatform: TPlatform) => void;
//
type ChestOfUpdate  = {updateSet: Set<Update>, updateMap: Map<Update, Updater>};
type Updater        = boolean;
type Update         = (updater: Updater) => void;


const chestOfUpdate: ChestOfUpdate      = { updateSet: new Set(), updateMap: new Map() };
const [getPlatformVal, setPlatformVal]  = definePlatform(
    ( getWebApp() ),
    chestOfUpdate
);

if (!window.debug) window.debug = {};
addDebug("setPlatform", setPlatformVal);
addDebug("getPlatform", getPlatformVal);


const usePlatform = (
    getPl: GetPlatform      = getPlatformVal,
    chest: ChestOfUpdate    = chestOfUpdate
): TPlatform => {
    const [platform, setPlatform]   = useState<TPlatform >( getPl() );
    const [updater, update]         = useState<boolean>(false);

    useLayoutEffect(() => {
        chest.updateSet.add(update);
        chest.updateMap.set(update, updater);
        return () => { chest.updateSet.delete(update); chest.updateMap.delete(update)};
    }, []);

    useLayoutEffect(() => {
        setPlatform( getPl() );
    }, [updater]);

    return platform;
};


function definePlatform (
    webApp: TWebApp | null,
    {updateSet, updateMap}: ChestOfUpdate

): [GetPlatform, SetPlatform] {

    if (!webApp) console.error("webApp arg is null");
    let platform:   TPlatform   = webApp?.platform ?? "unknown";

    const getPlatform: GetPlatform = () => {
        return platform;
    };
    const setPlatform: SetPlatform = (nextPlatform) => {
        platform = nextPlatform;
        updateSet.forEach( update => update( !updateMap.get(update) ) );
    };

    return [getPlatform, setPlatform];
}
