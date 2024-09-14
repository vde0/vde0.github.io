import React from 'react';
import './Dialog.css';
import MsgList from '../../../pages/MsgList/MsgList';
import UpdateHook from '../../../shared/utils/UpdateHook';
import SessionManager from '../../../shared/services/SessionManager';
import GuiManager from '../../../shared/services/GuiManager';


export default function Dialog (props: {empty?: boolean, data: any}): JSX.Element {

    let msgList     = SessionManager.getMsgList();

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

    return (
        <article
            className={this.state.classLine}
            ref={el => this.dom = el}
            onClick={this.onClickDialog}>
            <label className="dialog__label" htmlFor={GuiManager.MSG_FORM_ATTR_ID}>
            <MsgList
                className="dialog__msg-list"
                scrollDown={this.state.scrollDown}
                scrollDownUpdater={this.state.scrollDownUpdater}
                msgList={this.state.msgList} />
            </label>
        </article>
    );
}