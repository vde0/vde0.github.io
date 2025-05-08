/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { SymbolChatter } from "@services/DuoChatUnit";


interface MsgItemProps {
    sender: SymbolChatter,
    text: string,
}

const MsgItem: React.FC<MsgItemProps> = ({ sender, text }) => (
    <section className="border-2 border-gray-900 mb-2">
        <span className="block text-black">{text}</span>
    </section>
);


export default MsgItem