/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import DisplayBox from "@components/DisplayBox";
import Controller from "@containers/Controller";
import VideoChat from "./VideoChat";
import TextChat from "./TextChat";
import { EmCss } from "@emotion/react"; // custom type
import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { TWebApp } from "@tg-types"; // custom type
import { useEffect, useState } from "react";
import { useChatHistory, useConnection, useMobileKeyboard, usePeerState, useUnread } from "@hooks";
import { ChatHistory, ChatHistoryEventMap } from "@lib/chat-history";
import { Listener } from "@lib/pprinter-tools";
import { ChatCValue } from "@store/ChatProvider";


const mainCss: EmCss = css`
    top: var(--tg-content-safe-area-inset-top);
    bottom: var(--tg-content-safe-area-inset-bottom);

    max-height: var(--tg-viewport-stable-height);
    overflow: clip;
`;

const Main: React.FC = () => {

    const webApp:               TWebApp                                 = useWebApp();
    const [connection, updateConnection]                                = useConnection();
    const peerState:            RTCPeerConnection['connectionState']    = usePeerState();
    const keyboardStatus:       boolean                                 = useMobileKeyboard();
    const chatHistory:          ChatHistory                             = useChatHistory();
    const [unread, setUnread]:  ChatCValue['unread']                    = useUnread();
    const [isTextChatShown, setIsTextChatShown]                         = useState<boolean>(false);


    useEffect(() => {
        setUnread(0);
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

    useEffect(() => {
        const addMsgHandler: Listener<ChatHistoryEventMap['add']> = () => {
            if (!isTextChatShown) setUnread(unread +1);
        };
        chatHistory.on('add', addMsgHandler);

        return () => chatHistory.off('add', addMsgHandler);
    }, [isTextChatShown, unread, chatHistory]);

    useEffect(() => {
        if (isTextChatShown) setUnread(0);
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
                        setIsTextChatShown(false);
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