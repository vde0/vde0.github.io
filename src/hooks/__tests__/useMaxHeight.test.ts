import "@testing-library/jest-dom";
import { dispatchTEvent, mockTelegram, rushResizeTo } from "@test-utils";
import { TWebApp } from "@tg-types";
import { act, renderHook } from "@testing-library/react";
import { defineMaxHeight, GetMaxHeight, useMaxHeight } from "@hooks";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";

jest.mock("@vkruglikov/react-telegram-web-app", () => ({
    useWebApp: jest.fn(),
}));


let wapp: TWebApp | null = null;
let getMaxHeight: GetMaxHeight = (tgWp: TWebApp) => 0;

describe("useMaxHeight", () => {

    beforeEach(() => {
        mockTelegram();
        wapp            = window.Telegram.WebApp;
        if (!wapp) throw Error("wapp is null");
        (useWebApp as jest.Mock).mockReturnValue(wapp);
        getMaxHeight    = defineMaxHeight();
    });

    // 1000
    test("maxHeight = 1000", () => {

        (wapp as TWebApp).viewportHeight    = 1000;

        const { result: {current: maxHeight} } = renderHook(() => useMaxHeight(getMaxHeight));
        expect(maxHeight).toBe(1000);
    });

    // 900 -> 1000 x-> 850
    test("maxHeight = 900 -> 1000 x-> 850", () => {

        (wapp as TWebApp).viewportHeight    = 900;

        const { result } = renderHook(() => useMaxHeight(getMaxHeight));
        expect(result.current).toBe(900);

        act(() => rushResizeTo(1000));
        expect(result.current).toBe(1000);

        act(() => rushResizeTo(800));
        expect(result.current).toBe(1000);
    });
});

