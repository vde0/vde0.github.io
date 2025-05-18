import { TextareaHTMLAttributes } from "react";


type InputMsgProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children">;

const InputMsg: React.FC<InputMsgProps> = ({ className, ...props }) => {

    return <textarea
        {...props}
        className={`p-2 text-xl outline-0 ${className}`}
    />
};


export default InputMsg
export {
   InputMsgProps,
};