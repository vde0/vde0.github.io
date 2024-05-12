import React from 'react';
import './MsgForm.css';
import Btn from '../Btn/Btn';
import { appParams } from '../../utils/utils';
import sendBtnIc from '../../icons/to-send.svg';
import ClassLine from '../../utils/ClassLine';


export default class MsgForm extends React.Component {

    classLine   = new ClassLine("msg-form");

    constructor (props) {
        super(props);

        this.onSend     = this.props.onSend;
        this.onInput    = this.props.onInput;

        if (this.props.className) {
            this.classLine.load(this.props.className);
        }

        if (appParams.isIOS)    this.classLine.add("msg-form_ios");
        if (appParams.isMobile) this.classLine.add("msg-form_mobile");

        this.state = {
            classLine: this.classLine.getLine(),
        };
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
                    onClick={this.onSend}
                    className="msg-form__send-btn"
                    content={<img src={sendBtnIc}/>} />
            </form>
        );
    }
}