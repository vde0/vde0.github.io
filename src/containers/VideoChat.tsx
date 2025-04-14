import { useRemoteMedia } from "@hooks";
import { PropsWithClassName } from "@types";
import { useEffect, useRef } from "react";


const VideoChat: React.FC<PropsWithClassName> = ({ className }) => {
    
    const ref           = useRef<HTMLVideoElement | null>(null)
    const remoteMedia   = useRemoteMedia();

    useEffect(() => {
        if (!ref.current) return;
        ref.current.srcObject = remoteMedia;
    }, [remoteMedia]);

    return (
        <section className={className}>
            <video ref={ref} autoPlay />
        </section>
    );
};


export default VideoChat