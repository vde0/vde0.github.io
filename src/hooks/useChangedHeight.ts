export { useChangedHeight, defineChangedHeight, GetChangedHeight };


import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { TWebApp } from "@tg-types"
import { useLayoutEffect, useState } from "react";
import { getWebApp } from "@utils";


const webApp = getWebApp();
if (!webApp) throw Error("Undefined WebApp");

type GetChangedHeight = () => number;
const getChangedHeight: GetChangedHeight = defineChangedHeight( () => webApp.viewportHeight );


const useChangedHeight = ( getCH: GetChangedHeight = getChangedHeight ): number => {

    const webApp: TWebApp           = useWebApp();
    if (!webApp)    throw Error("webApp was undefined");

    const [changedHeight, setChangedHeight] = useState<number>( getCH() );

    useLayoutEffect(() => {

        function vpChangedHandler ({ isStateStable }: { isStateStable: boolean }): void {
            if (!isStateStable) return;
            setChangedHeight( getCH() );
        };

        webApp.onEvent("viewportChanged", vpChangedHandler);
        return () => webApp.offEvent("viewportChanged", vpChangedHandler);
    }, [webApp, getCH]);

    return changedHeight;
};


function defineChangedHeight (getHeight: () => number): GetChangedHeight {

    let changedHeight:   number  = 0;
    let savedHeight:     number  = getHeight();

    const getChangedHeight: GetChangedHeight = () => {

        const curHeight: number = getHeight();
        changedHeight           = savedHeight - curHeight;
        savedHeight             = curHeight;
        //
        return changedHeight;
    };

    return getChangedHeight;
};
