import { useIsMobile, useLocalChatter, useRemoteChatter } from "@hooks";
import { addDebug } from "@lib/utils";
import { ACC_FLAGS, ChatSignalHub } from "@services/ChatSignalHub";
import { PropsWithClassName } from "@types";
import { useEffect, useRef } from "react";
import empty_video from "../assets/img/empty_video.png";
import Video from "@components/Video";


type VideoChatProps = PropsWithClassName & { remote: boolean, hidden?: boolean };

const VideoChat: React.FC<VideoChatProps> = ({ className, remote, hidden=false }) => {

    const videoChatClassName = className ?? "";

    const useChatter = remote ? useRemoteChatter : useLocalChatter;
    
    const video     = useRef<HTMLVideoElement | null>(null);
    const poster    = useRef<HTMLDivElement | null>(null);
    const [,,media] = useChatter();
    const isMobile  = useIsMobile();

    useEffect(() => {
        if (!video.current) return;
        video.current.srcObject = media;
        video.current.getAttribute("id") && addDebug(video.current.getAttribute("id") as string, video.current);
    }, [media]);

    useEffect(() => {
        addDebug(remote?"remoteVide":"localVideo", video.current);

        if ( !(remote && poster.current) ) return;

        // === HANDLERS ===
        const pauseHandler = (evt: Event) => {
            (evt.target as HTMLVideoElement)?.load();
            (evt.target as HTMLVideoElement)?.play();
        };
        const tapHandler = () => {
            if ( !video.current?.paused ) return;
            video.current.play();
            ChatSignalHub.signalAccessor.set(ACC_FLAGS.PLAY_REMOTE_VIDEO);

            if ( !poster.current ) return;
            poster.current.hidden = true;
        };

        // === ADD LISTENERS ===
        if (video.current) video.current.onpause            = pauseHandler;
        
        poster.current[isMobile?"ontouchend":"onclick"]     = tapHandler;

        return () => {
            // === REMOVE LISTENERS ===
            if (video.current) video.current.onpause = null;
            if (!poster.current) return;
            poster.current.ontouchend   = null;
            poster.current.onclick      = null;
        };
    }, []);
    

    return (
        <section hidden={hidden} className={videoChatClassName + " relative w-full h-full bg-cloud rounded-xl flex items-center overflow-clip"}>
            <Video
                poster={empty_video}
                autoPlay ref={video} playsInline muted={!remote}
                id={remote?"remoteVideo":"localVideo"}
                className="scale-x-[-1] aspect-video w-full h-full object-fit [object-position:center_center] block"
            />
            {remote && <div ref={poster} className="
                absolute
                top-0 bottom-0 left-0 right-0
                bg-gray-900/75
                flex justify-center items-center"
            >
                <span className="block text-white font-bold text-lg font-stretch-extra-expanded">TAP ME</span>
            </div>}
        </section>
    );
};


export default VideoChat