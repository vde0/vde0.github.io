/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {EmCss} from "@types";


interface BtnProps {
    icon?: string,
}

// styles
const makeBtnCss: EmCss<BtnProps>  = (props) => css`
    background-image: ${props.icon};
`;

// react component
const Btn: React.FC<BtnProps> = (props) => (
    <button css={makeBtnCss(props)}></button>
);


export default Btn