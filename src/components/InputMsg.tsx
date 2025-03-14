import { PropsWithClassName } from "@types";


type InputMsgProps = PropsWithClassName & {

};

const InputMsg: React.FC<InputMsgProps> = ({ className }) => {
    return <textarea
        name=""
        id=""
        className={f`grow bg-[#2C2C2C] text-white p-2 text-xl ${className}`}
    ></textarea>
};


export default InputMsg
export { InputMsgProps };