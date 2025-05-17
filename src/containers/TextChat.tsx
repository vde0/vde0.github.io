import MsgList from "@components/MsgList";
import MsgForm from "./MsgForm";
import { useChatFeed, useChatHistory, useChatUnit } from "@hooks";
import { PropsWithClassName } from "@types";
import { useCallback } from "react";


const TextChat: React.FC<PropsWithClassName> = ({ className }) => {

    const feed      = useChatFeed();
    const history   = useChatHistory();
    const chatUnit  = useChatUnit();

    const pushMsgHandler = useCallback<(msgValue: string) => void>((msgText) => {
        history.add(msgText, chatUnit.localChatter);
    }, [chatUnit, history]);

    return (
        <article className={`h-full w-full flex flex-col ${className}`}>
            <MsgList history={feed} />
            <MsgForm className="mt-auto" onPush={pushMsgHandler} />
        </article>
    );
};


export default TextChat