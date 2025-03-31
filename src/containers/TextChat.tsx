import MsgList from "@components/MsgList";
import MsgForm from "./MsgForm";
import { useMsgHistory } from "@hooks";
import { PropsWithClassName } from "@types";


const TextChat: React.FC<PropsWithClassName> = ({ className }) => {

    const [msgHistory, dispathMsgHistory] = useMsgHistory();

    return (
        <article className={`h-full flex flex-col ${className}`}>
            <MsgList correspondence={msgHistory} />
            <MsgForm className="mt-auto" />
        </article>
    );
};


export default TextChat