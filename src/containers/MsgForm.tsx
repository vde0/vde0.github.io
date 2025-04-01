import { SubmitBtn } from "@components/Btn";
import InputMsg from "@components/InputMsg";
import { useIsMobile, useMobileKeyboard, useWrite } from "@hooks";
import { PropsWithClassName } from "@types";
import { ChangeEvent, ChangeEventHandler, MouseEvent, MouseEventHandler, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";


type MsgFormProps = PropsWithClassName & {
    onPush?: (msgValue: string) => void;
};

const MsgForm: React.FC<MsgFormProps> = ({ className, onPush }) => {

    const pending: boolean = false;
    //
    const isMobileKeyboard  = useMobileKeyboard();
    const [write, setWrite] = useWrite();
    const [pos, setPos]     = useState<"absolute" | "block">("block");
    useLayoutEffect(() => { setPos(isMobileKeyboard ? "absolute" : "block") }, [isMobileKeyboard]);

    const typeHandler = useCallback<ChangeEventHandler<HTMLTextAreaElement>>( function (evt) {
        setWrite(evt.target?.value);
    }, [] );
    //
    const submitHandler = useCallback<MouseEventHandler<HTMLButtonElement>>( function (evt) {
        evt.preventDefault();
        onPush?.(write);
        setWrite("");
    }, [write] );

    return (
        <form className={`${className}
            ${pos} z-1 bg-green-400
            w-full h-15 mx-auto
            border-content pb-1 pt-2
            flex flex-row gap-1 bottom-0`}
        action="">
            <InputMsg
                disabled={pending}
                className="grow"
                onChange={typeHandler} value={write} />
            <SubmitBtn
                disabled={pending}
                onClick={submitHandler}
                className="bg-black border-1 border-gray-700 shrink-0 w-10"
            />
        </form>
    );
};


export default MsgForm