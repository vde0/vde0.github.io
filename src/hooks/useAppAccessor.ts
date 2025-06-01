import { getAccess, set, when } from '@services/AppAccessor';
import { useEffect, useState } from 'react';

export const useAppAccessor = (): [ReturnType<typeof getAccess>, typeof set, typeof when] => {
	const [access, setAccess] = useState(getAccess());

	useEffect(() => {
		when(() => setAccess(getAccess()));
	}, []);

	return [access, set, when];
};
