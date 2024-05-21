import React from 'react';
import { checkOwnershipToArea, appParams, telegram } from '../../utils/utils';
import Container from '../Container/Container';
import Video from '../Video/Video';
import Dialog from '../Dialog/Dialog';
import './App.css';
import './AppFooter.css';
import ClassLine from '../../utils/ClassLine';
import UpdateHook from '../../utils/UpdateHook';
import TaskManager from '../../utils/TaskManager';
import BottomMenu from '../BottomMenu/BottomMenu';


export default class App extends React.Component {

    contentClassLine    = new ClassLine("app__content");
    footerClassLine     = new ClassLine("app__footer");
    
    constructor (props) {
        super(props);

        this.log            = true;
        this.showUpdateNum  = true;

        this.dialogShown    = false;
        this.footerShown    = true;

        this.onRootClick        = this.onRootClick.bind(this);
        this.hideFooter         = this.hideFooter.bind(this);

        this.props.rootHandler.setHandler("click", this.onRootClick);

        this.state = {
            unreadedMsgCount: 1,

            contentClassLine: this.contentClassLine.getLine(),
            footerClassLine: this.footerClassLine.getLine(),
            
            keyboardState: null,
            windowHeight: Math.round(window.innerHeight * 100) / 100,
            tgHeight: Math.round(telegram.viewportHeight * 100) / 100,
            tgStableHeight: Math.round(telegram.viewportStableHeight * 100) / 100,
        };

        this.dialogData = {
            userID: 555,
            chatID: 1,
            blur: () => {},
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

        this.dialogContainerEmptyHook   = new UpdateHook();
        this.dialogContainerDynamicHook = new UpdateHook();
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
                {this.showUpdateNum ? <p className="update-num-log">Update num: 41</p> : ""}
                <div className={"content-log " + (!this.log ? "content-log_hidden" : "")}>
                    <p>Mobile: {String(appParams.isMobile)} | iOS: {String(appParams.isIOS)}</p>
                    <p>keyboard state: {String(this.state.keyboardState)}</p>
                    <p>startHeight: {appParams.startHeight}</p>
                    <p>window height: {this.state.windowHeight}</p>
                    <p>web-app height: {this.state.tgHeight}</p>
                    <p>web-app stable-height: {this.state.tgStableHeight}</p>
                </div>

                <section className={this.state.contentClassLine}>
                    <Container contentType={Video} className="app__container" empty />
                    <Container
                        contentType={Dialog}
                        className="app__container"
                        dynamicHook={this.dialogContainerDynamicHook}
                        emptyHook={this.dialogContainerEmptyHook}
                        empty={!this.dialogShown}
                        data={this.dialogData} />
                </section>

                <footer className={this.state.footerClassLine}>
                    <BottomMenu data={this.menuData} />
                </footer>
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

        if (!clickDialogCheck && !clickMsgsBtnCheck) {
            this.hideDialog();
        };
    }

    hideDialog () {
        if ( appParams.mobileKeyboardState ) {
            this.dialogBlur();
            setTimeout(_ => {
                this.dialogShown = false;
                this.dialogContainerEmptyHook.on(!this.dialogShown);
            }, 500);
        } else {
            this.dialogShown = false;
            this.dialogContainerEmptyHook.on(!this.dialogShown);
        }
    }
    showDialog () {
        this.dialogShown = true;
        this.dialogContainerEmptyHook.on(!this.dialogShown);
    }
    toggleDialog () {
        if (this.dialogShown)   this.hideDialog();
        else                    this.showDialog();
    }

    dialogBlur () {
        this.dialogData.blur();
    }

    hideFooter () {
        this.footerClassLine.add("app__footer_hidden");
        ClassLine.updateState(this, 'footerClassLine');

        this.footerShown = false;
        // this.footerHook.on(!this.footerShown);
    }
    showFooter () {
        this.footerClassLine.remove("app__footer_hidden");
        ClassLine.updateState(this, 'footerClassLine');

        this.footerShown = true;
        // this.footerHook.on(!this.footerShown);
    }
    toggleFooter () {
        if (this.footerShown)   this.hideFooter();
        else                    this.showFooter();
    }


    makeDialogBlockDynamic () {
        this.dialogContainerDynamicHook.on(true);
    }
    makeDialogBlockStatic () {
        this.dialogContainerDynamicHook.on(false);
    }


    openKeyboardHandler (evt) {
        this.hideFooter();

        this.appContentClassLine.add( "app__content_for-keyboard" );
        ClassLine.updateState(this, "appContentClassLine");
        
        if (!this.log) return;
        this.setState({
            keyboardState: appParams.mobileKeyboardState,
        });
    }
    closeKeyboardHandler (evt) {
        this.showFooter();

        this.appContentClassLine.remove( "app__content_for-keyboard" );
        ClassLine.updateState(this, "appContentClassLine");

        if (!this.log) return;
        this.setState({
            keyboardState: appParams.mobileKeyboardState,
        });
    }
}