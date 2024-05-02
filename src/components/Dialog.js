import React from 'react';
import sendBtnIc from '../icons/to-send.svg';
import Btn from './Btn';
import { isMobile } from '../utils';


let userDB = {
    /// userID: {...}
    555: {
        name: "Mark",
    },
    201: {
        name: "Собеседник",
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
    hideMenu    = this.props.data.hideMenuFunc;
    msgText     = "";

    get msgList () {
        let chat    = getChat(this.chatID);
        chat        = chat.map( msgID => {
            let msg     = getMsg(msgID);

            if (msg.userID === this.userID) {
                msg.classLine   = "msg msg_user_current";
                msg.name        = "Вы";
            } else {
                msg.classLine   = "msg msg_user_companion";
                msg.name        = getUserInfo(msg.userID).name;
            }

            return msg;
        })

        return chat;
    };

    constructor (props) {
        super(props);

        this.onSend         = this.onSend.bind(this);
        this.onInput        = this.onInput.bind(this);
        this.onFocusField   = this.onFocusField.bind(this);
        this.onClickDialog  = this.onClickDialog.bind(this);

        this.state = {
            msgList: this.msgList,
        }
    }

    componentDidMount () {
        this.DOMMsgList.scrollBy(0, this.DOMMsgList.scrollHeight);
    }
    
    componentDidUpdate () {
        if (this.msgList.at(-1).userID === this.userID) {
            this.DOMMsgList.scrollBy(0, this.DOMMsgList.scrollHeight);
        }
    }

    render () {
        return(
            <article className="dialog" onClick={this.onClickDialog}>
                <ul className="dialog__msg-list" ref={el => this.DOMMsgList = el}>
                    {this.state.msgList.map( (msg, msg_num) => {
                        return (
                            <li
                                key={msg_num}
                                className="dialog__msg-item"
                            ><section className={msg.classLine}>
                                <header className="msg__header">
                                    {/* <span className="msg__time">{msg.time}</span> */}
                                    <span className="msg__name">
                                        {msg.name}:
                                    </span>
                                </header>
                                <section className="msg__content">
                                    <p className='msg__text'>{msg.textContent}</p>
                                </section>
                            </section></li>
                        );
                    } )}
                </ul>

                <form ref={el => this.msgForm = el} className="msg-form dialog__msg-form">
                    <input ref={el => this.msgField = el}
                        type="text"
                        className="msg-form__field"
                        onInput={this.onInput}
                        onFocus={this.onFocusField}
                        autoFocus />
                    <Btn
                        type="submit"
                        className="msg-form__send-btn"
                        onClick={this.onSend}
                        content={<img src={sendBtnIc}/>} />
                </form>
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

        this.resetForm();
    }
    onInput (evt) {
        this.msgText = evt.target.value;
    }
    onFocusField (evt) {
        if(isMobile) this.hideMenu();
    }
    onClickDialog (evt) {
        this.msgField.focus();
    }

    resetForm () {
        this.msgForm.reset();
        this.msgText = "";
    }

}