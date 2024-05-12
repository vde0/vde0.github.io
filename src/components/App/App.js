import React from 'react';
import { checkOwnershipToArea, appParams, telegram } from '../../utils/utils';
import Container from '../Container/Container';
import Video from '../Video/Video';
import Dialog from '../Dialog/Dialog';
import AppFooter from '../AppFooter/AppFooter';
import './App.css';
import ClassLine from '../../utils/ClassLine';
import ComponentUpdateHook from '../../utils/ComponentUpdateHook';
import TaskManager from '../../utils/TaskManager';


export default class App extends React.Component {
    
    constructor (props) {
        super(props);

        this.log            = true;
        this.showUpdateNum  = true;

        this.onRootClick        = this.onRootClick.bind(this);
        this.hideFooter         = this.hideFooter.bind(this);

        this.props.rootHandler.setHandler("click", this.onRootClick);
        this.appContentClassLine = new ClassLine("app__content");

        this.state = {
            dialogShown: false,
            footerShown: true,
            unreadedMsgCount: 1,

            appContentClassLine: this.appContentClassLine.getLine(),
            
            keyboardWasOpened: false,
            keyboardState: null,
            windowHeight: window.innerHeight,
            tgHeight: telegram.viewportHeight,
            tgStableHeight: telegram.viewportStableHeight,
        };

        this.dialogData = {
            userID: 555,
            chatID: 1,
        };

        this.menuData = {
            unreadedMsgCount: this.state.unreadedMsgCount,
            onOpenDialog: this.onOpenDialog.bind(this),
            onAddUser: this.onAddUser.bind(this),
            onReport: this.onReport.bind(this),
            onNext: this.onNext.bind(this),
        }

        this.dialogHook = new ComponentUpdateHook();
    }

    componentDidMount () {
        if (appParams.isMobile) {
            this.openKeyboardHandler = this.openKeyboardHandler.bind(this);
            this.closeKeyboardHandler = this.closeKeyboardHandler.bind(this);
            window.addEventListener("openkeyboard", this.openKeyboardHandler);
            window.addEventListener("closekeyboard", this.closeKeyboardHandler);
        }


        if (this.log) setInterval(_ => {

            if (this.windowHeight !== window.innerHeight) {
                this.setState({ windowHeight: window.innerHeight }); }
            if (this.tgHeight !== telegram.viewportHeight) {
                this.setState({ tgHeight: telegram.viewportHeight}); }
            if (this.tgStableHeight !== telegram.viewportStableHeight) {
                this.setState({ tgStableHeight: telegram.viewportStableHeight }); }

            this.windowHeight   = window.innerHeight;
            this.tgHeight       = telegram.viewportHeight;
            this.tgStableHeight = telegram.viewportStableHeight;
        });
    }

    componentWillUnmount () {
        if (appParams.isMobile) {
            window.removeEventListener("openkeyboard", this.openKeyboardHandler);
            window.removeEventListener("closekeyboard", this.closeKeyboardHandler);
        }
    }

    render () {
        return (
            <article className="app">
                {this.showUpdateNum ? <p className="update-num-log">Update num: 28.6.1</p> : ""}
                <div className={"content-log " + (!this.log ? "content-log_hidden" : "")}>
                    <p>Mobile: {String(appParams.isMobile)} | iOS: {String(appParams.isIOS)}</p>
                    <p>keyboardWasOpened: {String(this.state.keyboardWasOpened)}</p>
                    <p>keyboard state: {String(this.state.keyboardState)}</p>
                    <p>startHeight: {appParams.startHeight}</p>
                    <p>window height: {this.state.windowHeight}</p>
                    <p>web-app height: {this.state.tgHeight}</p>
                    <p>web-app stable-height: {this.state.tgStableHeight}</p>
                </div>

                <section className={this.state.appContentClassLine}>
                    <Container contentType={Video} className="app__container" empty />
                    <Container
                        contentType={Dialog}
                        className="app__container"
                        dynamic
                        hook={this.dialogHook}
                        empty={!this.state.dialogShown}
                        data={this.dialogData} />
                </section>

                <AppFooter data={this.menuData} hidden={!this.state.footerShown} />
            </article>
        );
    }

    onOpenDialog (evt) {
        if (appParams.isMobile)   window.dispatchEvent( new Event("openkeyboard") );
        else            this.toggleDialog();
    }
    onAddUser (evt) {}
    onReport (evt) {}
    onNext (evt) {}

    onRootClick (evt) {
        const dialogSelector    = '.dialog';
        const btnSelector       = '.bottom-menu__btn_mod_msgs';

        const el                = evt.target;
        const clickDialogCheck  = checkOwnershipToArea(el, dialogSelector);
        const clickMsgsBtnCheck = checkOwnershipToArea(el, btnSelector);

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


    openKeyboardHandler (evt) {
        TaskManager.setMacrotask(_ => this.showDialog(), 1);
        this.hideFooter();

        this.appContentClassLine.add(
            appParams.isIOS ? "app__content_for-ios" : "app__content_for-keyboard");
        this.setState({
            appContentClassLine: this.appContentClassLine.getLine(),
            keyboardState: appParams.mobileKeyboardState,
            keyboardWasOpened: true,
        });
    }
    closeKeyboardHandler (evt) {
        this.hideDialog();
        TaskManager.setMacrotask(_ => this.showFooter(), 1);

        this.appContentClassLine.remove(
            appParams.isIOS ? "app__content_for-ios" : "app__content_for-keyboard");
        this.setState({
            appContentClassLine: this.appContentClassLine.getLine(),
            keyboardState: appParams.mobileKeyboardState,
        });
    }
}