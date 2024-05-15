import React from 'react';
import { checkOwnershipToArea, appParams, telegram } from '../../utils/utils';
import Container from '../Container/Container';
import Video from '../Video/Video';
import Dialog from '../Dialog/Dialog';
import AppFooter from '../AppFooter/AppFooter';
import './App.css';
import ClassLine from '../../utils/ClassLine';
import UpdateHook from '../../utils/UpdateHook';
import TaskManager from '../../utils/TaskManager';


export default class App extends React.Component {
    
    constructor (props) {
        super(props);

        this.log            = false;
        this.showUpdateNum  = true;

        this.onRootClick        = this.onRootClick.bind(this);
        this.hideFooter         = this.hideFooter.bind(this);

        this.props.rootHandler.setHandler("click", this.onRootClick);
        this.appContentClassLine = new ClassLine("app__content");

        this.state = {
            dialogShown: false,
            dialogDynamic: true,
            footerShown: true,
            unreadedMsgCount: 1,

            appContentClassLine: this.appContentClassLine.getLine(),
            
            keyboardWasOpened: false,
            keyboardState: null,
            windowHeight: Math.round(window.innerHeight * 100) / 100,
            tgHeight: Math.round(telegram.viewportHeight * 100) / 100,
            tgStableHeight: Math.round(telegram.viewportStableHeight * 100) / 100,
        };

        this.dialogData = {
            userID: 555,
            chatID: 1,
            makeContainerDynamic: this.makeDialogBlockDynamic.bind(this),
            makeContainerStatic: this.makeDialogBlockStatic.bind(this),
        };

        this.menuData = {
            unreadedMsgCount: this.state.unreadedMsgCount,
            onOpenDialog: this.onOpenDialog.bind(this),
            onAddUser: this.onAddUser.bind(this),
            onReport: this.onReport.bind(this),
            onNext: this.onNext.bind(this),
        }

        this.dialogHook = new UpdateHook();
        this.footerHook = new UpdateHook();
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

            this.windowHeight   = Math.round(window.innerHeight * 100) / 100;
            this.tgHeight       = Math.round(telegram.viewportHeight * 100) / 100;
            this.tgStableHeight = Math.round(telegram.viewportStableHeight * 100) / 100;
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
                {this.showUpdateNum ? <p className="update-num-log">Update num: 34</p> : ""}
                <div className={"content-log " + (!this.log ? "content-log_hidden" : "")}>
                    <p>Mobile: {String(appParams.isMobile)} | iOS: {String(appParams.isIOS)}</p>
                    <p>keyboardWasOpened: {String(this.state.keyboardWasOpened)}</p>
                    <p>keyboard state: {String(this.state.keyboardState)}</p>
                    <p>clickDialogCheck: {String(this.state.clickDialogCheck)}</p>
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
                        dynamic={this.state.dialogDynamic}
                        hook={this.dialogHook}
                        empty={!this.state.dialogShown}
                        data={this.dialogData} />
                </section>

                <AppFooter
                    data={this.menuData} hidden={!this.state.footerShown} hook={this.footerHook} />
            </article>
        );
    }

    onOpenDialog (evt) {
        this.toggleDialog();
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

        this.setState({ clickDialogCheck: clickDialogCheck });

        if (!clickDialogCheck && !clickMsgsBtnCheck) {
            this.hideDialog();
        };
    }

    hideDialog () {
        this.dialogHook.onAsMacrotask(1);
        this.setState({dialogShown: false});
    }
    showDialog () {
        this.dialogHook.onAsMacrotask(1);
        this.setState({dialogShown: true});
    }
    toggleDialog () {
        this.dialogHook.onAsMacrotask(1);
        this.setState({dialogShown: !this.state.dialogShown});
    }

    hideFooter () {
        this.footerHook.onAsMacrotask(1);
        this.setState({footerShown: false});
    }
    showFooter () {
        this.footerHook.onAsMacrotask(1);
        this.setState({footerShown: true});
    }
    toggleFooter () {
        this.footerHook.onAsMacrotask(1);
        this.setState({footerShown: !this.state.footerShown});
    }


    makeDialogBlockDynamic () {
        this.dialogHook.onAsMacrotask(1);
        this.setState({ dialogDynamic: true });
    }
    makeDialogBlockStatic () {
        this.dialogHook.onAsMacrotask(1);
        this.setState({ dialogDynamic: false });
    }


    openKeyboardHandler (evt) {
        this.hideFooter();

        this.appContentClassLine.add(
            appParams.isIOS ? "app__content_for-ios" : "app__content_for-keyboard" );
        ClassLine.updateState(this, "appContentClassLine");
        
        if (!this.log) return;
        this.setState({
            keyboardState: appParams.mobileKeyboardState,
            keyboardWasOpened: true,
        });
    }
    closeKeyboardHandler (evt) {
        this.showFooter();

        this.appContentClassLine.remove(
            appParams.isIOS ? "app__content_for-ios" : "app__content_for-keyboard" );
        ClassLine.updateState(this, "appContentClassLine");

        if (!this.log) return;
        this.setState({
            keyboardState: appParams.mobileKeyboardState,
        });
    }
}