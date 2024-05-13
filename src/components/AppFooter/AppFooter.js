import React from 'react';
import BottomMenu from '../BottomMenu/BottomMenu';
import './AppFooter.css';
import ClassLine from '../../utils/ClassLine';


export default class AppFooter extends React.Component {

    classLine = new ClassLine("app__footer");

    constructor (props) {
        super(props);

        if (this.props.hidden) {
            this.classLine.add("app__footer_hidden");
        }

        ClassLine.initState(this);
        
    }

    getSnapshotBeforeUpdate () {
        this.handleHidden();
    }

    render () {
        return (
            <footer className={this.state.classLine}>
                <BottomMenu data={this.props.data}/>
            </footer>
        );
    }

    hiddenHandlerOn = true;
    handleHidden () {
        if (this.props.hidden) {
            this.classLine.add("app__footer_hidden");
        } else {
            this.classLine.remove("app__footer_hidden");
        }

        if (this.hiddenHandlerOn)   {ClassLine.updateState(this); this.hiddenHandlerOn = false}
        else                        this.hiddenHandlerOn = true;
    }
}