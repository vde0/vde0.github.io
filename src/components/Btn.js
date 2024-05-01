import React from 'react';

export default class Btn extends React.Component {
    render () {
        return(
            <button
                type={this.props.type ? this.props.type : "button"}
                onClick={this.props.onClick}
                className={
                    "btn " +
                    (this.props.color ? "btn_color_" + this.props.color : "") + " " +
                    (this.props.className ? this.props.className : "")}
            >
                <div className="btn__content">
                    {this.props.content}
                </div>
                
                {this.props.badge ? (
                    <div className={"btn__badge btn__badge_color_" + this.props.badge["color"]}>
                        <span>{this.props.badge["value"]}</span>
                    </div>
                ) : ""}
            </button>
        );
    }
}