/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useMaxHeight } from "@hooks";
import { PropsWithClassName } from "@types";
import { PropsWithChildren, useEffect, useLayoutEffect, useRef } from "react";


type DisplayBoxProps = PropsWithChildren & PropsWithClassName;

const DisplayBox: React.FC<DisplayBoxProps> = ({ children, className }) => {
    const maxHeight: number = useMaxHeight();

    return (
        <div
            className={`
                w-full
                mx-auto bg-white
                ${className}
            `}
            css={css`
                height: ${maxHeight/3}px
            `}
        >
            {children}
        </div>
    );
};


export default DisplayBox