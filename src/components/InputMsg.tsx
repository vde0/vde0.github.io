import { TextareaHTMLAttributes } from "react";


type InputMsgProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children">;

const InputMsg: React.FC<InputMsgProps> = ({ className, ...props }) => {

    return <textarea
        {...props}
        className={`bg-[#2C2C2C] text-white p-2 text-xl border-0 outline-0 ${className}`}
    />
};


export default InputMsg
export {
   InputMsgProps,
};