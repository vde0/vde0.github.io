/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import DisplayBox from "@components/DisplayBox";
import Controller from "@components/Controller";
import VideoChat from "./VideoChat";
import TextChat from "./TextChat";
import { EmCss } from "@emotion/react"; // custom type
import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { TWebApp } from "@tg-types"; // custom type
import { useEffect, useLayoutEffect, useState } from "react";
import { useChatHistory, useMobileKeyboard, useUnread } from "@hooks";
import { Peer } from "@lib/webrtc";
import { ChatSignalHub } from "@services/ChatSignalHub";
import { ChatHistory, ChatHistoryEventMap } from "@lib/chat-history";
import { Listener } from "@lib/pprinter-tools";
import { ChatValue } from "@store/ChatProvider";


const mainCss: EmCss = css`
    top: var(--tg-content-safe-area-inset-top);
    bottom: var(--tg-content-safe-area-inset-bottom);

    max-height: var(--tg-viewport-stable-height);
    overflow: clip;
`;

const Main: React.FC = () => {

    const webApp:               TWebApp             = useWebApp();
    const keyboardStatus:       boolean             = useMobileKeyboard();
    const chatHistory:          ChatHistory         = useChatHistory();
    const [unread, setUnread]:  ChatValue['unread'] = useUnread();
    const [isTextChatShown, setIsTextChatShown]     = useState<boolean>(false);

    useLayoutEffect(() => {

        ChatSignalHub.takePeer( new Peer() );

        try {
            webApp?.ready();
            webApp?.lockOrientation?.();
            webApp?.disableVerticalSwipes?.();
            webApp?.requestFullscreen?.();
        } catch (err) {}
    }, []);

    useEffect(() => {
        const addMsgHandler: Listener<ChatHistoryEventMap['add']> = () => {
            console.log("INCREMENT UNREAD");
            console.log("TEXT CHAT SHOW", isTextChatShown);
            if (!isTextChatShown) setUnread(unread +1);
        };
        chatHistory.on('add', addMsgHandler);

        return () => chatHistory.off('add', addMsgHandler);
    }, [isTextChatShown, unread]);

    useEffect(() => {
        if (isTextChatShown) setUnread(0);
    }, [isTextChatShown]);


    return (
    <div className="w-full fixed px-3 md:px-8 box-border" css={mainCss}>
        <section className="
            container max-w-xl h-full
            relative mx-auto text-white
            flex flex-col
        ">

            <section className="grow flex flex-col gap-10 py-8">
                <DisplayBox className="flex items-center overflow-hidden">
                    <VideoChat remote />
                </DisplayBox>
                <DisplayBox className="flex items-center overflow-hidden">
                    <TextChat hidden={!isTextChatShown} />
                    <VideoChat remote={false} hidden={isTextChatShown} />
                </DisplayBox>
            </section>
            
            { !keyboardStatus
                ? <div className="shrink-0 h-24">
                    <Controller onTextChat={() => { console.log("TEXT CHAT SHOWN:", !isTextChatShown); setIsTextChatShown(!isTextChatShown) }} />
                </div>
                : null
            }

        </section>
    </div>
    );
};


export default Main