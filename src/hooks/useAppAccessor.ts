import { appAcessor } from '@services/appAccessor';
import { useEffect, useState } from 'react';

const { getAccess, when, set } = appAcessor;

export const useAppAccessor = (): [ReturnType<typeof getAccess>, typeof set, typeof when] => {
	const [access, setAccess] = useState(getAccess());

	useEffect(() => {
		when(() => setAccess(getAccess()));
	}, []);

	return [access, set, when];
};
