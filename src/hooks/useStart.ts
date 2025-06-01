import { getStart, onStart, start } from "@services/Start";
import { useEffect, useState } from "react";


export const useStart = (): [ReturnType<typeof getStart>, typeof start] => {

    const [startState, setStartState]   = useState( getStart() );

    useEffect(() => {
        onStart(() => setStartState( getStart() ));
    }, []);

    return [startState, start]
};