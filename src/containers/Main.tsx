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
import { useChatHistory, useChatUnit, useMobileKeyboard, useUnread } from "@hooks";
import { Peer } from "@lib/webrtc";
import { ChatSignalHub } from "@services/ChatSignalHub";
import { ChatHistory, ChatHistoryEventMap } from "@lib/chat-history";
import { Listener } from "@lib/pprinter-tools";
import { ChatValue } from "@store/ChatProvider";
import { DuoChatUnit } from "@services/DuoChatUnit";


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
    const chatUnit:             DuoChatUnit         = useChatUnit();
    const [unread, setUnread]:  ChatValue['unread'] = useUnread();
    const [isTextChatShown, setIsTextChatShown]     = useState<boolean>(false);


    useEffect(() => {
        chatHistory.add("Привет", chatUnit.localChatter);
        chatHistory.add("Чо не здороваешься, руки обоссали?", chatUnit.localChatter);
        chatHistory.add("Пошёл нахуй", chatUnit.remoteChatter);
        chatHistory.add("САМ ИДИ!", chatUnit.localChatter);
    }, []);

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
                    onTextChat={() => { console.log("TEXT CHAT SHOWN:", !isTextChatShown); setIsTextChatShown(!isTextChatShown) }}
                />
            </div>

        </section>
    </div>
    );
};


export default Main