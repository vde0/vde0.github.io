import React from 'react';
import { appParams, telegram } from '../../utils/utils';
import './Dialog.css';
import MsgForm from '../MsgForm/MsgForm';
import MsgList from '../MsgList/MsgList';
import ClassLine from '../../utils/ClassLine';


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
    
    userID      = this.props.data.userID;
    chatID      = this.props.data.chatID;
    msgText     = "";

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

        this.state = {
            msgList: this.msgList,
        }
        ClassLine.initPassedClassLine(this);
    }

    componentDidMount () {

        setTimeout(() => {
            const msgBlock = {
                userID: 92,
                textContent: "SOMEBODY WHOOOOOA",
            };
            sendMsg(msgBlock, this.chatID);

            this.setState({msgList: this.msgList});
        }, 4e3);
    }
    
    componentDidUpdate () {
        if (this.state.msgList.at(-1).userID === this.userID) {
            // this.scrollDown("smooth");
        }
    }

    render () {
        return(
            <article
                className={this.state.classLine}
                onClick={this.onClickDialog}>
                
                <MsgList className="dialog__msg-list" msgList={this.state.msgList} />

                <MsgForm
                    className="dialog__msg-form"
                    piston={this.props.piston} onInput={this.onInput} onSend={this.onSend} />
            </article>
        );
    }

    onSend (evt) {
        evt.preventDefault();
        
        if (!this.msgText) return;
        
        const msgBlock = {
            userID: this.userID,
            textContent: this.msgText,
        }

        sendMsg(msgBlock, this.chatID);
        this.setState({msgList: this.msgList});

        console.log(evt.target.form);
        this.resetMsgForm(evt.target.form);
    }
    onInput (evt) {
        this.msgText = evt.target.value;
    }
    onClickDialog (evt) {
        // if (evt.target === this.msgFieldBlock) return;
        // this.focusMsgField();
    }

    resetMsgForm (msgFormBlock) {
        msgFormBlock.reset();
        this.msgText = "";
    }

    focusMsgField () {
        // this.msgFieldBlock.focus();
        // this.setState({
        //     msgField: (
        //         <span
        //             className="msg-form__field-placeholder msg-form__field-placeholder_focused"
        //             ref={el => this.msgFieldBlock = el}></span>
        //     ),
        // });
        // setTimeout(_ => {
        //     this.setState({
        //         msgField: (
        //             <input ref={el => this.msgFieldBlock = el}
        //                 type="text"
        //                 autoFocus
        //                 className="msg-form__field msg-form__field_focused"
        //                 onInput={this.onInput}/>
        //         ),
        //     });
        // });
    }
}