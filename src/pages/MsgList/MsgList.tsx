import React from "react";
import './MsgList.css';
import Msg from "../Msg/Msg";


export default function MsgList (props: {
    className: string,
    scrollDown: number|null,
    scrollDownUpdater: boolean,
    msgList: any[]}): JSX.Element  {
    
    
    this.resizeMsgListHandler   = this.resizeMsgListHandler.bind(this);

    return (
        <ul className={this.state.classLine} ref={el => this.msgListBlock = el}>
        {this.props.msgList.map( (msg: {}, msg_num: number) => {
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

    // scrollDown (behaviorArg) {
    //     if (behaviorArg === null) return;

    //     const behaviorValue = behaviorArg ? behaviorArg : "auto";
    //     if (typeof behaviorValue !== "string")  throw TypeError(
    //         "\"behaviorArg\" arg of MsgList.scrollDown() must be string.");
    //     if (
    //         behaviorValue !== "instant" &&
    //         behaviorValue !== "smooth" &&
    //         behaviorValue !== "auto")
    //     {
    //         throw SyntaxError(
    //             "\"behaviorArg\" arg of MsgList.scrollDown() has invalid value.");
    //     }
        
    //     this.msgListBlock?.scrollTo({
    //         top: this.msgListBlock.scrollHeight,
    //         behavior: behaviorValue,
    //     });
    // }

    // resizeMsgListHandler () {
    //     this.msgListBlock?.scrollBy({
    //         top: this.prevMsgListHeight - this.msgListBlock.offsetHeight,
    //         left: 0,
    //         behavior: "instant",
    //     });
    //     this.prevMsgListHeight = this.msgListBlock?.offsetHeight;
    // }
}