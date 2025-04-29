import MsgList from "@components/MsgList";
import MsgForm from "./MsgForm";
import { useMsgHistory } from "@hooks";
import { PropsWithClassName } from "@types";
import { useCallback } from "react";


const TextChat: React.FC<PropsWithClassName> = ({ className }) => {

    const [history, dispathHistory] = useMsgHistory();

    const pushMsgHandler = useCallback<(msgValue: string) => void>((msgValue) => {
        // dispathMsgHistory("ADD", [user.id, msgValue]);
    }, [dispathHistory]);

    return (
        <article className={`h-full flex flex-col ${className}`}>
            <MsgList correspondence={history} />
            <MsgForm className="mt-auto" onPush={pushMsgHandler} />
        </article>
    );
};


export default TextChat