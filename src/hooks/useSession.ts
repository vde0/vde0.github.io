import { ISession, Session } from '@entities/Session';

export function useSession(): ISession {
	return Session;
}
