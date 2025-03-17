const mockTelegram = (): void => {

    global.window.Telegram = {
        WebApp: {
        platform: "android",
        initData: "",
        initDataUnsafe: {
            auth_date: 0,
            hash: "",
        },
        colorScheme: "dark",
        themeParams: {},
        isExpanded: false,
        viewportHeight: 0,
        viewportStableHeight: 0,
        MainButton: {
            text: "",
            color: "",
            textColor: "",
            isActive: false,
            isVisible: false,
            isProgressVisible: false,
            setText () { return this; },
            show () { return this; },
            hide () { return this; },
            enable () { return this; },
            disable () { return this; },
            showProgress () { return this; },
            hideProgress () { return this; },
            onClick () { return this; },
            offClick () { return this; },
            setParams () { return this },
        },
        sendData () {},
        ready () {},
        expand () {},
        close () {},
        onEvent () {},
        offEvent () {},
        },
    };
};

export { mockTelegram };