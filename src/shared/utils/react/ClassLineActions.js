import ClassLine from "../ClassLine";

export default class ClassLineActions {

    constructor ({
        context,
        makeClassLine = true,
        stateName = "classLine",
        propName = null,
        propContext = null,
    } = {}) {

        this.general = context;

        if (propName === null)      propName = stateName;
        if (propContext === null)   propContext = context;
        if (makeClassLine) {
            if ( !propContext[propName] ) propContext[propName] = new ClassLine();
            if ( !(propContext[propName] instanceof ClassLine) ) throw TypeError(
                "ClassLine has incorrect type.");
            
            if (context.props.className) propContext[propName].load(context.props.className);

            if (context.componentDidUpdate) {
                const bindedUpdater = context.componentDidUpdate.bind(context);
                context.componentDidUpdate = (prevProps, prevState) => {
                    if (prevProps.className !== context.props.className) {
                        (prevProps.className
                            && context.classLine.substract(prevProps.className));
                        (context.props.className
                            && context.classLine.load(context.props.className));
                        
                        this.updateState(stateName, propName);
                    }
                    bindedUpdater(prevProps, prevState);
                }
            }
            else context.componentDidUpdate = (prevProps, prevState) => {
                if (prevProps.className !== context.props.className) {
                    (prevProps.className
                        && context.classLine.substract(prevProps.className));
                    (context.props.className
                        && context.classLine.load(context.props.className));
                    
                    this.updateState(stateName, propName);
                }
            }
        }
    }

    initState (stateName="classLine", propName = null, propContext = this.general) {
        if (!propName) propName = stateName;
        if (!this.general.state) this.general.state = {};
        this.general.state[stateName] = propContext[propName].getLine();
    }

    updateState (stateName="classLine", propName = null, propContext = this.general) {
        if (!propName) propName = stateName;
        this.general.setState({ [stateName]: propContext[propName].getLine() });
    }
}