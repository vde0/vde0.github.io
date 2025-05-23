import { forwardRef, TextareaHTMLAttributes } from "react";


type InputMsgProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children">;

const InputMsg = forwardRef<HTMLTextAreaElement, InputMsgProps>(({ className, ...props }, inputRef) => {

    return <textarea
        {...props}
        ref={inputRef}
        style={{ resize: "none" }}
        className={`p-2 text-xl outline-0 bg-gray text-white rounded-xl focus:border focus:border-light-blue ${className}`}
    />
});


export default InputMsg
export {
   InputMsgProps,
};