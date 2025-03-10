/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import DisplayBox from "@components/DisplayBox";
import Controller from "@components/Controller";
import VideoChat from "./VideoChat";
import TextChat from "./TextChat";
import { EmCss } from "@emotion/react"; // custom type


const mainCss: EmCss = css`
    /* top: 0;
    left: 0;
    bottom: 0;
    right: 0; */

    overflow: clip;
`;

const Main: React.FC = () => {
    return (
        <div className="container mx-auto bg-black text-white" css={mainCss}>
            Main
            <DisplayBox>
                <VideoChat />
            </DisplayBox>
            <DisplayBox>
                <TextChat />
            </DisplayBox>
            <Controller />
        </div>
    );
};


export default Main