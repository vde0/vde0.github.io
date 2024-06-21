import React from "react";
import ClassLine from "../../utils/ClassLine";
import './Unit.css';


const defaults = {
    v: "middle",
    h: "middle",
    color: "blue",
    size: "normal",
};

export default class Unit extends React.Component {

    classLine = new ClassLine("unit");

    constructor (props) {
        super(props);

        const vAlignment    = this.props.verticalAlignment;
        const hAlignment    = this.props.horizontalAlignment;
        const size          = this.props.size;
        const color         = this.props.color;
        const mode           = this.props.mode;

        (vAlignment && this.classLine.add("unit_v_" + vAlignment));
        (hAlignment && this.classLine.add("unit_h_" + hAlignment));
        (size && this.classLine.add("unit_size_" + size));
        (color && this.classLine.add("unit_color_" + color));
        (mode && this.classLine.add("unit_mode_" + mode));

        (vAlignment || this.classLine.add("unit_v_" + defaults.v));
        (hAlignment || this.classLine.add("unit_h_" + defaults.h));
        (size || this.classLine.add("unit_size_" + defaults.size));
        (color || this.classLine.add("unit_color_" + defaults.color));
    }

    render () {
        return <div className={this.classLine}></div>;
    }
}