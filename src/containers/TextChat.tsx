import MsgList from "@components/MsgList";
import MsgForm from "./MsgForm";
import { useChatFeed, useChatHistory, useChatUnit } from "@hooks";
import { PropsWithClassName } from "@types";
import { useCallback } from "react";



interface TextChatProps extends PropsWithClassName {
    hidden?: boolean;
}

const TextChat: React.FC<TextChatProps> = ({ className, hidden=false }) => {

    const feed      = useChatFeed();
    const history   = useChatHistory();
    const chatUnit  = useChatUnit();

    const pushMsgHandler = useCallback<(msgValue: string) => void>((msgText) => {
        history.add(msgText, chatUnit.localChatter);
    }, [chatUnit, history]);

    return (
        <article hidden={hidden} className={`h-full w-full flex flex-col ${className}`}>
            <MsgList history={feed} />
            <MsgForm className="mt-auto" onPush={pushMsgHandler} />
        </article>
    );
};


export default TextChat