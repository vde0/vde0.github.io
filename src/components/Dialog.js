import React from 'react';

export default class Dialog extends React.Component {

    userID  = this.props.data.userID;
    msgList = this.props.data.msgList;

    render () {
        return(
            <article className="dialog">
                <ul className="dialog__msg-list">
                    {this.msgList.map( (msg, msg_num) => {
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
                                        {msg.userID === this.userID ? "Вы" : msg.userName}:
                                    </span>
                                </header>
                                <section className="msg__content">
                                    <p className='msg__text'>{msg.textContent}</p>
                                </section>
                            </section></li>
                        );
                    } )}
                </ul>
            </article>
        );
    }
}