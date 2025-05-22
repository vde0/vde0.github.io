import { useCallback, useEffect, useRef, useState } from "react";


type SetEl = (el: HTMLElement) => void;
type Resize = { height: number, width: number };


export const useResizeEl = (el?: HTMLElement | null): [Resize, SetEl] => {

    const [resize, setResize]   = useState<Resize>({ height: 0, width: 0 });

    const rectRef               = useRef<DOMRectReadOnly|null>(el?.getBoundingClientRect()??null);
    const elRef                 = useRef<typeof el>(el);

    const observerRef           = useRef<ResizeObserver>(new ResizeObserver(entries => {
        if (entries[0].target !== elRef.current) throw Error("Incorrect 'el' of useResizeEl.");

        const curRect = entries[0].contentRect;
        if (!rectRef.current || rectRef.current.height === undefined) {
            rectRef.current = curRect;
            console.log("INIT SAVED RECT", rectRef.current);
            return;
        }

        setResize({
            height: curRect.height - rectRef.current.height,
            width:  curRect.width - rectRef.current.width,
        });
        rectRef.current = curRect;
    }));


    const setEl = useCallback<SetEl>(el => {

        elRef.current && observerRef.current.unobserve(elRef.current);
        observerRef.current.observe(el);

        elRef.current   = el;
        rectRef.current = el.getBoundingClientRect();
    }, []);


    useEffect(() => {
        el && setEl(el);
        return () => observerRef.current.disconnect();
    }, []);


    return [resize, setEl];
};