import React from 'react';
import sendBtnIc from '../icons/to-send.svg';
import Btn from './Btn';


let userDB = {
    /// userID: {...}
    555: {
        name: "Mark",
    },
    201: {
        name: "Собеседник",
    },
}

function getUserInfo (userID) {
    return {...userDB[userID]};
}

export default class Dialog extends React.Component {
    
    userID      = this.props.data.userID;
    hideMenu    = this.props.data.hideMenuFunc;
    msgText     = "";
    msgList     = [
        {
            userID: 555,
            time: "15:06",
            textContent: "Как дела?",
        },
        {
            userID: 201,
            time: "15:00",
            textContent: "Норм. Уйди.",
        },
        {
            userID: 555,
            time: "15:06",
            textContent: "Блин :( Ну вот. Ну блин :(",
        },
        {
            userID: 555,
            time: "15:06",
            textContent: "Блин блинский :(",
        },
        {
            userID: 201,
            time: "15:00",
            textContent: "Хыыыы!",
        },
    ]

    constructor (props) {
        super(props);

        this.onSend         = this.onSend.bind(this);
        this.onInput        = this.onInput.bind(this);
        this.onClickDialog  = this.onClickDialog.bind(this);

        this.state = {
            msgList: this.msgList,
        }
    }

    render () {
        return(
            <article className="dialog" onClick={this.onClickDialog}>
                <ul className="dialog__msg-list">
                    {this.state.msgList.map( (msg, msg_num) => {
                        return (
                            <li
                                key={msg_num}
                                className="dialog__msg-item"
                            ><section className={"msg " + (
                                msg.userID === this.userID
                                ? "msg_user_current"
                                : "msg_user_companion")}>
                                <header className="msg__header">
                                    {/* <span className="msg__time">{msg.time}</span> */}
                                    <span className="msg__name">
                                        {
                                            msg.userID === this.userID
                                            ? "Вы"
                                            : getUserInfo(this.userID)["name"]
                                        }:
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

        this.msgList.push(msgBlock);
        this.setState({msgList: this.msgList});

        this.resetForm();
    }
    onInput (evt) {
        this.msgText = evt.target.value;
    }
    onFocusField (evt) {
        this.hideMenu();
    }
    onClickDialog (evt) {
        this.msgField.focus();
    }

    resetForm () {
        this.msgForm.reset();
        this.msgText = "";
    }

}