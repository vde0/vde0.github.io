import '@testing-library/jest-dom';
import MobileKeyboardProvider from '@store/MobileKeyboardProvider';
import { PlatformState } from '@store/PlatformProvider';
import { render, screen } from "@testing-library/react";
import { mockTelegram } from '@test-utils';
import { TWebApp } from '@vkruglikov/react-telegram-web-app/lib/core/twa-types';


const MOBILE_PLATFORM:      PlatformState   = "android";
const MOBILE_IS_MOBILE:     boolean         = true;
const MOBILE_IS_OPENED:     boolean         = false;
const MOBILE_MAX_HEIGHT:    number          = 1000;
//
const DESKTOP_PLATFORM:     PlatformState   = "tdesktop";
const DESKTOP_IS_MOBILE:    boolean         = false;
const DESKTOP_IS_OPENED:    boolean         = false;
const DESKTOP_MAX_HEIGHT:   number          = 900;


jest.mock('@vkruglikov/react-telegram-web-app', () => ({
    useWebApp: jest.fn(),
}));
import { useWebApp as useWebAppMock } from '@vkruglikov/react-telegram-web-app';

jest.mock('@hooks', () => ({
    useCheckMobile: jest.fn(),
}));
import { useCheckMobile as useCheckMobileMock } from '@hooks';


type TestMode   = "mobile" | "desktop"
const testSetup = (mode: TestMode): void => {

    if (mode === "mobile") {
        wapp.platform               = MOBILE_PLATFORM;
        wapp.viewportStableHeight   = MOBILE_MAX_HEIGHT;
        (useCheckMobileMock as jest.Mock).mockReturnValue(true);
    } else {
        wapp.platform               = DESKTOP_PLATFORM;
        wapp.viewportStableHeight   = DESKTOP_MAX_HEIGHT;
        (useCheckMobileMock as jest.Mock).mockReturnValue(false);
    }
};


let wapp: TWebApp;

describe("MobileKeyboardProvider", () => {

    beforeEach( () => {
        mockTelegram();
        wapp = window.Telegram.WebApp;
        (useWebAppMock as jest.Mock).mockReturnValue(wapp);
    });

    // Mobile
    // isOpened
    test("M1. isOpened = false", () => {

        testSetup("mobile");
        render(<MobileKeyboardProvider />);

        const isOpened: boolean = screen.getByTestId("isOpened").textContent === 'true';
        expect(isOpened).toBe(MOBILE_IS_OPENED);
    });
    // isMobile
    test("M2. isMobile = true", () => {

        testSetup("mobile");
        render(<MobileKeyboardProvider />);

        const isMobile: boolean = screen.getByTestId("isMobile").textContent === 'true';
        expect( isMobile ).toBe(MOBILE_IS_MOBILE);
    });
    // maxHeight
    test("M3. maxHeight", () => {

        testSetup("mobile");
        const { rerender } = render(<MobileKeyboardProvider />);
        rerender(<MobileKeyboardProvider />);

        const maxHeight: number = Number( screen.getByTestId("maxHeight").textContent );
        expect(maxHeight).toBe(MOBILE_MAX_HEIGHT);
    });

    // Desktop
    // isOpened
    test("D1. isOpened = false", () => {

        testSetup("desktop");
        render(<MobileKeyboardProvider />);

        const isOpened: boolean = screen.getByTestId("isOpened").textContent === 'true';
        expect(isOpened).toBe(DESKTOP_IS_OPENED);
    });
    // isMobile
    test("D2. isMobile = false", () => {

        testSetup("desktop");
        render(<MobileKeyboardProvider />);

        const isMobile: boolean = screen.getByTestId("isMobile").textContent === 'true';
        expect( isMobile ).toBe(DESKTOP_IS_MOBILE);
    });
    // maxHeight
    test("D3. maxHeight", () => {

        testSetup("desktop");
        render(<MobileKeyboardProvider />);

        const maxHeight: number = Number( screen.getByTestId("maxHeight").textContent );
        expect(maxHeight).toBe(DESKTOP_MAX_HEIGHT);
    });
    
});