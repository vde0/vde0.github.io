import React from "react";
import './MsgList.css';
import Msg from "../Msg/Msg";
import ClassLine from "../../utils/ClassLine";
import { appParams } from "../../utils/utils";
import ClassLineActions from "../../componentUtils/ClassLineActions";
import TaskManager from "../../utils/TaskManager";


export default class MsgList extends React.Component {

    classLine   = new ClassLine("msg-list");

    constructor (props) {
        super(props);

        this.resizeMsgListHandler   = this.resizeMsgListHandler.bind(this);

        this.classLineActions = new ClassLineActions({context: this});
        this.classLineActions.initState();
    }

    componentDidMount () {

        if (appParams.isMobile) {
            this.resizeMsgListObserver = new ResizeObserver( entries => {
                this.resizeMsgListHandler();
            } );
            this.prevMsgListHeight = this.msgListBlock.offsetHeight;
            this.resizeMsgListObserver.observe(this.msgListBlock);
        }
    }

    componentWillUnmount () {
        if (appParams.isMobile) {
            this.resizeMsgListObserver.disconnect();
        }
    }

    componentDidUpdate (prevProps) {
        if (prevProps.scrollDownUpdater !== this.props.scrollDownUpdater) {
            this.scrollDown(this.props.scrollDown);
        }
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

    scrollDown (behaviorArg) {
        if (behaviorArg === null) return;

        const behaviorValue = behaviorArg ? behaviorArg : "auto";
        if (typeof behaviorValue !== "string")  throw TypeError(
            "\"behaviorArg\" arg of MsgList.scrollDown() must be string.");
        if (
            behaviorValue !== "instant" &&
            behaviorValue !== "smooth" &&
            behaviorValue !== "auto")
        {
            throw SyntaxError(
                "\"behaviorArg\" arg of MsgList.scrollDown() has invalid value.");
        }
        
        this.msgListBlock?.scrollTo({
            top: this.msgListBlock.scrollHeight,
            behavior: behaviorValue,
        });
    }

    resizeMsgListHandler () {
        this.msgListBlock?.scrollBy({
            top: this.prevMsgListHeight - this.msgListBlock.offsetHeight,
            left: 0,
            behavior: "instant",
        });
        this.prevMsgListHeight = this.msgListBlock?.offsetHeight;
    }
}