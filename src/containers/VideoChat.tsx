import { useLocalChatter, useRemoteChatter } from "@hooks";
import { addDebug } from "@lib/utils";
import { ACC_FLAGS, ChatSignalHub } from "@services/ChatSignalHub";
import { PropsWithClassName } from "@types";
import { useEffect, useRef } from "react";


type VideoChatProps = PropsWithClassName & { remote?: boolean };

const VideoChat: React.FC<VideoChatProps> = ({ className, remote = false }) => {

    if ( !className ) className = "";

    const useChatter = remote ? useRemoteChatter : useLocalChatter;
    
    const video     = useRef<HTMLVideoElement | null>(null);
    const poster    = useRef<HTMLDivElement | null>(null);
    const [,,media] = useChatter();

    useEffect(() => {
        if (!video.current) return;
        video.current.srcObject = media;
        video.current.getAttribute("id") && addDebug(video.current.getAttribute("id") as string, video.current);
    }, [media]);

    useEffect(() => {
        if ( !(remote && poster.current) ) return;

        const handler = () => {
            if ( !video.current?.paused ) return;
            console.log("USER GESTURE EFFECT");
            video.current.play();
            ChatSignalHub.signalAccessor.set(ACC_FLAGS.PLAY_REMOTE_VIDEO);

            if ( !poster.current ) return;
            poster.current.hidden = true;
        };
        
        poster.current.ontouchend   = handler;
        poster.current.onclick      = handler;

        return () => { if (poster.current) { poster.current.ontouchend = null; poster.current.onclick = null; } };
    }, []);

    useEffect(() => {
        console.log("MOUNTED VIDEO ELEMENT", video.current);
        if (video.current) video.current.onpause = () => video.current?.load() || video.current?.play();
    }, [video.current]);

    return (
        <section className={className + " relative aspect-video overflow-clip w-full h-auto"}>
                <video
                    autoPlay ref={video} playsInline muted={!remote}
                    id={remote?"remoteVideo":"localVideo"}
                    className="scale-x-[-1] aspect-video w-full h-full object-cover [object-position:center_center] block"
                />
            {remote
            ?   <div ref={poster} className="
                    absolute
                    top-0 bottom-0 left-0 right-0
                    bg-gray-900/75
                    flex justify-center items-center"
                >
                    <span className="block text-white font-bold text-lg font-stretch-extra-expanded">TAP ME</span>
                </div>
            :   ""
            }
        </section>
    );
};


export default VideoChat