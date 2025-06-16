import {
	CONNECTION_EVENTS,
	ConnectionEventMap,
	ConnectionState,
	IConnection,
} from '@entities/Connection';
import { Session, SESSION_EVENTS, SessionEventMap } from '@entities/Session';
import { Listener } from '@lib/pprinter-tools';
import { useEffect, useState } from 'react';

export const useConnection = (): IConnection | null => {
	const [connection, setConnection] = useState<IConnection | null>(Session.connection);

	useEffect(() => {
		const nextTargetHandler: Listener<SessionEventMap['nexttarget']> = function ({ connection }) {
			setConnection(connection);
		};

		Session.on(SESSION_EVENTS.NEXT_TARGET, nextTargetHandler);
		return () => Session.off(SESSION_EVENTS.NEXT_TARGET, nextTargetHandler);
	}, []);

	return connection;
};

export const useConnectionState = (): ConnectionState | null => {
	const connection: IConnection | null = useConnection();
	const [connectionState, setConnectionState] = useState<ConnectionState | null>(
		connection?.getState() ?? null
	);

	useEffect(() => {
		if (!connection) return;

		setConnectionState(connection.getState());

		const stateUpdatedHandler: Listener<ConnectionEventMap['stateupdated']> = ({ state }) => {
			setConnectionState(state);
		};

		connection.on(CONNECTION_EVENTS.STATE_UPDATED, stateUpdatedHandler);
		return () => connection.off(CONNECTION_EVENTS.STATE_UPDATED, stateUpdatedHandler);
	}, [connection]);

	return connectionState;
};
