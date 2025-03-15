import { SubmitBtn } from "@components/Btn";
import InputMsg from "@components/InputMsg";
import { useActionState } from "react";


const MsgForm: React.FC = () => {

    const [,,pending] = useActionState(() => {}, null);

    return (
        <form className="
            fixed z-1 bg-green-400
            w-128 h-15 mx-auto
            box-content pb-1 pt-2 bottom-0
            flex flex-row gap-1"
        action="">
            <InputMsg disabled={pending} />
            <SubmitBtn
                disabled={pending}
                className="bg-black border-1 border-gray-700"
            />
        </form>
    );
};


export default MsgForm