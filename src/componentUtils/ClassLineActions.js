import ClassLine from "../utils/ClassLine";

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