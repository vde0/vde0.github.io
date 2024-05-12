import React from 'react';
import { appParams, telegram } from '../../utils/utils';
import TaskManager from '../../utils/TaskManager';
import './Container.css';
import ClassLine from '../../utils/ClassLine';
import StickyPiston from '../../utils/StickyPiston';


export default class AppContainer extends React.Component {

    classLine   = new ClassLine("container");
    contentType = "";
    get hook () { return this.props.hook };

    constructor (props) {
        super(props);

        this.hook?.connect(this.updateFunc, this);
        this.piston = new StickyPiston();
        
        if (!this.props.contentType || this.props.empty) {
            this.classLine.add("container_empty");
        } else  this.contentType  = (
            <this.props.contentType data={this.props.data} piston={this.piston} className="container__content" />
        );

        this.state = {
            empty: this.props.empty,
            contentType: this.contentType,
            rendered: false,
        };
        ClassLine.initPassedClassLine(this);

        window.addEventListener("initapp", evt => {
            
            TaskManager.setMacrotask(_ => {

                this.classLine.add("container_fixing-height");
                this.startHeight    = Number(
                    getComputedStyle(this.containerSection).height.slice(0, -2) );

                this.computedTop = this.containerSection.offsetTop;
                
                ClassLine.updateState(this);
                this.setState({ rendered: true });
            }, 1);
        }, {once: true});
    }

    componentDidMount () {
        this.piston.movable = this.containerSection;
    }

    componentWillUnmount () {
        this.piston.movable = null;
    }

    render () {
        return(
            <section
                ref={el => this.containerSection = el}
                className={this.state.classLine}
                style={this.state.rendered ? {
                    top: this.computedTop,
                    height: this.startHeight,
                } : {}}
            >
                {this.state.contentType}
            </section>
        );
    }

    updateFunc () {
        
        if (!this.props.contentType || this.props.empty) {
            this.classLine.add("container_empty");
            this.contentType    = "";
        } else {
            this.classLine.remove("container_empty");
            this.contentType    = (
                <this.props.contentType data={this.props.data} piston={this.piston}
                    className="container__content" />
            );
        }
        
        if          (this.props.dynamic && !this.props.empty) {
            this.classLine.add("container_dynamic");
            this.piston.movable = this.containerSection;
        } else if   (this.props.dynamic && this.props.empty) {
            this.classLine.remove("container_dynamic");
            this.piston.movable = null;
            this.containerSection.style.setProperty("height", this.startHeight + "px");
        } else if   (!this.props.dynamic) {
            this.classLine.remove("container_dynamic");
            this.piston.movable = null;
            this.containerSection.style.setProperty("height", this.startHeight + "px");
        }
        

        this.setState({
            empty: this.props.empty,
            classLine: this.classLine.getLine(),
            contentType: this.contentType,
        });
    }
}