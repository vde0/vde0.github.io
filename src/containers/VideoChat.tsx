import { useLocalChatter, useRemoteChatter } from "@hooks";
import { addDebug } from "@lib/utils";
import { ACC_FLAGS, ChatSignalHub } from "@services/ChatSignalHub";
import { PropsWithClassName } from "@types";
import { useEffect, useRef } from "react";


type VideoChatProps = PropsWithClassName & { remote?: boolean };

const VideoChat: React.FC<VideoChatProps> = ({ className, remote = false }) => {

    if ( !className ) className = "";
    
    const video             = useRef<HTMLVideoElement | null>(null);
    const poster            = useRef<HTMLDivElement | null>(null);
    const [,,remoteMedia]   = useRemoteChatter();
    const [,,localMedia]    = useLocalChatter();

    useEffect(() => {
        if (!video.current) return;
        video.current.srcObject = remote ? remoteMedia : localMedia;
        video.current.getAttribute("id") && addDebug(video.current.getAttribute("id") as string, video.current);
    }, [localMedia, remoteMedia, remote]);

    useEffect(() => {
        if ( !remote ) return;
        if ( !(poster.current && video.current) ) return;

        console.log("USER GESTURE EFFECT");
        console.log(poster.current);

        const handler = () => {
            console.log("HANDLER EXEC");
            if ( !video.current ) return;
            video.current.play();
            ChatSignalHub.signalAccessor.set(ACC_FLAGS.PLAY_REMOTE_VIDEO);

            if ( !poster.current ) return;
            poster.current.hidden = true;
        };
        
        poster.current.ontouchend   = handler;
        poster.current.onclick      = handler;

        return () => { console.log("OFF HANDLER"); if (poster.current) { poster.current.ontouchend = null; poster.current.onclick = null; } };
    }, [video.current, poster.current]);

    return (
        <section className={className + " relative"}>
            <video
                autoPlay ref={video} playsInline muted={!remote}
                id={remote?"remoteVideo":"localVideo"}
                className="scale-x-[-1] aspect-video object-cover block w-full h-auto" />
            {remote
            ?   <div ref={poster} className="absolute top-0 bottom-0 left-0 right-0">
                    <span className="block text-gray-950">TAP ME</span>
                </div>
            :   ""
            }
        </section>
    );
};


export default VideoChat