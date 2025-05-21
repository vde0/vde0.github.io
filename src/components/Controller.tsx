import Btn, { BtnProps } from "./Btn";
import { useIsMobile, useUnread } from "@hooks";
import { useMemo } from "react";
import add_user from "../assets/icon/add_user.svg";
import arrow_to_right from "../assets/icon/arrow_to_right.svg";
import dialogue from "../assets/icon/dialogue.svg";


const MOBILE_HANDLER: keyof BtnProps = "onTouchEnd";
const DESKTOP_HANDLER: keyof BtnProps = "onClick";


type TurnEvent = React.MouseEvent | React.TouchEvent;

interface ContrtollerProps {
    onTextChat?: (e?: TurnEvent) => void;
    onAddUser?: (e?: TurnEvent) => void;
    onNext?: (e?: TurnEvent) => void;
}

const Controller: React.FC<ContrtollerProps> = ({ onTextChat, onAddUser, onNext }) => {
    
    const isMobile  = useIsMobile();
    const [unread]  = useUnread(); 
    const onTurn    = useMemo<string>(() => isMobile ? MOBILE_HANDLER : DESKTOP_HANDLER, [isMobile]);

    return (
        <section className="
            flex items-stretch justify-between gap-3
            absolute bottom-0
            box-content w-full h-15 py-4
        ">
            {/* TextChat */}
            <Btn className="bg-gray flex-grow-1 rounded-xl relative" {...{[onTurn]: onTextChat}}>
                <div hidden={unread <= 0} className="absolute right-0 top-0 translate-x-[30%] translate-y-[-30%] bg-red rounded-full p-4">
                    <span className="
                        absolute top-0 left-0 w-full h-full
                        flex items-center justify-center
                        font-bold text-lg text-white
                    ">
                        {unread}
                    </span>
                </div>
                <img className="block" src={dialogue} />
            </Btn>
            {/* AddUser */}
            <Btn className="bg-gray flex-grow-1 rounded-xl" {...{[onTurn]: onAddUser}}>
                <img className="block" src={add_user} />
            </Btn>
            {/* Next */}
            <Btn className="bg-light-blue flex-grow-3 rounded-xl flex items-center" {...{[onTurn]: onNext}}>
                <span className="text-2xl font-bold">NEXT</span>
                <img src={arrow_to_right} />
            </Btn>
        </section>
    )
};


export default Controller