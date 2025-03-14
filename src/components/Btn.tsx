import { PropsWithClassName } from "@types";
import { PropsWithFormStatus, provideFormStatus } from "@utils";
import { PropsWithChildren } from "react";


type BtnProps = PropsWithClassName & PropsWithChildren & { type: string };

// react component
const Btn: React.FC<BtnProps> = ({ className, children }) => (
    <button className={f`py-3 px-2 text-center flex justify-center gap-4 ${className}`}>
        {children}
    </button>
);


const FormedBtn     = provideFormStatus<BtnProps>(Btn);
type FormedBtnProps = BtnProps & PropsWithFormStatus;


export default Btn
export {
    FormedBtn,
    BtnProps, FormedBtnProps,
};