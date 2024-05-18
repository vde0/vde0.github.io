import React from 'react';
import BottomMenu from '../BottomMenu/BottomMenu';
import './AppFooter.css';
import ClassLine from '../../utils/ClassLine';


export default class AppFooter extends React.Component {

    classLine = new ClassLine("app__footer");
    get hook () { return this.props.hook };

    constructor (props) {
        super(props);

        this.hook?.connect( this.hookFunc.bind(this) );

        if ( this.props.hidden ) this.makeHidden();
        ClassLine.initState(this);
    }

    render () {
        return (
            <footer className={this.state.classLine}>
                <BottomMenu data={this.props.data}/>
            </footer>
        );
    }

    hookFunc (isHidden) {
        if ( isHidden )     this.makeHidden();
        else                this.makeVisible();

        ClassLine.updateState(this);
    }

    makeHidden () {
        this.classLine.add("app__footer_hidden");
    }
    makeVisible () {
        this.classLine.remove("app__footer_hidden");
    }
}