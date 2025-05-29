import { SubmitBtn } from "@components/Btn";
import MessageInput from "@components/MessageInput";
import { useMobileKeyboard, useWrite } from "@hooks";
import { PropsWithClassName } from "@types";
import { ChangeEventHandler, MouseEventHandler, useCallback, useLayoutEffect, useRef, useState } from "react";
import send from "../assets/icon/send.svg";


type MessageFormProps = PropsWithClassName & {
    onPush?: (msgValue: string) => void;
};

const MessageForm: React.FC<MessageFormProps> = ({ className, onPush }) => {

    const pending: boolean = false;
    //
    const isMobileKeyboard  = useMobileKeyboard();
    const [write, setWrite] = useWrite();
    const [pos, setPos]     = useState<"absolute" | "block">("block");
    const inputRef          = useRef<HTMLTextAreaElement | null>(null);


    const typeHandler = useCallback<ChangeEventHandler<HTMLTextAreaElement>>( function (evt) {
        setWrite(evt.target?.value);
    }, [] );
    //
    const submitHandler = useCallback<MouseEventHandler<HTMLButtonElement>>( function (evt) {
        evt.preventDefault();
        inputRef.current?.focus();
        if (write === "") return;
        onPush?.(write);
        setWrite("");
    }, [write] );


    useLayoutEffect(() => { setPos(isMobileKeyboard ? "absolute" : "block") }, [isMobileKeyboard]);


    return (
        <form className={`${className}
            ${pos} z-1
            w-full h-15 mx-auto
            box-border pb-1 pt-2
            flex flex-row gap-1 bottom-0`}
        action="">
            <MessageInput
                ref={inputRef}
                disabled={pending}
                className="grow"
                onChange={typeHandler} value={write} />
            <SubmitBtn
                disabled={pending}
                onClick={submitHandler}
                className="bg-gray rounded-lg shrink-0 w-10"
            >
                <img draggable={false} src={send} className="block h-full scale-200 relative right-1 pointer-events-none" />
            </SubmitBtn>
        </form>
    );
};


export default MessageForm