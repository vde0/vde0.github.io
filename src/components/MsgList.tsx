/** @jsxImportSource @emotion/react */
import { css, EmCss } from "@emotion/react";
import MsgItem from "./MsgItem";
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MsgItem as SemanticMsgItem } from "@lib/chat-history";
import { useChatHistory, useChatUnit } from "@hooks";


interface MsgListProps {
    history: SemanticMsgItem[];
}

const msgListCss: EmCss = css``;

const MsgList = forwardRef<HTMLElement, MsgListProps>(({ history }, ref) => {

    const listRef       = useRef<HTMLUListElement | null>(null);
    const chatUnit      = useChatUnit();


    useEffect(() => {
        if (ref) {
            if (typeof ref === "function")  ref(listRef.current);
            else                            ref.current = listRef.current;
        }
    }, []);


    return (
        <ul ref={listRef} css={msgListCss} className="px-2" >
            {history.map( (sMsgItem, index) => {
                const [sender, direction] = sMsgItem.chatter === chatUnit.localChatter
                    ? ["Вы", "right" as 'right']
                    : ["Собеседник", "left" as 'left']
                ;
                

                return (
                    <li className={`${index===history.length-1?"mb-0":"mb-2"}`}>
                        <MsgItem sender={sender} text={sMsgItem.text} direction={direction} key={index} />
                    </li>
                )
            } )}
        </ul>
)});


export default MsgList


function checkSender(sender: any) {
    try {}
    catch {}
}