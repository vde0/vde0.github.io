import React from 'react';
import { checkClickByArea, isMobile } from './utils';
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

        this.onRootClick  = this.onRootClick.bind(this);

        this.tg = this.props.telegram;
        this.props.clickWrapper.onClick = this.onRootClick;

        this.state = {
            dialogShown: false,
            footerShown: true,
            unreadedMsgCount: 1,
        };

        this.dialogData = {
            userID: 555,
        };
    }

    render () {
        return (
            <article className="app">
                <AppContainer contentType={Video} empty />
                <AppContainer
                    contentType={Dialog}
                    empty={!this.state.dialogShown}
                    data={this.dialogData} />

                {this.state.footerShown
                    ? <AppFooter
                        unreadedMsgCount={this.state.unreadedMsgCount}
                        onSeeMsgs={this.onSeeMsgs}
                        onAddUser={this.onAddUser}
                        onNext={this.onNext} />
                    : ""
                }
            </article>
        );
    }

    onSeeMsgs (evt) {
        this.setState({dialogShown: !this.state.dialogShown});

        if (isMobile) {
            this.setState({dialogShown: !this.state.dialogShown});
        }
    }
    onAddUser (evt) {}
    onNext (evt) {}

    onRootClick (evt) {
        const dialogSelector    = 'dialog';
        const btnSelector       = 'app__btn_mod_msgs';
        console.log(isMobile);

        const clickDialogCheck  = checkClickByArea(evt, dialogSelector);
        const clickMsgsBtnCheck = checkClickByArea(evt, btnSelector);

        if (!clickDialogCheck && !clickMsgsBtnCheck) {
            this.hideDialog();
            if (isMobile) this.showFooter();
        };
    }

    hideDialog () {
        this.setState({dialogShown: false});
    }
    showDialog () {
        this.setState({dialogShown: false});
    }

    hideFooter () {
        this.setState({dialogShown: false});
    }
    showFooter () {
        this.setState({dialogShown: false});
    }
}