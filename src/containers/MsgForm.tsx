import Btn from "@components/Btn";


const MsgForm: React.FC = () => {
    return (
        <form className="
            fixed z-1 bg-green-400
            w-128 h-15 mx-auto
            box-content pb-1 pt-2 bottom-0
            flex flex-row gap-1"
        action="">
            <textarea className="grow bg-[#2C2C2C] text-white p-2 text-xl" name="" id="" />
            <Btn />
        </form>
    );
};


export default MsgForm