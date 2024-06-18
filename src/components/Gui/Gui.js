import React from "react"
import MsgForm from "../MsgForm/MsgForm";
import BottomMenu from "../BottomMenu/BottomMenu";
import { isMobile } from "../../utils/utils";
import TaskManager from "../../utils/TaskManager";
import GuiManager from "../../services/GuiManager";

import './Gui.css';
import ClassLine from "../../utils/ClassLine";
import ClassLineActions from "../../utils/react/ClassLineActions";


export default class Gui extends React.Component {

    msgFormClassLine    = new ClassLine("gui__el msg-form_gui");
    bottomMenuClassLine = new ClassLine("gui__el");

    constructor (props) {
        super(props);
        GuiManager.initGuiComponent(this);

        this.classLineActions   = new ClassLineActions({context: this, makeClassLine: false});

        this.state = {
            msgFormShown: false,
        };

        this.classLineActions.initState("msgFormClassLine");
        this.classLineActions.initState("bottomMenuClassLine");
    }

    componentDidMount () {

        if (isMobile) {
            window.addEventListener("openkeyboard", this.openKeyboardHandler);
            window.addEventListener("closekeyboard", this.closeKeyboardHandler);
        }
    }
    componentWillUnmount () {
        if (isMobile)   TaskManager.setMacrotask(_ => {
            window.removeEventListener("openkeyboard", this.openKeyboardHandler);
            window.removeEventListener("closekeyboard", this.closeKeyboardHandler);
        }, 2);
    }

    render () {
        return <div className="gui">
            {this.state.msgFormShown
                ? <MsgForm autoFocus={true} className={this.state.msgFormClassLine} onSend={this.state.sender} onInput={this.onInput.bind(this)} />
                : ""}
            <BottomMenu className={this.state.bottomMenuClassLine} />
        </div>;
    }

    onInput (evt) {
        this.msgText = evt.target.value;
        GuiManager.updateMsgContent(this.msgText);
    }

    openKeyboardHandler = (evt) => {
        // this.msgFormClassLine.remove("gui__el_hidden");
        this.bottomMenuClassLine.add("gui__el_hidden");
        this.classLineActions.updateState("bottomMenuClassLine");

        // this.classLineActions.updateState("msgFormClassLine");
        this.setState({msgFormShown: true});
    }
    closeKeyboardHandler = (evt) => {
        // this.msgFormClassLine.add("gui__el_hidden");
        this.bottomMenuClassLine.remove("gui__el_hidden");
        this.classLineActions.updateState("bottomMenuClassLine");

        // this.classLineActions.updateState("msgFormClassLine");
        this.setState({msgFormShown: false});
    }
}