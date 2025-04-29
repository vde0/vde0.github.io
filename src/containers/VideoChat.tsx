import { useLocalMedia, useRemoteMedia } from "@hooks";
import { PropsWithClassName } from "@types";
import { useEffect, useRef } from "react";


type VideoChatProps = PropsWithClassName & { remote?: boolean };

const VideoChat: React.FC<VideoChatProps> = ({ className, remote = false }) => {
    
    const ref           = useRef<HTMLVideoElement | null>(null)
    const remoteMedia   = useRemoteMedia();
    const localMedia    = useLocalMedia();

    useEffect(() => {
        if (!ref.current) return;
        ref.current.srcObject = remote ? remoteMedia : localMedia;
    }, [localMedia, remoteMedia, remote]);

    return (
        <section className={className}>
            <video id={remote?"remoteVideo":"localVideo"} muted={!remote} ref={ref} autoPlay />
        </section>
    );
};


export default VideoChat