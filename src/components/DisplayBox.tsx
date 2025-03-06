/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";


const DisplayBox: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div css={css``}>
    {children}</div>
);


export default DisplayBox