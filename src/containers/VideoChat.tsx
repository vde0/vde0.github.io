import { useLocalVideo, useRemoteMedia } from "@hooks";
import { addDebug } from "@lib/utils";
import { PropsWithClassName } from "@types";
import { useEffect, useRef } from "react";


type VideoChatProps = PropsWithClassName & { remote?: boolean };

const VideoChat: React.FC<VideoChatProps> = ({ className, remote = false }) => {
    
    const ref           = useRef<HTMLVideoElement | null>(null)
    const remoteMedia   = useRemoteMedia();
    const localMedia    = useLocalVideo();

    useEffect(() => {
        if (!ref.current) return;
        ref.current.srcObject = remote ? remoteMedia : localMedia;
        ref.current.getAttribute("id") && addDebug(ref.current.getAttribute("id") as string, ref.current);

        // TODO: IMPLEMENT PLAYING BY USER GESTURE
        ref.current.play();
    }, [localMedia, remoteMedia, remote]);

    return (
        <section className={className}>
            <video className="aspect-video object-cover block w-full h-auto" id={remote?"remoteVideo":"localVideo"} ref={ref} playsInline muted={true} />
        </section>
    );
};


export default VideoChat