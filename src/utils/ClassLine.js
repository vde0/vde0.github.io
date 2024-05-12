export default class ClassLine {

    classList = [];

    constructor (classList) {
        if (classList) this.load(classList);
    }

    [Symbol.toPrimitive] (hint) { return this.classList.join(" "); }

    add (className) {
        if (typeof(className) !== "string") throw TypeError("\"add\" method of the ClassLine object only takes a string arg");
        className.trim();
        if ( isFinite(className.at(0)) ) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must be not beginning from number");
        if (className.includes(" ")) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must have only one class name");

        if ( !this.classList.includes(className) ) this.classList.push(className);
        return this;
    }

    remove (className) {
        if (typeof(className) !== "string") throw TypeError("\"remove\" method of the ClassLine object only takes a string arg");
        className.trim();
        if ( isFinite(className.at(0)) ) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must be not beginning from number");
        if (className.includes(" ")) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must have only one class name");

        const index = this.classList.indexOf(className);
        if ( ~index ) this.classList.splice(index, 1);

        return this;
    }

    toggle (className) {
        if (typeof(className) !== "string") throw TypeError("\"toggle\" method of the ClassLine object only takes a string arg");
        className.trim();
        if ( isFinite(className.at(0)) ) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must be not beginning from number");
        if (className.includes(" ")) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must have only one class name");

        (this.classList.includes(className) ? this.remove(className) : this.add(className));
        return this;
    }

    load (classList) {
        if ( typeof(classList) === "string" ) {
            let newFragment = classList;
            newFragment.trim();

            newFragment = newFragment.split(" ");
            newFragment.forEach( className => this.add(className) );
        }
        else if ( Array.isArray(classList) ) {
            classList.forEach( className => this.add(className) );
        }
        else if ( typeof(classList) === "object" ) {
            if ( !Array.isArray(classList.classList) ) throw SyntaxError;
            classList.classList.forEach( className => this.add(className) );
        }
        else    throw TypeError("invalig arg \"classList\" of the ClassLine.load(): must be string, array or another ClassLine object");

        return this;
    }

    contains (className) {
        if (typeof(className) !== "string") throw TypeError("\"contains\" method of the ClassLine object only takes a string arg");
        className.trim();
        if ( isFinite(className.at(0)) ) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must be not beginning from number");
        if (className.includes(" ")) throw SyntaxError("\"className\" parameter has taken incorrect arg: arg must have only one class name");

        return this.classList.includes(className);
    }

    getLine () {
        return this.classList.join(" ");
    }


    static initClassLine (context) {
        let resultCode  = false;
        if (!context.classLine) { context.classLine = new ClassLine(); resultCode = true; }

        return resultCode;
    }
    static updateState (context) {
        this.initClassLine(context);
        context.setState({ classLine: context.classLine.getLine() });
    }
    static initPassedClassLine (context) {
        if (!context.props.className) return;

        this.initClassLine(context);
        context.classLine.load(context.props.className);

        if (!context.state) context.state = {};
        context.state.classLine = context.classLine.getLine();
    };
}