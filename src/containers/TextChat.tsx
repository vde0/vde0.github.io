import MsgList from "@components/MsgList";
import MsgForm from "./MsgForm";
import { useGetCurUser, useMsgHistory } from "@hooks";
import { PropsWithClassName } from "@types";
import { useCallback } from "react";
import { User } from "@hooks";


const TextChat: React.FC<PropsWithClassName> = ({ className }) => {

    const [msgHistory, dispathMsgHistory] = useMsgHistory();
    const user: User = useGetCurUser();

    const pushMsgHandler = useCallback<(msgValue: string) => void>((msgValue) => {
        dispathMsgHistory("ADD", [user.id, msgValue]);
    }, [dispathMsgHistory]);

    return (
        <article className={`h-full flex flex-col ${className}`}>
            <MsgList correspondence={msgHistory} />
            <MsgForm className="mt-auto" onPush={pushMsgHandler} />
        </article>
    );
};


export default TextChat