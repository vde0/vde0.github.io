import React from 'react';
import './MsgForm.css';
import Btn from '../Btn/Btn';
import { appParams, telegram } from '../../utils/utils';
import SendIc from '../../icons/to-send.svg';
import ClassLine from '../../utils/ClassLine';
import TaskManager from '../../utils/TaskManager';
import ClassLineActions from '../../componentUtils/ClassLineActions';


let funcBridge = () => {};
if (appParams.isMobile) telegram.onEvent("viewportChanged", tg => {
    funcBridge();
});

export default class MsgForm extends React.Component {

    classLine   = new ClassLine("msg-form");

    constructor (props) {
        super(props);

        this.classLineActions = new ClassLineActions({context: this});

        this.onSend     = this.props.onSend;
        this.onInput    = this.props.onInput;

        this.piston     = this.props.piston;

        this.classLineActions.initState();
    }

    componentDidMount () {

        this.props.focusHook.connect( this.updateFocus.bind(this) );

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
        if (prevProps.focusFieldUpdater !== this.props.focusFieldUpdater) {
            this.props.focusField ? this.focus() : this.blur();
        }
    }

    render () {
        return (
            <form
                ref={el => this.msgFormBlock = el}
                className={this.state.classLine}>
                
                <textarea ref={el => this.msgFieldBlock = el}
                    className="msg-form__field msg-form__field_focused"
                    onInput={this.onInput}
                    autoFocus
                    autocapitalize
                    autocomplete="false"
                    spellcheck="true"
                    wrap="sort"
                ></textarea>
                <Btn
                    type="submit"
                    onClick={this.onClick.bind(this)}
                    className="msg-form__send-btn"
                    content={<SendIc />} />
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


    updateFocus (mod) {
        ( mod ? this.focus() : this.blur() );
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
        this.classLineActions.updateState();
    }
    closeKeyboardHandler (evt) {
        this.piston.piston = null;
        funcBridge = () => {};

        if (appParams.isMobile) this.classLine.remove("msg-form_mobile");
        this.classLineActions.updateState();
    }
}