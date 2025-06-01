import { getLocalMedia, LocalMedia, whenLocalMedia } from '@api/localMedia';
import { useEffect, useState } from 'react';

export const useLocalMedia = (): LocalMedia => {
	const [localMedia, setLocalMedia] = useState<LocalMedia>(getLocalMedia());

	useEffect(() => {
		whenLocalMedia((media) => setLocalMedia(media));
	}, []);

	return localMedia;
};
