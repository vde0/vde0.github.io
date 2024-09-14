import React from 'react';
import './Msg.css';
import SessionManager from '../../shared/services/SessionManager';


export default function Msg (props: {msg: {}}): JSX.Element {

    let msg = props.msg;

    // this.classLine = new ClassLine("msg");
    if (this.msg.author === SessionManager.COMPANION) this.classLine.add("msg_user_companion");
    else if (this.msg.author === SessionManager.USER) {
        this.classLine.add("msg_user_current"); }
    else    throw Error("Invalid msg.");

    return (
        <section className={this.classLine}>
            <header className="msg__header">
                {/* <span className="msg__time">{msg.time}</span> */}
                <span className="msg__name">
                    {this.msg.name}:
                </span>
            </header>
            <section className="msg__content">
                <p className='msg__text'>{this.msg.textContent}</p>
            </section>
        </section>
    );
}
