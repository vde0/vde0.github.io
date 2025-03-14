import { PropsWithClassName } from "@types";
import { bindProps, PropsWithFormStatus, provideFormStatus } from "@utils";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";


type BtnProps =
    & PropsWithChildren
    & ButtonHTMLAttributes<HTMLButtonElement>;

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
type FormedBtnProps     = BtnProps & PropsWithFormStatus;
type SpecificBtnProps   = Omit<FormedBtnProps, "type">;

const FormedBtn     = provideFormStatus<BtnProps>(Btn);
const SubmitBtn     = bindProps<FormedBtnProps, {type: "submit"}>(FormedBtn, {type: "submit"});
const ResetBtn      = bindProps<FormedBtnProps, {type: "reset"}>(FormedBtn, {type: "reset"});


export default Btn
export {
    FormedBtn, SubmitBtn, ResetBtn,
    BtnProps, FormedBtnProps, SpecificBtnProps,
};