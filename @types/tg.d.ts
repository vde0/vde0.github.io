import { WebApp } from "@vkruglikov/react-telegram-web-app/lib/core/twa-types";

export {
    TWebApp, TBindHandler, TEventHandler, TEventData, TEventType
};


type TWebApp = WebApp & {
    lockOrientation?:        () => void;
    disableVerticalSwipes?:  () => void;
    requestFullscreen?:      () => void;
    onEvent?: TgBindHandler,
    offEvent?: TgBindHandler,
};

declare global {
    interface Window {
        Telegram: { WebApp: TWebApp };
    };
}


type TBindHandler  = (event: TgEventType, handler: TgEventHandler) => void;
type TEventHandler = (data: TgEventData) => void;
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
