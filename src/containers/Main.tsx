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
    top: var(--tg-content-safe-area-inset-top);
    bottom: var(--tg-content-safe-area-inset-bottom);

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
    }, []);

    const [isTextChatShown, setIsTextChatShown] = useState<boolean>(false);

    return (
    <div className="w-full fixed px-3 md:px-8 box-border" css={mainCss}>
        <section className="
            container max-w-xl h-full
            relative mx-auto bg-black text-white
            flex flex-col
        ">

            <section className="grow flex flex-col gap-10 py-8">
                <DisplayBox className="">
                    <VideoChat />
                </DisplayBox>
                <DisplayBox className="">
                    { isTextChatShown
                        ? <TextChat />
                        : <VideoChat />
                    }
                </DisplayBox>
            </section>
            
            { !keyboardStatus
                ? <div className="shrink-0 h-24">
                    <Controller onTextChat={() => { setIsTextChatShown(!isTextChatShown) }} />
                </div>
                : null
            }

        </section>
    </div>
    );
};


export default Main