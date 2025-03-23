import '@testing-library/jest-dom';
import MobileKeyboardProvider from '@store/MobileKeyboardProvider';
import { PlatformState } from '@store/PlatformProvider';
import { act, render, screen } from "@testing-library/react";
import { dispatchTEvent, mockTelegram } from '@test-utils';
import { TWebApp } from '@tg-types';
import { checkMobile, defineMaxHeight, GetMaxHeight} from '@hooks';
import { useState } from 'react';


// CONSTS
const MOBILE_PLATFORM:      PlatformState   = "android";
const MOBILE_IS_MOBILE:     boolean         = true;
const MOBILE_IS_OPENED:     boolean         = false;
const MOBILE_MAX_HEIGHT:    number          = 1001;
//
const DESKTOP_PLATFORM:     PlatformState   = "tdesktop";
const DESKTOP_IS_MOBILE:    boolean         = false;
const DESKTOP_IS_OPENED:    boolean         = false;
const DESKTOP_MAX_HEIGHT:   number          = 900;


// VARS
let wapp: TWebApp;
let getMaxHeight: GetMaxHeight;


// MOCKS
jest.mock('@vkruglikov/react-telegram-web-app', () => ({
    useWebApp: jest.fn().mockImplementation( () => wapp ),
}));

jest.mock('@hooks', () => ({
    ...jest.requireActual("@hooks"),
    useCheckMobile: jest.fn().mockImplementation( () => checkMobile(wapp?.platform as PlatformState) ),
    useMaxHeight: jest.fn().mockImplementation( () => {
        const [maxHeight,] = useState<number>(
            jest.requireActual("@hooks").useMaxHeight(getMaxHeight)
        );

        return maxHeight;
    }),
}));


// SETTING OF TEST MODE BY A PLATFORM
type TestMode   = "mobile" | "desktop"
const testSetup = (mode: TestMode): void => {

    if (mode === "mobile") {
        wapp.platform       = MOBILE_PLATFORM;
        wapp.viewportHeight = MOBILE_MAX_HEIGHT;
        act(() => dispatchTEvent("viewportChanged"));
    } else {
        wapp.platform       = DESKTOP_PLATFORM;
        wapp.viewportHeight = DESKTOP_MAX_HEIGHT;
        act(() => dispatchTEvent("viewportChanged"));
    }
};


// TESTS
describe("MobileKeyboardProvider", () => {

    beforeEach( () => {
        mockTelegram();
        //
        wapp            = window.Telegram.WebApp;
        getMaxHeight    = defineMaxHeight();
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
        render(<MobileKeyboardProvider />);

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