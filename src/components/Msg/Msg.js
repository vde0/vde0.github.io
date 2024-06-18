import React from 'react';
import './Msg.css';
import ClassLine from '../../utils/ClassLine';
import SessionManager from '../../services/SessionManager';


export default class Msg extends React.Component {

    msg = this.props.msg;

    constructor (props) {
        super(props);

        this.classLine = new ClassLine("msg");
        if (this.msg.author === SessionManager.COMPANION) this.classLine.add("msg_user_companion");
        else if (this.msg.author === SessionManager.USER) {
            this.classLine.add("msg_user_current"); }
        else    throw Error("Invalid msg.");
    }

    render () {
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
}
