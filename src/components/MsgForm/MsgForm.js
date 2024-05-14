import React from 'react';
import './MsgForm.css';
import Btn from '../Btn/Btn';
import { appParams, telegram } from '../../utils/utils';
import sendBtnIc from '../../icons/to-send.svg';
import ClassLine from '../../utils/ClassLine';


let funcBridge = () => {};
if (appParams.isMobile) telegram.onEvent("viewportChanged", tg => {
    funcBridge();
});

export default class MsgForm extends React.Component {

    classLine   = new ClassLine("msg-form");

    constructor (props) {
        super(props);

        this.onSend     = this.props.onSend;
        this.onInput    = this.props.onInput;

        this.piston     = this.props.piston;

        ClassLine.initPassedClassLine(this);
    }

    componentDidMount () {
        if (appParams.isMobile) {
            this.openKeyboardHandler    = this.openKeyboardHandler.bind(this);
            this.closeKeyboardHandler   = this.closeKeyboardHandler.bind(this);
            window.addEventListener("openkeyboard", this.openKeyboardHandler);
            window.addEventListener("closekeyboard", this.closeKeyboardHandler);
        }
    }

    componentWillUnmount () {
        if (appParams.isMobile) {
            this.piston.piston = null;
            funcBridge = () => {};

            window.removeEventListener("openkeyboard", this.openKeyboardHandler);
            window.removeEventListener("closekeyboard", this.closeKeyboardHandler);
        }
    }

    componentDidUpdate (prevProps) {
        if (prevProps.focusFieldUpdater !== this.props.focusFieldUpdater) this.focus();
    }

    render () {
        return (
            <form
                ref={el => this.msgFormBlock = el}
                className={this.state.classLine}>
                
                <input ref={el => this.msgFieldBlock = el}
                    type="text"
                    autoFocus
                    className="msg-form__field msg-form__field_focused"
                    onInput={this.onInput}/>
                <Btn
                    type="submit"
                    onClick={this.onClick.bind(this)}
                    className="msg-form__send-btn"
                    content={<img src={sendBtnIc}/>} />
            </form>
        );
    }

    onClick (evt) {
        this.reset();
        this.onSend(evt);
    }

    reset() {
        this.msgFormBlock.reset();
        queueMicrotask( _ => {
            this.msgFieldBlock.dispatchEvent( new Event("input", {bubbles: true}) );
        } );
    }

    focus () {
        this.msgFieldBlock.focus();
    }
    blur () {
        this.msgFieldBlock.blur();
    }


    openKeyboardHandler (evt) {
        this.piston.piston = this.msgFormBlock;
        this.piston.press();
        //
        funcBridge = () => {
            this.piston.press();
        };

        if (appParams.isMobile) this.classLine.add("msg-form_mobile");
        if (appParams.isIOS)    this.classLine.add("msg-form_ios");
        ClassLine.updateState(this);
    }
    closeKeyboardHandler (evt) {
        this.piston.piston = null;
        funcBridge = () => {};
        this.blur();

        if (appParams.isMobile) this.classLine.remove("msg-form_mobile");
        if (appParams.isIOS)    this.classLine.remove("msg-form_ios");
        ClassLine.updateState(this);
    }
}