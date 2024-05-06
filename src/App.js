import React from 'react';
import { checkClickByArea, checkMobileKeyboard, getClassLine, getComponentUpdateHook, isMobile } from './utils';
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
            this.setState({ appContentClassLine: this.appContentClassLine.getLine() });
        });
        window.addEventListener("closekeyboard", evt => {
            this.hideDialog();
            setTimeout( _ => this.showFooter() );

            this.appContentClassLine.remove("app__content_for-keyboard");
            this.setState({ appContentClassLine: this.appContentClassLine.getLine() });
        });
    }

    render () {
        return (
            <article className="app">
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