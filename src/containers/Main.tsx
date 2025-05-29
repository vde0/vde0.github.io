/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import DisplayBox from "@components/DisplayBox";
import Controller from "@containers/Controller";
import VideoChat from "./VideoChat";
import TextChat from "./TextChat";
import { EmCss } from "@emotion/react"; // custom type
import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { TWebApp } from "@tg-types"; // custom type
import { useEffect, useLayoutEffect, useState } from "react";
import { useConnection, useMobileKeyboard, usePeerState, useUnread } from "@hooks";
import { ChatCValue } from "@store/ChatProvider";


const mainCss: EmCss = css`
    /* top: var(--tg-content-safe-area-inset-top);
    bottom: var(--tg-content-safe-area-inset-bottom); */
    top: 0;
    bottom: 0;

    max-height: var(--tg-viewport-stable-height);
    overflow: clip;
`;

const Main: React.FC = () => {

    const webApp:               TWebApp                                 = useWebApp();
    const [connection, updateConnection]                                = useConnection();
    const peerState:            RTCPeerConnection['connectionState']    = usePeerState();
    const keyboardStatus:       boolean                                 = useMobileKeyboard();
    const [, read]:             ChatCValue['unread']                    = useUnread();
    const [isTextChatShown, setIsTextChatShown]                         = useState<boolean>(false);


    useEffect(() => {
        connection.connect();
    }, [connection]);

    useEffect(() => {
        if (
            peerState === "closed" ||
            peerState === "failed" ||
            peerState === "disconnected"
        ) {
            updateConnection();
        }
    }, [peerState]);

    useLayoutEffect(() => {
        if (peerState !== "connected") setIsTextChatShown(false);
    }, [peerState]);

    useEffect(() => {
        if (isTextChatShown)    read(true);
        else                    read(false);
    }, [isTextChatShown]);

    useEffect(() => {

        try {
            webApp?.ready();
            webApp?.lockOrientation?.();
            webApp?.disableVerticalSwipes?.();
            webApp?.requestFullscreen?.();
        } catch (err) {}
    }, [webApp]);


    return (
    <div className={`w-full fixed px-3 md:px-8 box-border`} css={mainCss}>
        <section className="
            container max-w-xl h-full
            relative mx-auto text-white
            flex flex-col
        ">

            <section className={`grow flex flex-col gap-10 pt-8 ${keyboardStatus?"pb-0":"pb-8"} absolute top-0 bottom-0 w-full`}>
                <DisplayBox className="flex items-center overflow-hidden shrink-0">
                    <VideoChat remote />
                </DisplayBox>
                <DisplayBox className="flex items-center overflow-hidden">
                    <TextChat hidden={!isTextChatShown} />
                    <VideoChat remote={false} hidden={isTextChatShown} />
                </DisplayBox>
            </section>
            
            <div style={{ display: keyboardStatus?"none":"block" }} className="shrink-0 h-24">
                <Controller
                    onNext={() => {
                        if (
                            peerState !== "closed" &&
                            peerState !== "connected" &&
                            peerState !== "disconnected" &&
                            peerState !== "failed"
                        ) return;
                        connection.disconnect()
                    }}
                    onTextChat={() => { setIsTextChatShown(!isTextChatShown) }}
                />
            </div>

        </section>
    </div>
    );
};


export default Main