import Btn, { BtnProps } from "./Btn";
import { useCheckMobile } from "@hooks";
import { useMemo } from "react";


const MOBILE_HANDLER: keyof BtnProps = "onTouch";
const DESKTOP_HANDLER: keyof BtnProps = "onClick";


type TurnEvent = React.MouseEvent | React.TouchEvent;

interface ContrtollerProps {
    onTextChat?: (e?: TurnEvent) => void;
    onAddUser?: (e?: TurnEvent) => void;
    onNext?: (e?: TurnEvent) => void;
}

const Controller: React.FC<ContrtollerProps> = ({ onTextChat, onAddUser, onNext }) => {
    
    const isMobile  = useCheckMobile();
    const onTurn    = useMemo<string>(() => isMobile ? MOBILE_HANDLER : DESKTOP_HANDLER, [isMobile]);

    return (
        <section className="
            flex items-stretch justify-between gap-3
            absolute left-3 right-3 md:left-8 md:right-8 bottom-0
            box-content h-15 py-4
        ">  
            // TextChat
            <Btn className="bg-blue-400" {...{[onTurn]: onTextChat}} />
            // AddUser
            <Btn className="bg-blue-400" {...{[onTurn]: onAddUser}} />
            // Next
            <Btn className="bg-blue-400" {...{[onTurn]: onNext}} />
        </section>
    )
};


export default Controller