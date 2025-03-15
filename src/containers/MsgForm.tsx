import { SubmitBtn } from "@components/Btn";
import InputMsg from "@components/InputMsg";
import { FormStatusGetter, FormStatusRef } from "@utils";
import { useRef } from "react";
import { FormStatus } from "react-dom";


const MsgForm: React.FC = () => {

    const formStatusRef = useRef<FormStatus | null>(null);

    return (
        <form className="
            fixed z-1 bg-green-400
            w-128 h-15 mx-auto
            box-content pb-1 pt-2 bottom-0
            flex flex-row gap-1"
        action="">
            <InputMsg disabled={formStatusRef?.current?.pending} />
            <SubmitBtn
                disabled={formStatusRef?.current?.pending}
                className="bg-black border-1 border-gray-700"
            />

            <FormStatusGetter ref={formStatusRef} />
        </form>
    );
};


export default MsgForm