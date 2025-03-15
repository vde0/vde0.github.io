import { useGetCurUser, useGetOutUser } from "./connectHooks";
import { useWrite, useMsgHistory } from "./textChatHooks";
import { usePlatform, useCheckMobile } from "./platformHooks";

export {
    useGetCurUser, useGetOutUser,
    useWrite, useMsgHistory,
    usePlatform, useCheckMobile,
};

export * from "./useMobileKeyboard";