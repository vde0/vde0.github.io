import { ConnectContext } from "@store/ConnectProvider";
import { useContext } from "react";


interface User {
    id: string,
    ip?: string,
}

export const useGetCurUser = (): User => {
    const contextValue = useContext(ConnectContext);
    if (!contextValue) { throw new Error("useGetCurUser must be used within a Provider") }

    const {state: {curUserId}} = contextValue;
    return {id: curUserId};
};

export const useGetOutUser = (): User => {
    const contextValue = useContext(ConnectContext);
    if (!contextValue) { throw new Error("useGetOutUser must be used within a Provider") }

    const {state: {outUserId}} = contextValue;
    return {id: outUserId};
};