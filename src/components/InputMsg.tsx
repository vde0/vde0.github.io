import { forwardRef, TextareaHTMLAttributes } from "react";


type InputMsgProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children">;

const InputMsg = forwardRef<HTMLTextAreaElement, InputMsgProps>(({ className, ...props }, inputRef) => {

    return <textarea
        {...props}
        ref={inputRef}
        className={`p-2 text-xl outline-0 ${className}`}
    />
});


export default InputMsg
export {
   InputMsgProps,
};