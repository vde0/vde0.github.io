/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";


const DisplayBox: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div className="w-[454px] h-[288px] mx-auto bg-white mb-4" css={css``}>
    {children}</div>
);


export default DisplayBox