import React from 'react';
import AppContainer from './components/AppContainer';
import Video from './components/Video';
import Dialog from './components/Dialog';
import AppFooter from './components/AppFooter';


export default class App extends React.Component {
    
    constructor (props) {
        super(props);

        this.tg = this.props.telegram;

        this.onAddUser  = this.onAddUser.bind(this);
        this.onSeeMsgs  = this.onSeeMsgs.bind(this);
        this.onNext     = this.onNext.bind(this);

        this.state = {
            dialogShown: false,
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
                <AppFooter
                    unreadedMsgCount={this.state.unreadedMsgCount}
                    onSeeMsgs={this.onSeeMsgs}
                    onAddUser={this.onAddUser}
                    onNext={this.onNext} />
            </article>
        );
    }

    onSeeMsgs (evt) {
        this.setState({dialogShown: !this.state.dialogShown});
    }
    onAddUser (evt) {}
    onNext (evt) {}

    blurDialog () {
        this.setState({dialogShown: false});
    }

}