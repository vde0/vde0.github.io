import { IRoom, Room } from 'entities/Room';
import { createContext, PropsWithChildren, useRef, useState } from 'react';

export type UpdateRoom = () => void;
export type RoomCValue = [IRoom, UpdateRoom];

export const RoomContext = createContext<RoomCValue | null>(null);

export const RoomProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [room, setRoom] = useState(new Room());
	const updateRoomRef = useRef<UpdateRoom>(() => {
		room.connection.close();
		setRoom(new Room());
	});

	return (
		<RoomContext.Provider value={[room, updateRoomRef.current]}>{children}</RoomContext.Provider>
	);
};
