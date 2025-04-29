/** @jsxImportSource @emotion/react */
import { css, EmCss } from "@emotion/react";
import MsgItem from "./MsgItem";
import { useRef } from "react";
import { MsgItem as SemanticMsgItem, SymbolChatter } from "@lib/textchat-history";


interface MsgListProps {
    correspondence: SemanticMsgItem[];
}

const msgListCss: EmCss = css``;

const MsgList: React.FC<MsgListProps> = ({ correspondence }) => {

    const msgCountRef   = useRef<number>(correspondence.length);

    return (
        <section css={msgListCss} >
            {correspondence.map( (sMsgItem, index) => <MsgItem
                sender={sMsgItem.user as SymbolChatter} text={sMsgItem.text} key={index} /> )}
        </section>
)};


export default MsgList


function checkSender(sender: any) {
    try {}
    catch {}
}