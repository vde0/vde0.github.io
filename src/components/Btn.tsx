import { bindProps } from "@utils";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";


type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    onTouchStart?: (e: React.TouchEvent<HTMLButtonElement>) => void;
    onTouchEnd?: (e: React.TouchEvent<HTMLButtonElement>) => void;
    onTouchMove?: (e: React.TouchEvent<HTMLButtonElement>) => void;
    onTouchCancel?: (e: React.TouchEvent<HTMLButtonElement>) => void;
    onTouch?: (e: React.TouchEvent<HTMLButtonElement>) => void;
};

// react component
const Btn: React.FC<BtnProps> = ({ className, children, type = "button", ...props }) => (
    <button
        {...props}
        type={type}
        className={`py-3 px-2 text-center flex justify-center gap-4 ${className}`}
    >
        {children}
    </button>
);


// Specific Btns
type SpecificBtnProps   = Omit<BtnProps, "type">;

const SubmitBtn     = bindProps<BtnProps, {type: "submit"}>(Btn, {type: "submit"});
const ResetBtn      = bindProps<BtnProps, {type: "reset"}>(Btn, {type: "reset"});


export default Btn
export {
    SubmitBtn, ResetBtn,
    BtnProps, SpecificBtnProps,
};