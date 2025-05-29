import MessageList from "@components/MessageList";
import MessageForm from "./MessageForm";
import { useChatFeed, useChatHistory, useChatUnit, useResizeEl } from "@hooks";
import { PropsWithClassName } from "@types";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";



interface TextChatProps extends PropsWithClassName {
    hidden?: boolean;
}

const TextChat: React.FC<TextChatProps> = ({ className, hidden=false }) => {

    const feed                  = useChatFeed();
    const history               = useChatHistory();
    const chatUnit              = useChatUnit();
    const listRef               = useRef<HTMLElement | null>(null);
    const [resizeList, setList] = useResizeEl();

    const pushMsgHandler = useCallback<(msgValue: string) => void>((msgText) => {
        history.add(msgText, chatUnit.localChatter);
    }, [chatUnit, history]);


    // === HELPERS ===
    function scrollY ({ top=listRef.current?.scrollHeight, behavior="instant" }: ScrollToOptions, by: boolean = false): void {
        if (hidden || !top) return;
        listRef.current?.[by?"scrollBy":"scrollTo"]({ top, behavior });
    };


    useEffect(() => {
        setList(listRef.current!);
    }, []);

    useLayoutEffect(() => scrollY({behavior:"smooth"}), [feed]);

    useLayoutEffect(() => scrollY({behavior:"instant"}), [hidden]);

    useLayoutEffect(() => {
        if (resizeList.height > 0) return;
        console.log("SCROLL BY CHANGED HEIGHT", resizeList);
        scrollY({behavior:"instant", top:-resizeList.height}, true);
    }, [resizeList]);


    return (
        <article hidden={hidden} className={`h-full w-full flex flex-col ${className}`}>
            <section ref={listRef} className="overflow-y-scroll grow-1 shrink-1">
                <MessageList history={feed} />
            </section>
            <section className="shrink-0 h-15 box-border">
                <MessageForm className="mt-auto shrink-0" onPush={pushMsgHandler} />
            </section>
        </article>
    );
};


export default TextChat