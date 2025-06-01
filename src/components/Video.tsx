import { forwardRef, PropsWithChildren, useEffect, useRef, VideoHTMLAttributes } from 'react';

type VideoProps = VideoHTMLAttributes<HTMLVideoElement> &
	PropsWithChildren & {
		mirror?: boolean;
		show?: boolean;
	};

const Video = forwardRef<HTMLVideoElement | null, VideoProps>(
	({ className, children, hidden = false, show = true, mirror = false, ...props }, ref) => {
		const videoClassName = className ?? '';

		const videoRef = useRef<HTMLVideoElement | null>(null);

		// === REF DEFINE ===
		useEffect(() => {
			if (!videoRef.current) throw Error("'Video' component has not rendered at DOM.");

			if (!ref) return;

			if (typeof ref === 'function') {
				ref(videoRef.current);
			} else {
				ref.current = videoRef.current;
			}

			return () => {
				if (typeof ref === 'function') {
					ref(null);
				} else {
					ref.current = null;
				}
			};
		}, []);

		return (
			<section hidden={hidden} className={'relative aspect-video overflow-clip w-full h-full'}>
				<video
					{...props}
					ref={videoRef}
					className={`${videoClassName}
                    ${mirror ? 'scale-x-[-1]' : ''}
                    aspect-video w-full
                    object-cover [object-position:center_center] block
                `}
				/>
				{!show && children}
			</section>
		);
	}
);

export default Video;
