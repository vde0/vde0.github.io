import {
	useAppAccessor,
	useConnection,
	useIsMobile,
	useLocalChatter,
	usePeerState,
	useRemoteChatter,
	useStart,
} from '@hooks';
import { addDebug } from '@lib/utils';
import { ACC_FLAGS } from '@services/appAccessor';
import { PropsWithClassName } from '@types';
import { useEffect, useRef, useState } from 'react';
import empty_video from '../assets/img/empty_video.png';
import Video from '@components/Video';
import { whenLocalMedia } from '@api/localMedia';

type VideoChatProps = PropsWithClassName & { remote: boolean; hidden?: boolean };

const VideoChat: React.FC<VideoChatProps> = ({ className, remote, hidden = false }) => {
	const videoChatClassName = className ?? '';
	const useChatter = remote ? useRemoteChatter : useLocalChatter;

	const video = useRef<HTMLVideoElement | null>(null);

	const peerState = usePeerState();
	const [show, setShow] = useState<boolean>(false);

	const [, , media] = useChatter();
	const [, setAccessFlag] = useAppAccessor();

	// General effect
	useEffect(() => {
		if (!video.current) return;
		video.current.getAttribute('id') &&
			addDebug(video.current.getAttribute('id') as string, video.current);

		// === HANDLERS ===
		const pauseHandler = (evt: Event) => {
			(evt.target as HTMLVideoElement)?.load();
			(evt.target as HTMLVideoElement)?.play();
		};

		// === ADD LISTENERS ===
		video.current.onpause = pauseHandler;

		return () => {
			// === REMOVE LISTENERS ===
			if (video.current) video.current.onpause = null;
		};
	}, []);

	// Rules for playing or pausing local video
	useEffect(() => {
		if (remote) return;
		if (!video.current) return;

		whenLocalMedia(() => video.current?.play());

		video.current.onplaying = () => setShow(true);
		video.current.onwaiting = () => setShow(false);
		video.current.onended = () => setShow(false);
		video.current.onstalled = () => setShow(false);

		return () => {
			if (!video.current) return;

			video.current.onplaying = () => setShow(true);
			video.current.onwaiting = () => setShow(false);
			video.current.onended = () => setShow(false);
			video.current.onstalled = () => setShow(false);
		};
	}, [remote]);

	// Play remote video when user turn START and set appropriate APP FLAG
	useStart(() => {
		if (!remote) return;
		if (!video.current?.paused) return;
		video.current.play();
		setAccessFlag(ACC_FLAGS.PLAY_REMOTE_VIDEO);
	});

	// Update media
	useEffect(() => {
		if (!video.current) return;
		video.current.srcObject = media;
	}, [media]);

	// if REMOTE and only CONNECTED: show = true
	useEffect(() => {
		if (!remote) return;

		if (peerState === 'connected') setShow(true);
		else setShow(false);
	}, [peerState, remote]);

	return (
		<section
			hidden={hidden}
			className={
				videoChatClassName + ' relative w-full h-full rounded-xl flex items-center overflow-clip'
			}
		>
			<Video
				show={show}
				autoPlay
				ref={video}
				playsInline
				muted={!remote}
				id={remote ? 'remoteVideo' : 'localVideo'}
				className="scale-x-[-1] aspect-video w-full h-full object-fit [object-position:center_center] block"
			>
				<div className="absolute top-0 bottom-0 left-0 right-0 bg-cloud">
					<img
						src={empty_video}
						className="pointer-events-none block top-0 bottom-0 left-0 right-0 absolute m-auto"
					/>
				</div>
			</Video>
		</section>
	);
};

export default VideoChat;
