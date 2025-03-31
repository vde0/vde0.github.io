import { SubmitBtn } from "@components/Btn";
import InputMsg from "@components/InputMsg";
import { useIsMobile, useMobileKeyboard } from "@hooks";
import { PropsWithClassName } from "@types";
import { useEffect, useLayoutEffect, useState } from "react";


const MsgForm: React.FC<PropsWithClassName> = ({ className }) => {

    const pending: boolean = false;

    const isMobile          = useIsMobile();
    const isMobileKeyboard  = useMobileKeyboard();

    const [pos, setPos] = useState<"absolute" | "block">("block");
    useLayoutEffect(() => { setPos(isMobileKeyboard ? "absolute" : "block") }, [isMobileKeyboard]);

    return (
        <form className={`${className}
            ${pos} z-1 bg-green-400
            w-full h-15 mx-auto
            border-content pb-1 pt-2
            flex flex-row gap-1 bottom-0`}
        action="">
            <InputMsg className="grow" disabled={pending} />
            <SubmitBtn
                disabled={pending}
                className="bg-black border-1 border-gray-700 shrink-0 w-10"
            />
        </form>
    );
};


export default MsgForm