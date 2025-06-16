import { v4 as uuidv4 } from 'uuid';

const ID = uuidv4();

export interface IProfile {
	id: string;
}

export const Profile: IProfile = {
	get id() {
		return ID;
	},
};
