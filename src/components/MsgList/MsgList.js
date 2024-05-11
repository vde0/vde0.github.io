import React from "react";
import './MsgList.css';
import { getClassLine } from "../../utils/utils";
import Msg from "../Msg/Msg";


export default class MsgList extends React.Component {

    classLine   = getClassLine("msg-list");

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