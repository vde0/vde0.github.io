/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";


const DisplayBox: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div className="w-full h-36 md:h-54 2xl:h-72 shrink-0 mx-auto bg-white mb-4" css={css``}>
    {children}</div>
);


export default DisplayBox