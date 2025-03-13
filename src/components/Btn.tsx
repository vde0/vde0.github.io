import { PropsWithClassName } from "@types";
import { PropsWithChildren } from "react";


type BtnProps = PropsWithClassName & PropsWithChildren;

// react component
const Btn: React.FC<BtnProps> = ({ className, children }) => (
    <button className={f`py-3 px-2 text-center flex justify-center gap-4 ${className}`}>
        {children}
    </button>
);


export default Btn