import { forwardRef, TextareaHTMLAttributes } from "react";


type MessageInputProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children">;

const MessageInput = forwardRef<HTMLTextAreaElement, MessageInputProps>(({ className, ...props }, inputRef) => {

    return <textarea
        {...props}
        ref={inputRef}
        style={{ resize: "none" }}
        className={`p-2 text-xl outline-0 bg-gray text-white rounded-xl focus:border focus:border-light-blue ${className}`}
    />
});


export default MessageInput
export {
   MessageInputProps as InputMsgProps,
};