import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import PlatformProvider, { PlatformState } from "@store/PlatformProvider";
import { WebAppProvider } from "@vkruglikov/react-telegram-web-app";
import { TWebApp } from "@tg-types";
import { screen } from "@testing-library/react";
import { mockTelegram } from "@test-utils";


let wapp: TWebApp;

describe("PlatformProvider", () => {

    beforeEach(() => {
        mockTelegram();
        wapp = window.Telegram.WebApp;
    });

    test("platform = android", () => {

        const EXPECTED_PLATFORM: PlatformState = "android";

        wapp.platform = EXPECTED_PLATFORM;
        render(<PlatformProvider />, { wrapper: WebAppProvider });

        const state = screen.getByTestId("state").textContent;
        console.log(state);

        expect(state).toBe(EXPECTED_PLATFORM);
    });
});
