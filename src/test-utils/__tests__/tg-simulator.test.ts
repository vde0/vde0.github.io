import { TEventData, TEventHandler, TWebApp } from "@tg-types";
import { dispatchTEvent, rushResizeTo, smoothResizeTo, mockTelegram, getWebApp } from "@test-utils";


type HandlerMock = jest.Mock<void, [TEventData], TWebApp>;


describe("dispatchTEvent", () => {

    let handlerMock:   HandlerMock;
    let wapp:       TWebApp | null;

    beforeEach(() => {
        mockTelegram();
        handlerMock = jest.fn<void, [TEventData], TWebApp>();
        wapp        = getWebApp();
        if (wapp === null) throw Error("wapp is null");
    })

    describe("viewportChanged", () => {
        it("Have Called", () => {
    
            (wapp as TWebApp).onEvent("viewportChanged", handlerMock);

            dispatchTEvent("viewportChanged");
            expect(handlerMock).toHaveBeenCalled();
        });
        it("3 times", () => {
    
            (wapp as TWebApp).onEvent("viewportChanged", handlerMock);
            dispatchTEvent("viewportChanged");
            dispatchTEvent("viewportChanged");
            dispatchTEvent("viewportChanged");
    
            expect(handlerMock).toHaveBeenCalledTimes(3);
        });
        it("eventData checking", () => {

            (wapp as TWebApp).onEvent("viewportChanged", handlerMock);

            dispatchTEvent("viewportChanged", { isStateStable: true });
            expect(handlerMock).toHaveBeenCalledWith({ isStateStable: true });
    
            dispatchTEvent("viewportChanged", { isStateStable: false });
            expect(handlerMock).toHaveBeenCalledWith({ isStateStable: false });
        });
        it("offEvent", () => {
    
            (wapp as TWebApp).onEvent("viewportChanged", handlerMock);
            dispatchTEvent("viewportChanged");
            expect(handlerMock).toHaveBeenCalledTimes(1);
            
            (wapp as TWebApp).offEvent("viewportChanged", handlerMock);
            dispatchTEvent("viewportChanged");
            dispatchTEvent("viewportChanged");
            dispatchTEvent("viewportChanged");
            expect(handlerMock).toHaveBeenCalledTimes(1);
        });
    });
});

describe("smoothReszieTo & rushResizeTo", () => {

    let handler: TEventHandler = function () {};
    let handlerMock:   HandlerMock;
    let wapp:       TWebApp | null;

    beforeEach(() => {
        mockTelegram();
        handlerMock = jest.fn<void, [TEventData], TWebApp>(handler);
        wapp        = getWebApp();
        if (wapp === null) throw Error("wapp is null");

        (wapp as TWebApp).onEvent("viewportChanged", handlerMock);
    });

    it("Rush Resize", async () => {

        expect(handlerMock).not.toHaveBeenCalled();

        await rushResizeTo(1000);
        expect((wapp as TWebApp).viewportHeight).toBe(1000);
        expect((wapp as TWebApp).viewportHeight).toBe((wapp as TWebApp).viewportStableHeight);
        expect(handlerMock).toHaveBeenCalledTimes(1);
        expect(handlerMock).toHaveBeenCalledWith({ isStateStable: true });

        await rushResizeTo(300);
        expect((wapp as TWebApp).viewportHeight).toBe(300);
        expect((wapp as TWebApp).viewportHeight).toBe((wapp as TWebApp).viewportStableHeight);
        expect(handlerMock).toHaveBeenCalledTimes(2);
        expect(handlerMock).toHaveBeenCalledWith({ isStateStable: true });

        expect(handlerMock).not.toHaveBeenCalledWith({ isStateStable: false });
    });

    it("Smooth Resize", async () => {
        
        await smoothResizeTo(1000, 500);
        expect(handlerMock).toHaveBeenCalledWith({ isStateStable: false });
        expect(handlerMock).toHaveBeenCalledWith({ isStateStable: true});
        expect(handlerMock).toHaveBeenCalledTimes(67);
        expect(handlerMock).toHaveBeenNthCalledWith(66, { isStateStable: false });
        expect(handlerMock).toHaveBeenLastCalledWith({ isStateStable: true });
    });
});