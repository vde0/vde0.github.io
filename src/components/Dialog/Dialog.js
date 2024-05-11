import React from 'react';
import { appParams, getClassLine, getStickyPiston, telegram } from '../../utils/utils';
import './Dialog.css';
import MsgForm from '../MsgForm/MsgForm';
import Msg from '../Msg/Msg';


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
                msg.classLine   = "dialog__msg-block msg msg_user_current";
                msg.name        = "Вы";
            } else {
                msg.classLine   = "dialog__msg-block msg msg_user_companion";
                msg.name        = getUserInfo(msg.userID).name;
            }

            return msg;
        })

        return chat;
    };

    classLine   = getClassLine("dialog");

    constructor (props) {
        super(props);

        this.piston         = this.props.piston;
        
        if (this.props.className) {
            this.classLine.load(this.props.className);
        }

        this.onSend         = this.onSend.bind(this);
        this.onInput        = this.onInput.bind(this);
        this.onClickDialog  = this.onClickDialog.bind(this);

        this.state = {
            msgList: this.msgList,
            classLine: this.classLine.getLine(),
        }

        this.openKeyboardHandler    = this.openKeyboardHandler.bind(this);
        this.resizeMsgListHandler   = this.resizeMsgListHandler.bind(this);
    }

    componentDidMount () {
        if (appParams.isMobile) {
            window.addEventListener("openkeyboard", this.openKeyboardHandler);

            this.piston.piston = this.msgFormBlock;
            this.piston.press();
            //
            telegram.onEvent("viewportChanged", tg => {
                this.piston.press();
            });
            
            this.resizeMsgListObserver = new ResizeObserver( entries => {
                this.resizeMsgListHandler();
            } );
            this.prevMsgListHeight = this.msgListBlock.offsetHeight;
            this.resizeMsgListObserver.observe(this.msgListBlock);
        } else {
            this.scrollDown("instant");
        }

        setTimeout(() => {
            const msgBlock = {
                userID: 92,
                textContent: "SOMEBODY WHOOOOOA",
            };
            sendMsg(msgBlock, this.chatID);

            this.setState({msgList: this.msgList});
        }, 4e3);
    }

    componentWillUnmount () {
        setTimeout(_ => {
            this.piston.piston = null;
            this.resizeMsgListObserver?.disconnect();
            window.removeEventListener("openkeyboard", this.openKeyboardHandler);
        }, 50);
    }
    
    componentDidUpdate () {
        if (this.state.msgList.at(-1).userID === this.userID) {
            this.scrollDown("smooth");
        }
    }

    render () {
        return(
            <article
                className={this.state.classLine}
                onClick={this.onClickDialog}>
                <ul className="dialog__msg-list" ref={el => this.msgListBlock = el}>
                    {this.state.msgList.map( (msg, msg_num) => {
                        return (
                            <li
                                key={msg_num}
                                className="dialog__msg-item"
                            >
                                <Msg msg={msg} />
                            </li>
                        );
                    } )}
                </ul>

                <MsgForm
                    className="dialog__msg-form" onInput={this.onInput} onSend={this.onSend} />
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
        if (evt.target === this.msgFieldBlock) return;
        this.focusMsgField();
    }

    resetMsgForm (msgFormBlock) {
        msgFormBlock.reset();
        this.msgText = "";
    }
    
    openKeyboardHandler (evt) {
        this.scrollDown("instant");
        getStickyPiston(this.msgFormBlock);
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

    resizeMsgListHandler () {
        this.msgListBlock?.scrollBy({
            top: this.prevMsgListHeight - this.msgListBlock.offsetHeight,
            left: 0,
            behavior: "instant",
        });
        this.prevMsgListHeight = this.msgListBlock?.offsetHeight;
    }

    scrollDown (behaviorArg) {
        const behaviorValue = behaviorArg ? behaviorArg : "auto";
        if (typeof behaviorValue !== "string")  throw TypeError(
            "\"behaviorArg\" arg of Dialog.scrollDown() must be string.");
        if (
            behaviorValue !== "instant" &&
            behaviorValue !== "smooth" &&
            behaviorValue !== "auto")
        {
            throw SyntaxError(
                "\"behaviorArg\" arg of Dialog.scrollDown() has incorrect value.");
        }
        
        this.msgListBlock?.scrollTo({
            top: this.msgListBlock.scrollHeight,
            behavior: behaviorValue,
        });
    }
}