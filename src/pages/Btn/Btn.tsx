import React from 'react';
import './Btn.css';


export default function Btn (props: any): JSX.Element {

    // this.classLineActions = new ClassLineActions({context: this});
    if (this.props.color)       this.classLine.add("btn_color_" + this.props.color);
    

    this.hasBadge       = false;
    this.badgeClassLine = "";
    this.badgeContent   = null;
    if (this.props.badge) {

        if (!this.props.badge["value"]) throw SyntaxError("Value of the badge isn't defined");
        this.badgeContent   = this.props.badge["value"];
        this.hasBadge       = true;

        // this.badgeClassLine = new ClassLine("btn__badge");
        if (this.props.badge["color"]) {
            this.badgeClassLine.add("btn__badge_color_" + this.props.badge["color"]);
        }
    }
    
    return(
        <button
            type={this.props.type ?? "button"}
            onClick={this.props.onClick}
            className={this.classLine}
            tabIndex={-1}
        >
            <div className="btn__content">
                {this.props.content}
            </div>
            
            {!!this.hasBadge && (
                <div className={this.badgeClassLine}>
                    <span>{this.badgeContent}</span>
                </div>
            )}
        </button>
    );
}