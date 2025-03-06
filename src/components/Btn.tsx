/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {emCss} from "@types";


interface btnProps {
    icon?: string,
}

// styles
const makeBtnCss: emCss<btnProps>  = (props) => css`
    background-image: ${props.icon};
`;

// react component
const Btn: React.FC<btnProps> = (props) => (
    <button css={makeBtnCss(props)}></button>
);


export default Btn