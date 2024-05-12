import React from 'react';
import './Video.css';
import ClassLine from '../../utils/ClassLine';


export default class Video extends React.Component {

    classLine   = new ClassLine("video");

    constructor (props) {
        super(props);

        if (this.props.className) {
            this.classLine.load(this.props.className);
        }

        this.state = {
            classLine: this.classLine.getLine(),
        };
    }

    render () {
        return (
            <article className={this.state.classLine}>
            </article>
        );
    }
}