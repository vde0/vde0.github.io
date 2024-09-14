import React from 'react';
import './Video.css';


export default function Video (props: {empty: boolean}): JSX.Element {

    // classLine   = new ClassLine("video");

    if (this.props.className) {
        this.classLine.load(this.props.className);
    }

    // let state = {
    //     classLine: this.classLine.getLine(),
    // };

    return (
        <article className={this.state.classLine}>
        </article>
    );
}