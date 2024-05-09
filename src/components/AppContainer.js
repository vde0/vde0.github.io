import React from 'react';
import { getClassLine, appParams, telegram } from '../utils/utils';
import TaskManager from '../utils/TaskManager';


export default class AppContainer extends React.Component {

    classLine   = getClassLine("app__container");
    contentType = "";
    get hook () { return this.props.hook };

    constructor (props) {
        super(props);

        this.hook?.connect(this.updateFunc, this);

        this.resizeHandler  = this.resizeHandler.bind(this);
        
        if (!this.props.contentType || this.props.empty) {
            this.classLine.add("app__container_empty");
        } else  this.contentType  = <this.props.contentType data={this.props.data} />;

        this.state = {
            empty: this.props.empty,
            classLine: this.classLine.getLine(),
            contentType: this.contentType,
            rendered: false,
        };

        window.addEventListener("initapp", evt => {
            
            TaskManager.setMacrotask(_ => {
                
                this.startHeight    = Number(
                    getComputedStyle(this.containerSection).height.slice(0, -2) );
    
                this.setState({
                    classLine: this.classLine.add("app__container_fixing-height").getLine(),
                    computedHeight: this.startHeight,
                    computedTop: this.containerSection.offsetTop,
                    rendered: true,
                });
    
                telegram.onEvent("viewportChanged", this.resizeHandler);
            }, 1);
        }, {once: true});
    }

    render () {
        return(
            <section
                ref={el => this.containerSection = el}
                className={this.state.classLine}
                style={this.state.rendered ? {
                    top: this.state.computedTop,
                    height: this.state.computedHeight,
                } : {}}
            >
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
        
        // if          (this.props.dynamic && !this.props.empty) {
        //     this.classLine.add("app__container_dynamic");
        // } else if   (this.props.dynamic && this.props.empty) {
        //     this.classLine.remove("app__container_dynamic");
        // }

        this.setState({
            empty: this.props.empty,
            classLine: this.classLine.getLine(),
            contentType: this.contentType,
        });
    }

    resizeHandler (evt) {
        if (!this.props.dynamic || this.props.empty) {
            this.setState({ computedHeight: this.startHeight });
            return;
        }

        this.setState({
            computedHeight: this.startHeight - appParams.startHeight + telegram.viewportStableHeight,
        });
    }
}