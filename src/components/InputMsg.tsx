import { TextareaHTMLAttributes } from "react";


type InputMsgProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children">;

const InputMsg: React.FC<InputMsgProps> = ({ className, ...props }) => {

    return <textarea
        {...props}
        className={`grow bg-[#2C2C2C] text-white p-2 text-xl ${className}`}
    />
};


export default InputMsg
export {
   InputMsgProps,
};