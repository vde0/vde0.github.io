/** @jsxImportSource @emotion/react */
import { css, EmCss } from "@emotion/react";
import MsgItem from "./MsgItem";
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MsgItem as SemanticMsgItem } from "@lib/chat-history";
import { ChatSignalHub } from "@services/ChatSignalHub";
import { useChatHistory } from "@hooks";


interface MsgListProps {
    history: SemanticMsgItem[];
}

const msgListCss: EmCss = css``;

const MsgList = forwardRef<HTMLElement, MsgListProps>(({ history }, ref) => {
    const listRef       = useRef<HTMLElement | null>(null);


    useEffect(() => {
        if (ref) {
            if (typeof ref === "function")  ref(listRef.current);
            else                            ref.current = listRef.current;
        }
    }, []);


    return (
        <section ref={listRef} css={msgListCss} className="px-2" >
            {history.map( (sMsgItem, index) => {
                const [sender, direction] = sMsgItem.chatter === ChatSignalHub.getChatUnit().localChatter
                    ? ["Вы", "right" as 'right']
                    : ["Собеседник", "left" as 'left']
                ;
                

                return (
                    <MsgItem sender={sender} text={sMsgItem.text} direction={direction} key={index} />
                )
            } )}
        </section>
)});


export default MsgList


function checkSender(sender: any) {
    try {}
    catch {}
}