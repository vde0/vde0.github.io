import React from 'react';
import { getClassLine } from '../utils';

export default class AppContainer extends React.Component {

    classLine   = getClassLine("app__container");
    contentType = "";
    get hook () { return this.props.hook };

    constructor (props) {
        super(props);
        
        if (this.hook) {
            this.updateFunc     = this.updateFunc.bind(this);
            this.hook.setUpdateFunc(this.updateFunc);
        }
        
        if (!this.props.contentType || this.props.empty) {
            this.classLine.add("app__container_empty");
        } else  this.contentType  = <this.props.contentType data={this.props.data} />;
        //
        if (this.props.shrink) this.classLine.add("app__container_shrink");

        this.state = {
            empty: this.props.empty,
            classLine: this.classLine.getLine(),
            contentType: this.contentType,
        };
    }

    componentDidUpdate () {
        this.hook?.update();
    }

    render () {
        return(
            <section className={this.state.classLine}>
                {this.state.contentType}
            </section>
        );
    }

    updateFunc () {
        
        if (!this.props.contentType || this.props.empty) {
            this.classLine.add("app__container_empty");
            this.contentType    = "";
        } else {
            this.classLine.remove("app__container_empty");
            this.contentType    = <this.props.contentType data={this.props.data} />;
        }

        this.setState({
            empty: this.props.empty,
            classLine: this.classLine.getLine(),
            contentType: this.contentType,
        });
    }
}