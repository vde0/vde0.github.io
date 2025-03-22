/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import DisplayBox from "@components/DisplayBox";
import Controller from "@components/Controller";
import VideoChat from "./VideoChat";
import TextChat from "./TextChat";
import { EmCss } from "@emotion/react"; // custom type
import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { TWebApp } from "@tg-types"; // custom type
import { useEffect, useLayoutEffect, useState } from "react";
import { useMobileKeyboard } from "@hooks";


const mainCss: EmCss = css`
    top: 0;
    bottom: 0;
    /* top: var(--tg-content-safe-area-inset-top);
    bottom: var(--tg-content-safe-area-inset-bottom); */
    
    left: 0;
    right: 0;

    max-height: var(--tg-viewport-stable-height);
    overflow: clip;
`;

const Main: React.FC = () => {

    const webApp: TWebApp           = useWebApp();
    const keyboardStatus: boolean   = useMobileKeyboard();

    useLayoutEffect(() => {
        try {
            webApp?.ready();
            webApp?.lockOrientation?.();
            webApp?.disableVerticalSwipes?.();
            webApp?.requestFullscreen?.();
        } catch (err) {}
    });

    const [isTextChatShown, setIsTextChatShown] = useState<boolean>(false);

    return (
    <>
    <div className="container absolute max-w-xl py-4 px-3 md:px-8 mx-auto bg-black text-white" css={mainCss}>

        <section className="pb-19 h-full flex flex-col justify-evenly gap-4">
            <DisplayBox>
                <VideoChat />
            </DisplayBox>
            <DisplayBox>
                { isTextChatShown
                    ? <TextChat />
                    : <VideoChat />
                }
            </DisplayBox>
        </section>
        
        { !keyboardStatus
            ? <div className="realtive w-full">
                <Controller onTextChat={() => { setIsTextChatShown(!isTextChatShown) }} />
            </div>
            : null
        }

    </div>
    </>
    );
};


export default Main