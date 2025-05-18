/** @jsxImportSource @emotion/react */
import { css, EmCss } from "@emotion/react";
import MsgItem from "./MsgItem";
import { useState } from "react";
import { MsgItem as SemanticMsgItem } from "@lib/chat-history";
import { SymbolChatter } from "@services/DuoChatUnit";
import { ChatSignalHub } from "@services/ChatSignalHub";


interface MsgListProps {
    history: SemanticMsgItem[];
}

const msgListCss: EmCss = css``;

const MsgList: React.FC<MsgListProps> = ({ history }) => {

    const msgCount   = useState<number>(history.length);

    return (
        <section css={msgListCss} className="px-2" >
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
)};


export default MsgList


function checkSender(sender: any) {
    try {}
    catch {}
}