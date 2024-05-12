import React from 'react';
import BottomMenu from '../BottomMenu/BottomMenu';
import './AppFooter.css';
import ClassLine from '../../utils/ClassLine';


export default class AppFooter extends React.Component {

    classLine = new ClassLine("app__footer");

    constructor () {
        if (this.props.hidden) {
            this.classLine.add("app__footer_hidden");
        }
    }

    render () {
        return (
            <footer className={this.classLine.getLine()}>
                <BottomMenu data={this.props.data}/>
            </footer>
        );
    }

}