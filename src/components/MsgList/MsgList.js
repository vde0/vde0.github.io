import React from "react";
import './MsgList.css';
import Msg from "../Msg/Msg";
import ClassLine from "../../utils/ClassLine";


export default class MsgList extends React.Component {

    classLine   = new ClassLine("msg-list");

    constructor (props) {
        super(props);

        if (this.props.className) {
            this.classLine.load(this.props.className);
        }

        this.state = {
            classLine: this.classLine.getLine(),
        };
    }

    render () {
        return (
            <ul className={this.state.classLine} ref={el => this.msgListBlock = el}>
            {this.props.msgList.map( (msg, msg_num) => {
                return (
                    <li
                        key={msg_num}
                        className="msg-item"
                    >
                        <Msg msg={msg} />
                    </li>
                );
            } )}
            </ul>
        );
    }
}