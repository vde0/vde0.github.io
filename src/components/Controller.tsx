import Btn, { BtnProps } from "./Btn";
import { useIsMobile } from "@hooks";
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
    const onTurn    = useMemo<string>(() => isMobile ? MOBILE_HANDLER : DESKTOP_HANDLER, [isMobile]);

    return (
        <section className="
            flex items-stretch justify-between gap-3
            absolute bottom-0
            box-content w-full h-15 py-4
        ">  
            {/* AddUser */}
            <Btn className="bg-gray flex-grow-1 rounded-xl" {...{[onTurn]: onAddUser}}>
                <img className="block" src={add_user} />
            </Btn>
            {/* TextChat */}
            <Btn className="bg-gray flex-grow-1 rounded-xl" {...{[onTurn]: onTextChat}}>
                <img className="block" src={dialogue} />
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