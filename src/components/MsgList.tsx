/** @jsxImportSource @emotion/react */
import { css, EmCss } from "@emotion/react";
import MsgItem from "./MsgItem";
import { useRef } from "react";


interface MsgListProps {
    correspondence: string[];
}

const msgListCss: EmCss = css``;

const MsgList: React.FC<MsgListProps> = ({ correspondence }) => {

    const msgCountRef   = useRef<number>(correspondence.length / 2);
    const sendersRef    = useRef<number[]>(
        new Array(msgCountRef.current).map( (_, num) => Number(correspondence[num]) ) );
    const msgsRef       = useRef<string[]>(
        new Array(msgCountRef.current).map( (_, num) => correspondence[num +1] ) );

    const msgCount: number      = msgCountRef.current;
    const senders:  number[]    = sendersRef.current;
    const msgs:     string[]    = msgsRef.current;

    return (
        <section css={msgListCss} >
            {new Array(msgCount).map( (_, num) => <MsgItem
                id={Number(senders[num])} text={msgs[num]} key={num} /> )}
        </section>
)};


export default MsgList


function checkSender(sender: any) {
    try {}
    catch {}
}