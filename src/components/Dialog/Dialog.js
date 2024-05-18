import React from 'react';
import { appParams, telegram } from '../../utils/utils';
import './Dialog.css';
import MsgForm from '../MsgForm/MsgForm';
import MsgList from '../MsgList/MsgList';
import ClassLine from '../../utils/ClassLine';
import TaskManager from '../../utils/TaskManager';
import UpdateHook from '../../utils/UpdateHook';


let userDB = {
    /// userID: {...}
    555: {
        name: "Mark",
    },
    201: {
        name: "Собеседник",
    },
    92: {
        name: "Shrek",
    },
    100: {
        name: "Console",
    },
}

let msgDB = {
    /// msgID: {...}
    add (msgBlock) {
        const msgID = ++this.length;
        this[msgID] = {...msgBlock};

        return msgID;
    },
    length: 5,
    1: {
        userID: 555,
        time: "15:06",
        textContent: "Как дела?",
    },
    2: {
        userID: 201,
        time: "15:00",
        textContent: "Норм. Уйди.",
    },
    3: {
        userID: 555,
        time: "15:06",
        textContent: "Блин :( Ну вот. Ну блин :(",
    },
    4: {
        userID: 555,
        time: "15:06",
        textContent: "Блин блинский :(",
    },
    5: {
        userID: 201,
        time: "15:00",
        textContent: "Хыыыы!",
    },
}

let chatDB = {
    /// chatID: [msgID, msgID, ...]
    add (msgID, chatID) {
        this[chatID].push(msgID);
    },
    1: [1, 2, 3, 4, 5],
}

function getUserInfo (userID) {
    return {...userDB[userID]};
}

function getMsg (msgID) {
    return {...msgDB[msgID]};
}

function getChat (chatID) {
    return [...chatDB[chatID]];
}

function sendMsg (msgBlock, chatID) {
    const msgID = msgDB.add(msgBlock);
    chatDB.add(msgID, chatID);
}


export default class Dialog extends React.Component {

    get userID () { return this.props.data.userID; }
    get chatID () { return this.props.data.chatID; }
    msgText     = "";

    get makeContainerDynamic () { return this.props.data.makeContainerDynamic }
    get makeContainerStatic () { return this.props.data.makeContainerStatic }

    get msgList () {
        let chat    = getChat(this.chatID);
        chat        = chat.map( msgID => {
            let msg     = getMsg(msgID);

            if (msg.userID === this.userID) {
                msg.classLine   = "msg-list__msg-block msg msg_user_current";
                msg.name        = "Вы";
            } else {
                msg.classLine   = "msg-list__msg-block msg msg_user_companion";
                msg.name        = getUserInfo(msg.userID).name;
            }

            return msg;
        })

        return chat;
    };

    classLine   = new ClassLine("dialog");

    constructor (props) {
        super(props);

        this.onSend         = this.onSend.bind(this);
        this.onInput        = this.onInput.bind(this);
        this.onClickDialog  = this.onClickDialog.bind(this);

        this.focusHook      = new UpdateHook();

        this.state = {
            msgList: this.msgList,
            focusField: true,
            focusFieldUpdater: true,
            scrollDown: null,
            scrollDownUpdater: true,
        }
        ClassLine.initPassedClassLine(this);
    }

    componentDidMount () {

        this.scrollDown("instant");

        this.props.data.blur    = this.blurMsgField.bind(this);

        if (appParams.isMobile) {
            this.openKeyboardHandler = this.openKeyboardHandler.bind(this);
            this.closeKeyboardHandler = this.closeKeyboardHandler.bind(this);
            window.addEventListener("openkeyboard", this.openKeyboardHandler);
            window.addEventListener("closekeyboard", this.closeKeyboardHandler);
        }
    }

    componentWillUnmount () {
        this.props.data.blur = () => {};
        if (appParams.isMobile) {
            window.removeEventListener("openkeyboard", this.openKeyboardHandler);
            window.removeEventListener("closekeyboard", this.closeKeyboardHandler);
        }
    }

    render () {
        return(
            <article
                className={this.state.classLine}
                onClick={this.onClickDialog}>
                
                <MsgList
                    className="dialog__msg-list"
                    scrollDown={this.state.scrollDown}
                    scrollDownUpdater={this.state.scrollDownUpdater}
                    msgList={this.state.msgList} />

                <MsgForm
                    className="dialog__msg-form"
                    focusHook={this.focusHook}
                    piston={this.props.piston} onInput={this.onInput} onSend={this.onSend} />
            </article>
        );
    }


    openKeyboardHandler (evt) {
        this.makeContainerDynamic();
    }

    closeKeyboardHandler (evt) {
        TaskManager.setMacrotask(_ => this.makeContainerStatic(), 3);
    }


    onSend (evt) {
        evt.preventDefault();
        
        if (!this.msgText) return;
        
        const msgBlock = {
            userID: this.userID,
            textContent: this.msgText,
        }

        sendMsg(msgBlock, this.chatID);
        this.setState({ msgList: this.msgList });

        TaskManager.setMacrotask( _ => this.scrollDown("smooth"), 1 );
    }
    onInput (evt) {
        this.msgText = evt.target.value;
    }
    onClickDialog (evt) {
        this.focusMsgField();
    }

    focusMsgField () {
        this.focusHook.on(true);
    }
    blurMsgField () {
        this.focusHook.on(false);
    }

    scrollDown(behaviorArg="instant") {
        if (behaviorArg !== "instant" && behaviorArg !== "smooth" && behaviorArg !== "auto") {
            throw SyntaxError(
                "Dialog.scrollDown() take the \"instant\", \"smooth\" and \"auto\" arg values only.");
        }

        this.setState({
            scrollDown: behaviorArg,
            scrollDownUpdater: !this.state.scrollDownUpdater,
        });
    }
}