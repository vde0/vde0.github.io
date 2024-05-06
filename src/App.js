import React from 'react';
import { checkClickByArea, checkMobileKeyboard, getClassLine, getComponentUpdateHook, isIOS, isMobile, startHeight } from './utils';
import AppContainer from './components/AppContainer';
import Video from './components/Video';
import Dialog from './components/Dialog';
import AppFooter from './components/AppFooter';


export default class App extends React.Component {
    
    constructor (props) {
        super(props);

        this.onRootClick        = this.onRootClick.bind(this);
        this.hideFooter         = this.hideFooter.bind(this);

        this.tg = this.props.telegram;
        this.props.rootHandler.setHandler("click", this.onRootClick);

        this.appContentClassLine = getClassLine("app__content");

        this.state = {
            dialogShown: false,
            footerShown: true,
            unreadedMsgCount: 1,

            appContentClassLine: this.appContentClassLine.getLine(),

            wasOpened: false,
            innerHeight: window.innerHeight,
            clientHeight: document.documentElement.clientHeight,
            offsetHeight: document.documentElement.offsetHeight,
            scrollHeight: document.documentElement.scrollHeight,
            visualViewportHeight: window.visualViewport.height,
            tgHeight: this.tg.viewportHeight,
            tgStableHeight: this.tg.viewportStableHeight,
        };

        this.dialogData = {
            userID: 555,
            chatID: 1,
        };

        this.menuData = {
            unreadedMsgCount: this.state.unreadedMsgCount,
            onSeeMsgs: this.onSeeMsgs.bind(this),
            onAddUser: this.onAddUser.bind(this),
            onReport: this.onReport.bind(this),
            onNext: this.onNext.bind(this),
        }

        this.dialogHook = getComponentUpdateHook();
    }

    componentDidMount () {
        window.addEventListener("openkeyboard", evt => {
            setTimeout( _ => this.showDialog() );
            this.hideFooter();

            this.appContentClassLine.add("app__content_for-keyboard");
            this.setState({
                appContentClassLine: this.appContentClassLine.getLine(),
                keyboardStateByEvents: checkMobileKeyboard(),
                wasOpened: true,
            });
        });
        window.addEventListener("closekeyboard", evt => {
            this.hideDialog();
            setTimeout( _ => this.showFooter() );

            this.appContentClassLine.remove("app__content_for-keyboard");
            this.setState({
                appContentClassLine: this.appContentClassLine.getLine(),
                keyboardStateByEvents: checkMobileKeyboard(),
            });
        });

        let mode = null;

        this.tg.onEvent("viewportChanged", evt => {
            mode = "resize";

            this.setState({
                updatedBy: "resize",
                keyboardState: checkMobileKeyboard(),
                innerHeight: window.innerHeight,
                clientHeight: document.documentElement.clientHeight,
                scrollHeight: document.documentElement.scrollHeight,
                offsetHeight: document.documentElement.offsetHeight,
                visualViewportHeight: window.visualViewport.height,
                tgHeight: this.tg.viewportHeight,
                tgStableHeight: this.tg.viewportStableHeight,
            });
        });

        const timerID = setInterval(() => {
            if (mode === "resize") {
                clearInterval(timerID);
                return;
            }

            this.setState({
                updatedBy: "interval",
                keyboardState: checkMobileKeyboard(),
                innerHeight: window.innerHeight,
                clientHeight: document.documentElement.clientHeight,
                scrollHeight: document.documentElement.scrollHeight,
                scrollHeight: document.documentElement.scrollHeight,
                visualViewportHeight: window.visualViewport.height,
                tgHeight: this.tg.viewportHeight,
                tgStableHeight: this.tg.viewportStableHeight,
            });
        }, 500);
    }

    render () {
        return (
            <article className="app">
                <div className="content-log">
                    <p>Mobile: {String(isMobile)} | iOS: {String(isIOS)}</p>
                    <p>keyboard called by events: {String(this.state.keyboardStateByEvents)}</p>
                    <p>wasOpened: {String(this.state.wasOpened)}</p>
                    <p>startHeight: {startHeight}</p>
                    <p>updated by: {this.state.updatedBy}</p>
                    <p>keyboard: {String(this.state.keyboardState)}</p>
                    <p>innerHeight: {this.state.innerHeight}</p>
                    <p>clientHeight: {this.state.clientHeight}</p>
                    <p>offsetHeight: {this.state.offsetHeight}</p>
                    <p>scrollHeight: {this.state.scrollHeight}</p>
                    <p>VV height: {this.state.visualViewportHeight}</p>
                    <p>web-app height: {this.state.tgHeight}</p>
                    <p>web-app stable-height: {this.state.tgStableHeight}</p>
                </div>

                <section className={this.state.appContentClassLine}>
                    <AppContainer contentType={Video} empty />
                    <AppContainer
                        contentType={Dialog}
                        dynamic
                        hook={this.dialogHook}
                        empty={!this.state.dialogShown}
                        data={this.dialogData} />
                </section>

                <AppFooter data={this.menuData} hidden={!this.state.footerShown} />
            </article>
        );
    }

    onSeeMsgs (evt) {
        if (isMobile)   window.dispatchEvent( new Event("openkeyboard") );
        else            this.toggleDialog();
    }
    onAddUser (evt) {}
    onReport (evt) {}
    onNext (evt) {}

    onRootClick (evt) {
        const dialogSelector    = '.dialog';
        const btnSelector       = '.bottom-menu__btn_mod_msgs';

        const clickDialogCheck  = checkClickByArea(evt, dialogSelector);
        const clickMsgsBtnCheck = checkClickByArea(evt, btnSelector);

        if (!clickDialogCheck && !clickMsgsBtnCheck) {
            this.hideDialog();
        };
    }

    hideDialog () {
        this.setState({dialogShown: false});
        this.dialogHook.on();
    }
    showDialog () {
        this.setState({dialogShown: true});
        this.dialogHook.on();
    }
    toggleDialog () {
        this.setState({dialogShown: !this.state.dialogShown});
        this.dialogHook.on();
    }

    hideFooter () {
        this.setState({footerShown: false});
    }
    showFooter () {
        this.setState({footerShown: true});
    }
    toggleFooter () {
        this.setState({footerShown: !this.state.footerShown});
    }
}