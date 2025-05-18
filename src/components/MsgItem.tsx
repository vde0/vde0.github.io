/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { SymbolChatter } from "@services/DuoChatUnit";


interface MsgItemProps {
    direction: 'left' | 'right';
    sender: string,
    text: string,
}

const MsgItem: React.FC<MsgItemProps> = ({ sender, text, direction }) => (
    <section className={`mb-2 p-2 rounded-2xl w-2/3 relative
        ${direction==="left"?"bg-gray left-2":"bg-light-blue right-2 ml-auto"}`
    }>
        <span className={`block font-semibold ${direction==="left"?"text-light-blue":"text-orange"}`}>
            {sender}
        </span>
        <p className="text-white">{text}</p>
    </section>
);


export default MsgItem