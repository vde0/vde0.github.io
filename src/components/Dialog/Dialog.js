import React from 'react';
import { isMobile } from '../../utils/utils';
// import StickyPiston from '../../utils/StickyPiston';
import * as tg from '../../utils/tg/utils';
import './Dialog.css';
import MsgList from '../MsgList/MsgList';
import ClassLine from '../../utils/ClassLine';
import TaskManager from '../../utils/TaskManager';
import UpdateHook from '../../utils/UpdateHook';
import ClassLineActions from '../../utils/react/ClassLineActions';
import MKBController from '../../utils/tg/MKBController';
import SessionManager from '../../services/SessionManager';
import GuiManager from '../../services/GuiManager';
import Gui from '../Gui/Gui';


export default class Dialog extends React.Component {

    msgList     = SessionManager.getMsgList();
    classLine   = new ClassLine("dialog");

    constructor (props) {
        super(props);

        this.classLineActions   = new ClassLineActions({context: this});

        this.onClickDialog  = this.onClickDialog.bind(this);
        this.focusHook      = new UpdateHook();

        this.state = {
            msgList: this.msgList,
            focusField: true,
            msgFormShown: true,
            scrollDown: null,
            scrollDownUpdater: true,
        }
        this.classLineActions.initState();

        window.addEventListener("openkeyboard", this.openKeyboardHandler);
        window.addEventListener("closekeyboard", this.closeKeyboardHandler);

        SessionManager.subscribe(SessionManager.MSG_RECEIVED, this.onReceiveMsg.bind(this));
        GuiManager.linkMsgForm(this.onSend);
    }

    componentDidMount () {
        
        this.scrollDown("instant");
        this.focusHook.on(true);

        if (isMobile) MKBController.open();

        // this.props.data.blur    = this.blurMsgField.bind(this);
        // this.props.data.focus   = this.focusMsgField.bind(this);

        tg.onResize(this.resizeHandler);
    }

    componentWillUnmount () {
        // this.props.data.blur = () => {};
        tg.offResize(this.resizeHandler);
        if (isMobile) TaskManager.setMacrotask(_ => {
            window.removeEventListener("openkeyboard", this.openKeyboardHandler);
            window.removeEventListener("closekeyboard", this.closeKeyboardHandler);
        }, 2);
    }

    render () {
        return(
            <article
                className={this.state.classLine}
                ref={el => this.dom = el}
                onClick={this.onClickDialog}>
                
                <MsgList
                    className="dialog__msg-list"
                    scrollDown={this.state.scrollDown}
                    scrollDownUpdater={this.state.scrollDownUpdater}
                    msgList={this.state.msgList} />
            </article>
        );
    }


    onSend = (evt) => {
        const msgText = GuiManager.getMsgContent();
        if (!msgText) return;
        SessionManager.sendMsg(msgText);

        TaskManager.setMacrotask( _ => this.scrollDown("smooth"), 1 );
    }
    onClickDialog (evt) {
        this.blurMsgField();
        this.focusMsgField();
    }

    focusMsgField () {
        this.focusHook.on(true);
    }
    blurMsgField () {
        this.focusHook.on(false);
    }

    scrollDown(behaviorArg="instant") {
        if (behaviorArg !== "instant" && behaviorArg !== "smooth" && behaviorArg !== "auto") {
            throw SyntaxError(
                "Dialog.scrollDown() take the \"instant\", \"smooth\" and \"auto\" arg values only.");
        }

        this.setState({
            scrollDown: behaviorArg,
            scrollDownUpdater: !this.state.scrollDownUpdater,
        });
    }


    openKeyboardHandler = (evt) => {
        this.setState({msgFormShown: false});
    }
    closeKeyboardHandler = (evt) => {
        this.setState({msgFormShown: true});
        this.dom?.style.setProperty("height", "100%");
    }

    resizeHandler = (evt) => {
        this.dom?.style.setProperty("height", (this.dom.clientHeight + evt.step) + "px");
    }

    onReceiveMsg (evt) {
        this.msgList.push( SessionManager.getMsg(evt.msgId) );
        this.setState({msgList: this.msgList});
    }
}