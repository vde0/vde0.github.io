/** @jsxImportSource @emotion/react */
import { css, EmCss } from "@emotion/react";
import MsgItem from "./MsgItem";
import { useRef } from "react";
import { MsgItem as SemanticMsgItem } from "@lib/chat-history";
import { SymbolChatter } from "@services/DuoChatUnit";


interface MsgListProps {
    correspondence: SemanticMsgItem[];
}

const msgListCss: EmCss = css``;

const MsgList: React.FC<MsgListProps> = ({ correspondence }) => {

    const msgCountRef   = useRef<number>(correspondence.length);

    return (
        <section css={msgListCss} >
            {correspondence.map( (sMsgItem, index) => <MsgItem
                sender={sMsgItem.chatter as SymbolChatter} text={sMsgItem.text} key={index} /> )}
        </section>
)};


export default MsgList


function checkSender(sender: any) {
    try {}
    catch {}
}