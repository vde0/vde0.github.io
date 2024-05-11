import React from 'react';
import './Msg.css';


export default class Msg extends React.Component {

    msg = this.props.msg;

    render () {
        return (
            <section className={this.msg.classLine}>
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
