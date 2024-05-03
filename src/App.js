import React from 'react';
import { checkClickByArea, checkMobileKeyboard, getComponentUpdateHook, isMobile } from './utils';
import AppContainer from './components/AppContainer';
import Video from './components/Video';
import Dialog from './components/Dialog';
import AppFooter from './components/AppFooter';


export default class App extends React.Component {
    
    constructor (props) {
        super(props);

        this.onAddUser  = this.onAddUser.bind(this);
        this.onSeeMsgs  = this.onSeeMsgs.bind(this);
        this.onNext     = this.onNext.bind(this);

        this.onRootClick    = this.onRootClick.bind(this);
        this.hideFooter     = this.hideFooter.bind(this);

        this.tg = this.props.telegram;
        this.props.clickWrapper.onClick = this.onRootClick;

        this.state = {
            dialogShown: false,
            footerShown: true,
            unreadedMsgCount: 1,
        };

        this.dialogData = {
            userID: 555,
            chatID: 1,
        };

        this.menuData = {
            unreadedMsgCount: this.state.unreadedMsgCount,
            onSeeMsgs: this.onSeeMsgs,
            onAddUser: this.onAddUser,
            onNext: this.onNext,
        }

        this.dialogHook = getComponentUpdateHook();
    }

    componentDidMount () {
        window.addEventListener("openkeyboard", evt => this.hideFooter());
        window.addEventListener("closekeyboard", evt => {this.showFooter(); this.hideDialog()});
    }

    render () {
        return (
            <article className="app">
                <AppContainer contentType={Video} empty />
                <AppContainer
                    contentType={Dialog}
                    cut
                    hook={this.dialogHook}
                    empty={!this.state.dialogShown}
                    data={this.dialogData} />

                <AppFooter data={this.menuData} hidden={!this.state.footerShown} />
            </article>
        );
    }

    onSeeMsgs (evt) {
        this.toggleDialog();
    }
    onAddUser (evt) {}
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