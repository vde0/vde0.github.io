import MsgList from "@components/MsgList";
import MsgForm from "./MsgForm";
import { useMsgHistory } from "@hooks";
import { PropsWithClassName } from "@types";


const TextChat: React.FC<PropsWithClassName> = ({ className }) => {

    const [msgHistory, dispathMsgHistory] = useMsgHistory();

    return (
        <article className={"h-full" + " " + className}>
            <MsgList correspondence={msgHistory} />
            <MsgForm />
        </article>
    );
};


export default TextChat