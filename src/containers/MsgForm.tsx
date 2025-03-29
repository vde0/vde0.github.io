import { SubmitBtn } from "@components/Btn";
import InputMsg from "@components/InputMsg";
import { useIsMobile } from "@hooks";
import { useEffect, useLayoutEffect, useState } from "react";


const MsgForm: React.FC = () => {

    const pending: boolean = true;

    const isMobile = useIsMobile();
    const [pos, setPos] = useState<"fixed" | "block">("block");
    useLayoutEffect(() => { setPos(isMobile? "fixed" : "block") }, [isMobile]);

    return (
        <form className={`
            ${pos} z-1 bg-green-400
            w-128 h-15 mx-auto
            box-content pb-1 pt-2 bottom-0
            flex flex-row gap-1`}
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