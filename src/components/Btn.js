import React from 'react';
import { getClassLine } from '../utils/utils';

export default class Btn extends React.Component {

    constructor (props) {
        super(props);

        this.btnClassLine           = getClassLine("btn");
        if (this.props.color)       this.btnClassLine.add("btn_color_" + this.props.color);
        if (this.props.className)   this.btnClassLine.load(this.props.className);

        this.hasBadge       = false;
        this.badgeClassLine = "";
        this.badgeContent   = null;
        if (this.props.badge) {

            if (!this.props.badge["value"]) throw SyntaxError("Value of the badge isn't defined");
            this.badgeContent   = this.props.badge["value"];
            this.hasBadge       = true;

            this.badgeClassLine = getClassLine("btn__badge");
            if (this.props.badge["color"]) {
                this.badgeClassLine.add("btn__badge_color_" + this.props.badge["color"]);
            }
        }
    }

    render () {
        return(
            <button
                type={this.props.type ? this.props.type : "button"}
                onClick={this.props.onClick}
                className={this.btnClassLine}
            >
                <div className="btn__content">
                    {this.props.content}
                </div>
                
                {this.hasBadge ? (
                    <div className={this.badgeClassLine}>
                        <span>{this.badgeContent}</span>
                    </div>
                ) : ""}
            </button>
        );
    }
}