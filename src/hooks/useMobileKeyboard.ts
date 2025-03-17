import { MobileKeyboardContext, MobileKeyboardValue } from "@store/MobileKeyboardProvider"
import { useContext } from "react"


const useMobileKeyboard = (): MobileKeyboardValue => {
    const context: boolean | null = useContext(MobileKeyboardContext);
    if (context === null) throw Error(
        "The useMobileKeyboard hook must be called within a MobileKeyboardProvider"
    );

    return context;
}


export { useMobileKeyboard };