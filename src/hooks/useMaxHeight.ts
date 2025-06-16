import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { TWebApp } from '@tg-types';
import { useEffect, useState } from 'react';
import { addDebug, getWebApp } from '@utils';

const webApp: TWebApp | null = getWebApp();
if (!webApp) throw Error('Undefined WebApp.');

export type GetHeight = () => number;
const getMaxHeight: GetHeight = defineMaxHeight(() => webApp.viewportHeight);

export const useMaxHeight = (getMX: GetHeight = getMaxHeight): number => {
	const webApp: TWebApp = useWebApp();
	if (!webApp) throw Error('webApp was undefined');

	const [maxHeight, setMaxHeight] = useState<number>(getMX());

	useEffect(() => {
		const vpChangedHandler = ({ isStateStable }: { isStateStable: boolean }): void => {
			if (!isStateStable) return;
			addDebug('maxHeight', getMX());
			setMaxHeight(getMX());
		};

		webApp.onEvent('viewportChanged', vpChangedHandler);
		return () => webApp.offEvent('viewportChanged', vpChangedHandler);
	}, [webApp]);

	return maxHeight;
};

// === HELPERS ===
export function defineMaxHeight(getHeight: GetHeight): GetHeight {
	let maxHeight: number = getHeight();

	const getMaxHeight: GetHeight = () => {
		const curHeight: number = getHeight();
		maxHeight = curHeight > maxHeight ? curHeight : maxHeight;
		//
		return maxHeight;
	};

	return getMaxHeight;
}
