import React from 'react';
import { getClassLine, isMobile } from '../utils';

export default class AppContainer extends React.Component {

    classLine   = getClassLine("app__container");
    contentType = "";
    get hook () { return this.props.hook };

    constructor (props) {
        super(props);

        this.hook?.connect(this.updateFunc, this);
        
        if (!this.props.contentType || this.props.empty) {
            this.classLine.add("app__container_empty");
        } else  this.contentType  = <this.props.contentType data={this.props.data} />;

        this.state = {
            empty: this.props.empty,
            classLine: this.classLine.getLine(),
            contentType: this.contentType,
        };
    }

    componentDidMount () {
        if (this.props.cut && isMobile) {
            window.addEventListener("openkeyboard", evt => {
                this.setState({classLine: this.classLine.add("app__container_cut").getLine()})
            });
            window.addEventListener("closekeyboard", evt => {
                this.setState({classLine: this.classLine.remove("app__container_cut").getLine()})
            });
        }
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