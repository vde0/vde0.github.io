import { ContentMedia } from '@types';
import { once } from '@utils';

// === DATA ===
export type LocalMediaHandler = (localMedia: ContentMedia) => void;
export type LocalMedia = ContentMedia | undefined;
const handlers: Set<LocalMediaHandler> = new Set();
let localMedia: LocalMedia;

// === HELPERS ===
const execHandlers = (stream: ContentMedia): void => {
	for (let h of handlers) h(stream);
	handlers.clear();
};

const lazyInit = once((): void => {
	navigator.mediaDevices
		.getUserMedia({
			video: {
				frameRate: {
					ideal: 10,
					max: 15,
				},
				width: { ideal: 1280 },
				height: { ideal: 720 },
				aspectRatio: { ideal: 16 / 9 },
				facingMode: 'user',
			},
			audio: true,
		})
		.then((stream) => {
			localMedia = stream;
			execHandlers(localMedia);
		})
		.catch((err) => {
			localMedia = null;
			console.error('Error getting local media stream:', err);
			execHandlers(localMedia);
		});
});

// === PUBLIC API ===
export const whenLocalMedia = (handler: LocalMediaHandler): void => {
	if (!localMedia) {
		handlers.add(handler);
		return;
	}
	handler(localMedia);
};

export const getLocalMedia = (): LocalMedia => localMedia;

export const requestLocalMedia = () => {
	navigator.mediaDevices
		.getUserMedia({
			video: {
				frameRate: {
					ideal: 10,
					max: 15,
				},
				width: { ideal: 1280 },
				height: { ideal: 720 },
				aspectRatio: { ideal: 16 / 9 },
				facingMode: 'user',
			},
			audio: true,
		})
		.then((stream) => {
			localMedia = stream;
			execHandlers(localMedia);
		})
		.catch((err) => {
			localMedia = null;
			console.error('Error getting local media stream:', err);
			execHandlers(localMedia);
		});
};
