import MsgList from "@components/MsgList";
import MsgForm from "./MsgForm";
import { useMsgHistory } from "@hooks";


const TextChat: React.FC = () => {

    const [msgHistory, dispathMsgHistory] = useMsgHistory();

    return (
        <article className="h-full">
            <MsgList correspondence={msgHistory} />
            <MsgForm />
        </article>
    );
};


export default TextChat