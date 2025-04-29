/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { SymbolChatter } from "@lib/textchat-history";


interface MsgItemProps {
    sender: SymbolChatter,
    text: string,
}

const MsgItem: React.FC<MsgItemProps> = ({ sender, text }) => (<section></section>);


export default MsgItem