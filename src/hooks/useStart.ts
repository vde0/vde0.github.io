import { getStarted, onStart, start } from '@services/Start';
import { useEffect, useState } from 'react';

export const useStart = (): [ReturnType<typeof getStarted>, typeof start, typeof onStart] => {
	const [started, setStarted] = useState(getStarted());

	useEffect(() => {
		onStart(() => setStarted(getStarted()));
	}, []);

	return [started, start, onStart];
};
