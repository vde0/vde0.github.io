import { Connection } from "@services/Connection";
import { createContext, PropsWithChildren, useRef, useState } from "react";


export type UpdateConnection = () => void;
export type ConnectionCValue = [Connection, UpdateConnection];

export const ConnectionContext  = createContext<ConnectionCValue | null>(null);


export const ConnectionProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const [connection, setConnection]   = useState( Connection() );
    const updateConnectionRef           = useRef<UpdateConnection>(() => {
        connection.destroy();
        setConnection( Connection() );
    });

    return (
        <ConnectionContext.Provider value={[connection, updateConnectionRef.current]}>
            {children}
        </ConnectionContext.Provider>
    );
};