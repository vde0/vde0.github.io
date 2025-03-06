/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { emCss } from "@types";
import MsgItem from "./MsgItem";
import { useMemo, useState, useRef } from "react";


interface msgListProps {
    correspondence: string[],
}

const msgListCss: emCss = css``;

const MsgList: React.FC<msgListProps> = ({ correspondence }) => {

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