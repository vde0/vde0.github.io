import React from 'react';
import './MsgForm.css';
import Btn from '../Btn/Btn';
import TaskManager from '../../shared/utils/TaskManager';


export default function MsgForm (props: any): JSX.Element {

    function send () { return this.props.onSend; }

    // if (isIOs) this.classLine.add("msg-form_gui-ios");

    // this.classLineActions = new ClassLineActions({context: this});
    this.classLineActions.initState();

    this.textAreaRef = null;

    // if (isMobile) {
    //     window.addEventListener("openkeyboard", this.openKeyboardHandler);
    //     window.addEventListener("closekeyboard", this.closeKeyboardHandler);
    // }

    // componentDidMount () {
    //     this.focus();
    // }

    // componentWillUnmount () {
    //     if (isMobile) {

    //         this.blur();

    //         TaskManager.setMacrotask(_ => {
    //             window.removeEventListener("openkeyboard", this.openKeyboardHandler);
    //             window.removeEventListener("closekeyboard", this.closeKeyboardHandler);
    //         }, 2);
    //     }
    // }

    return (
        <form
            ref={el => this.msgFormBlock = el}
            className={this.state.classLine}
            data-observed>
            
            <textarea ref={el => this.textAreaRef = el}
                id={this.props.id}
                className="msg-form__field msg-form__field_focused"
                onFocus={this.onFocus}
                onInput={this.props.onInput}
                // krot="krots"
                // autoFocus={this.props.autoFocus}
                autoCapitalize="on"
                autoComplete="false"
                spellCheck="true"
                wrap="soft"
            ></textarea>
            <label className="msg-from__label" htmlFor={this.props.id}>
            {/* <Btn
                type="submit"
                onClick={this.onSend.bind(this)}
                className="msg-form__send-btn"
                content={<SendIc />} /> */}
            </label>
        </form>
    );

    // onSend (evt) {
    //     evt.preventDefault();
        
    //     this.reset();
    //     this.send(evt);
    // }

    // onFocus = (evt) => {
    //     // evt.target
    // }

    // reset () {
    //     this.msgFormBlock.reset();
    //     queueMicrotask( _ => {
    //         this.textAreaRef.dispatchEvent( new Event("input", {bubbles: true}) );
    //     } );
    // }


    // updateFocus (mod) {
    //     ( mod ? this.focus() : this.blur() );
    // }

    // focus () {
    //     this.textAreaRef?.focus({scroll: false});
    // }
    // blur () {
    //     this.textAreaRef?.blur();
    // }


    // openKeyboardHandler = (evt) => {
    //     this.classLineActions.updateState();
    // }
    // closeKeyboardHandler = (evt) => {
    //     console.log("close by msgform");
    //     this.classLineActions.updateState();
    // }
}