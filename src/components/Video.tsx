import { forwardRef, useEffect, useRef, VideoHTMLAttributes } from "react";


type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
    mirror?:    boolean;
};

const VideoChat = forwardRef<HTMLVideoElement | null, VideoProps>(({ className, mirror = false, poster, ...props }, ref) => {

    const videoRef  = useRef<HTMLVideoElement | null>(null);
    const posterRef = useRef<HTMLImageElement | null>(null);

    const videoClassName = className ?? "";

    useEffect(() => {
        console.log("VIDEO REF", ref);
        if ( !(videoRef.current) ) throw Error(
            "'Video' component has not rendered at DOM."
        );

        const pauseHandler  = () => posterRef.current!.hidden = false;
        const playHandler   = () => posterRef.current!.hidden = true;

        if (ref) {
            if (typeof ref === "function") {
                ref(videoRef.current);
            } else {
                ref.current = videoRef.current;
            }
        }

        if (poster) {
            videoRef.current!.addEventListener("waiting", pauseHandler); 
            videoRef.current!.addEventListener("playing", playHandler);
        }

        return () => {
            if (ref) {
                if (typeof ref === "function") {
                    ref(null);
                } else {
                    ref.current = null;
                }
            }

            if (!poster) return;
            videoRef.current?.removeEventListener("pause", pauseHandler); 
            videoRef.current?.removeEventListener("play", playHandler); 
        };
    }, []);

    return (
        <section className={"relative aspect-video overflow-clip w-full h-auto"}>
            <video {...props}
                ref={videoRef}
                className={`${videoClassName}
                    ${mirror ? "scale-x-[-1]" : ""}
                    aspect-video w-full h-full
                    object-cover [object-position:center_center] block
                `
            }/>
            {poster && <img src={poster} ref={posterRef}
                className="
                    block absolute mx-auto
                    top-0 bottom-0 left-0 right-0
                "
            />}
        </section>
    );
});


export default VideoChat