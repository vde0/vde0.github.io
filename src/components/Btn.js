import React from 'react';

export default class Btn extends React.Component {
    render () {
        return(
            <button onClick={this.props.onClick} className={"app__btn app__btn_mod_" + this.props.mod + " btn" + (this.props.color ? " btn_color_" + this.props.color : "")}>
                {this.props.content}
                {this.props.badge ? (
                    <div className={"btn__badge btn__badge_color_" + this.props.badge["color"]}>
                        <span>{this.props.badge["value"]}</span>
                    </div>
                ) : ""}
            </button>
        );
    }
}