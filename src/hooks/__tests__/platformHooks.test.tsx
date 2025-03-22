import { PlatformContext, PlatformState } from "@store";
import { useCheckMobile, checkMobile } from "@hooks";
import { renderHook } from "@testing-library/react";
import { WebAppProvider } from "@vkruglikov/react-telegram-web-app";
import PlatformProvider from "@store/PlatformProvider";
import { mockTelegram } from "@test-utils";
import { TWebApp } from "@tg-types";


const EXPECTED_PLATFORM:    PlatformState   = "android";
const EXPECTED_IS_MOBILE:   boolean         = checkMobile(EXPECTED_PLATFORM);

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <WebAppProvider>
    <PlatformProvider>
        {children}
    </PlatformProvider>
    </WebAppProvider>
);


let wapp: TWebApp;

describe("Platform Hooks", () => {

    beforeEach(() => {
        mockTelegram();
        wapp = window.Telegram.WebApp;
    });

    test("useCheckMobile", () => {
        wapp.platform = EXPECTED_PLATFORM;

        const { result: { current: isMobile } } = renderHook(useCheckMobile, { wrapper });
        expect(isMobile).toBe(EXPECTED_IS_MOBILE);
    });
});