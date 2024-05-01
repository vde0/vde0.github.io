import React from 'react';
import AppContainer from './components/AppContainer';
import Video from './components/Video';
import Dialog from './components/Dialog';
import AppFooter from './components/AppFooter';

export default class App extends React.Component {

    dialogData = {
        userID: 555,
        msgList: [
            {
                userID: 555,
                userName: "Mark",
                time: "15:06",
                textContent: "Как дела?",
            },
            {
                userID: 201,
                userName: "Собеседник",
                time: "15:00",
                textContent: "Норм. Уйди.",
            },
            {
                userID: 555,
                userName: "Mark",
                time: "15:06",
                textContent: "Блин :( Ну вот. Ну блин :(",
            },
            {
                userID: 555,
                userName: "Mark",
                time: "15:06",
                textContent: "Блин блинский :(",
            },
            {
                userID: 201,
                userName: "Собеседник",
                time: "15:00",
                textContent: "Хыыыы!",
            },
        ]
    }

    constructor (props) {
        super(props);

        this.onAddUser  = this.onAddUser.bind(this);
        this.onSeeMsgs  = this.onSeeMsgs.bind(this);
        this.onNext     = this.onNext.bind(this);

        this.state = {
            dialogShown: false,
            unreadedMsgCount: 1,
        };
    }

    render () {
        const tg = this.props.telegram;
        return (
            <article className="app">
                <div>{this.isExpanded}</div>
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
        this.setState({dialogShown: this.state.dialogShown ? false : true});
    }
    onAddUser (evt) {}
    onNext (evt) {}
}