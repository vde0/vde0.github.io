/** @jsxImportSource @emotion/react */
import { css, EmCss } from "@emotion/react";
import MsgItem from "./MsgItem";
import { useState } from "react";
import { MsgItem as SemanticMsgItem } from "@lib/chat-history";
import { SymbolChatter } from "@services/DuoChatUnit";


interface MsgListProps {
    history: SemanticMsgItem[];
}

const msgListCss: EmCss = css``;

const MsgList: React.FC<MsgListProps> = ({ history }) => {

    const msgCount   = useState<number>(history.length);

    return (
        <section css={msgListCss} >
            {history.map( (sMsgItem, index) => (
                <MsgItem sender={sMsgItem.chatter as SymbolChatter} text={sMsgItem.text} key={index} />
            ) )}
        </section>
)};


export default MsgList


function checkSender(sender: any) {
    try {}
    catch {}
}