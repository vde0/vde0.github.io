import React from "react"
import MsgForm from "../MsgForm/MsgForm";
import GuiManager from "../../shared/services/GuiManager";

import './Gui.css';


export default function Gui (props: any): JSX.Element {

    // msgFormClassLine    = new ClassLine("gui__el msg-form_gui");
    // bottomMenuClassLine = new ClassLine("gui__el");

    GuiManager.initGuiComponent(this);

    // this.classLineActions   = new ClassLineActions({context: this, makeClassLine: false});

    this.state = {
        msgFormShown: false,
    };

    // this.classLineActions.initState("msgFormClassLine");
    // this.classLineActions.initState("bottomMenuClassLine");

    return <div className="gui">
        {this.state.msgFormShown
            ? <><MsgForm autoFocus={true} id={GuiManager.MSG_FORM_ATTR_ID} className={this.state.msgFormClassLine} onSend={this.state.sender} onInput={this.onInput.bind(this)}/><button onClick={this.onCancel.bind(this)} className="gui__cancel">cancel</button>
            </>
            : ""}
        {/* <BottomMenu className={this.state.bottomMenuClassLine} /> */}
    </div>;

    // onInput (evt) {
    //     this.msgText = evt.target.value;
    //     GuiManager.updateMsgContent(this.msgText);
    // }

    // onCancel (evt) {
    //     GuiManager.cancel();
    //     // this.msgFormClassLine.add("gui__el_hidden");
    //     this.bottomMenuClassLine.remove("gui__el_hidden");
    //     this.classLineActions.updateState("bottomMenuClassLine");

    //     // this.classLineActions.updateState("msgFormClassLine");
    //     this.setState({msgFormShown: false});

    // }

    // openKeyboardHandler = (evt) => {
    //     // this.msgFormClassLine.remove("gui__el_hidden");
    //     this.bottomMenuClassLine.add("gui__el_hidden");
    //     this.classLineActions.updateState("bottomMenuClassLine");

    //     // this.classLineActions.updateState("msgFormClassLine");
    //     this.setState({msgFormShown: true});
    // }
    // closeKeyboardHandler = (evt) => {
    //     // this.msgFormClassLine.add("gui__el_hidden");
    //     // this.bottomMenuClassLine.remove("gui__el_hidden");
    //     // this.classLineActions.updateState("bottomMenuClassLine");

    //     // this.classLineActions.updateState("msgFormClassLine");
    //     // this.setState({msgFormShown: false});
    // }
}