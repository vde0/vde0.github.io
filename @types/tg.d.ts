import { WebApp } from "@vkruglikov/react-telegram-web-app/lib/core/twa-types";

export {
    TWebApp, TBindHandler, TEventHandler, TEventData, TEventType, TPlatform,
};


type TWebApp = WebApp & {
    lockOrientation?:        () => void;
    disableVerticalSwipes?:  () => void;
    requestFullscreen?:      () => void;
    onEvent?: TBindHandler,
    offEvent?: TBindHandler,
    platform?: TPlatform,
};

declare global {
    interface Window {
        Telegram: { WebApp: TWebApp };
    };
}


type TPlatform = "tdesktop" | "android" | "ios" | "unknown";

type TBindHandler  = (event: TEventType, handler: TEventHandler) => void;
type TEventHandler = (this: TWebApp, data: TEventData) => void;
type TEventData = { isStateStable: boolean };

type TEventType =
  | 'activated'
  | 'deactivated'
  | 'themeChanged'
  | 'viewportChanged'
  | 'safeAreaChanged'
  | 'contentSafeAreaChanged'
  | 'mainButtonClicked'
  | 'secondaryButtonClicked'
  | 'backButtonClicked'
  | 'settingsButtonClicked'
  | 'invoiceClosed'
  | 'popupClosed'
  | 'qrTextReceived'
  | 'scanQrPopupClosed'
  | 'clipboardTextReceived'
  | 'writeAccessRequested'
  | 'contactRequested'
  | 'biometricManagerUpdated'
  | 'biometricAuthRequested'
  | 'biometricTokenUpdated'
  | 'fullscreenChanged'
  | 'fullscreenFailed'
  | 'homeScreenAdded'
  | 'homeScreenChecked'
  | 'accelerometerStarted'
  | 'accelerometerStopped'
  | 'accelerometerChanged'
  | 'accelerometerFailed'
  | 'deviceOrientationStarted'
  | 'deviceOrientationStopped'
  | 'deviceOrientationChanged'
  | 'deviceOrientationFailed'
  | 'gyroscopeStarted'
  | 'gyroscopeStopped'
  | 'gyroscopeChanged'
  | 'gyroscopeFailed'
  | 'locationManagerUpdated'
  | 'locationRequested'
  | 'shareMessageSent'
  | 'shareMessageFailed'
  | 'emojiStatusSet'
  | 'emojiStatusFailed'
  | 'emojiStatusAccessRequested'
  | 'fileDownloadRequested';
