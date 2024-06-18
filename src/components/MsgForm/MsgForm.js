import React from 'react';
import './MsgForm.css';
import Btn from '../Btn/Btn';
import { isMobile } from '../../utils/utils';
import * as tg from '../../utils/tg/utils';
import MKBController from '../../utils/tg/MKBController';
import SendIc from '../../icons/to-send.svg';
import ClassLine from '../../utils/ClassLine';
import TaskManager from '../../utils/TaskManager';
import ClassLineActions from '../../utils/react/ClassLineActions';
import SessionManager from '../../services/SessionManager';
import GuiManager from '../../services/GuiManager';


export default class MsgForm extends React.Component {

    classLine   = new ClassLine("msg-form");
    get send () { return this.props.onSend; }

    constructor (props) {
        super(props);

        this.classLineActions = new ClassLineActions({context: this});
        this.classLineActions.initState();

        if (isMobile) {
            window.addEventListener("openkeyboard", this.openKeyboardHandler);
            window.addEventListener("closekeyboard", this.closeKeyboardHandler);
        }
    }

    componentWillUnmount () {
        if (isMobile) {

            this.blur();

            TaskManager.setMacrotask(_ => {
                window.removeEventListener("openkeyboard", this.openKeyboardHandler);
                window.removeEventListener("closekeyboard", this.closeKeyboardHandler);
            }, 2);
        }
    }

    render () {
        return (
            <form
                ref={el => this.msgFormBlock = el}
                className={this.state.classLine}>
                
                <textarea ref={el => this.msgFieldBlock = el}
                    id={this.props.id}
                    className="msg-form__field msg-form__field_focused"
                    onInput={this.props.onInput}
                    krot="krots"
                    autoFocus={this.props.autoFocus}
                    autoCapitalize="on"
                    autoComplete="false"
                    spellCheck="true"
                    wrap="soft"
                ></textarea>
                <label className="msg-from__label" htmlFor={this.props.id}>
                <Btn
                    type="submit"
                    onClick={this.onSend.bind(this)}
                    className="msg-form__send-btn"
                    content={<SendIc />} />
                </label>
            </form>
        );
    }

    onSend (evt) {
        evt.preventDefault();
        
        this.reset();
        this.send(evt);
    }

    reset () {
        this.msgFormBlock.reset();
        queueMicrotask( _ => {
            this.msgFieldBlock.dispatchEvent( new Event("input", {bubbles: true}) );
        } );
    }


    updateFocus (mod) {
        ( mod ? this.focus() : this.blur() );
    }

    focus () {
        this.msgFieldBlock.focus();
    }
    blur () {
        this.msgFieldBlock.blur();
    }


    openKeyboardHandler = (evt) => {
        this.classLineActions.updateState();
    }
    closeKeyboardHandler = (evt) => {
        console.log("close by msgform");
        this.classLineActions.updateState();
    }
}