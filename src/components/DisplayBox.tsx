import { PropsWithClassName } from "@types";
import { PropsWithChildren } from "react";


type DisplayBoxProps = PropsWithChildren & PropsWithClassName;

const DisplayBox: React.FC<DisplayBoxProps> = ({ children, className }) => (
    <div
        className={`
            w-full h-45 md:h-54 2xl:h-72 bg-white
            shrink-0 mx-auto mb-4
            ${className}
        `}
    >
        {children}
    </div>
);


export default DisplayBox