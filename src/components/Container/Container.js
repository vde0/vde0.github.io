import React from 'react';
import { appParams, telegram } from '../../utils/utils';
import TaskManager from '../../utils/TaskManager';
import './Container.css';
import ClassLine from '../../utils/ClassLine';
import StickyPiston from '../../utils/StickyPiston';


export default class AppContainer extends React.Component {

    classLine   = new ClassLine("container");
    contentType = "";

    constructor (props) {
        super(props);

        this.props.emptyHook?.connect( this.emptyHookFunc.bind(this) );
        this.props.dynamicHook?.connect( this.dynamicHookFunc.bind(this) );
        this.piston = new StickyPiston();
        
        // Fill this.content
        this.makeEmpty();
        //
        this.state = {
            content: this.content,
        };
        ClassLine.initPassedClassLine(this);


        window.addEventListener("initapp", evt => {
            
            TaskManager.setMacrotask(_ => this.setFixedHeight(), 1);
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
            >
                {this.state.content}
            </section>
        );
    }


    emptyHookFunc (emptyFlag) {
        
        if      ( emptyFlag )       this.makeEmpty();
        else                        this.makeFilled()
        
        this.updateComponent();
    }

    dynamicHookFunc (dynamicFlag) {

        if      ( dynamicFlag )     this.makeDynamic();
        else                        this.makeStatic();
        
        this.updateComponent();
    }


    setFixedHeight () {
        this.startHeight = this.containerSection.clientHeight
        this.computedTop = this.containerSection.offsetTop;
        
        this.classLine.add("container_fixing-height");
        ClassLine.updateState(this);

        queueMicrotask( _ => {
            this.containerSection.style.setProperty("height", this.startHeight + "px");
            this.containerSection.style.setProperty("top", this.computedTop + "px");
        });
    }


    updateComponent () {
        ClassLine.updateState(this);
        this.setState({
            content: this.content,
        });
    }

    makeEmpty () {
        this.classLine.add("container_empty");
        this.content    = "";

        this.makeStatic();
    }
    makeFilled () {
        this.classLine.remove("container_empty");
        this.content    = this.getContent();
    }

    makeDynamic () {
        this.classLine.add("container_dynamic");
        this.piston.movable = this.containerSection;
    }
    makeStatic () {
        this.classLine.remove("container_dynamic");
        this.piston.movable = null;
        this.containerSection?.style.setProperty("height", this.startHeight + "px");
    }

    getContent () {
        return  <this.props.contentType
            data={this.props.data}
            piston={this.piston}
            className="container__content" />
    }
}