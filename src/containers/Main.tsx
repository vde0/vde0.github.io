/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import DisplayBox from "@components/DisplayBox";
import Interface from "@components/Interface";
import VideoChat from "./VideoChat";
import TextChat from "./TextChat";


const Main: React.FC = () => {
    return (
        <div css={css`position: absolute`}>
            <DisplayBox>
                <VideoChat />
            </DisplayBox>
            <DisplayBox>
                <TextChat />
            </DisplayBox>
            <Interface />
        </div>
    );
};


export default Main