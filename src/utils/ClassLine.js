export default class ClassLine {

    static genList (classList) {
        let resultClassList = [];

        if ( typeof(classList) === "string" ) {
            resultClassList = classList;

            resultClassList.trim();
            resultClassList = resultClassList.split(" ");
        }
        else if ( Array.isArray(classList) ) {
            console.log("array");
            resultClassList = [...classList];
        }
        else if ( typeof(classList) === "object" ) {
            console.log("object");
            if ( !Array.isArray(classList.classList) ) throw SyntaxError;
            resultClassList = [...classList.classList];
        }
        else    throw TypeError("invalig arg \"classList\" of the ClassLine.genList(): must be string, array or another ClassLine object");
        
        return resultClassList;
    }
    static genString (classList) {
        let resultClassList = "";

        if ( typeof(classList) === "string" ) {
            resultClassList = classList;
            resultClassList.trim();
        }
        else if ( Array.isArray(classList) ) {
            resultClassList = classList.join(" ");
        }
        else if ( typeof(classList) === "object" ) {
            if ( !Array.isArray(classList.classList) ) throw SyntaxError;
            resultClassList = classList.classList.join(" ");
        }
        else    throw TypeError("invalig arg \"classList\" of the ClassLine.genString(): must be string, array or another ClassLine object");

        return resultClassList;
    }
    static genClassLine (classList) {
        let resultClassList = new ClassLine();

        if ( typeof(classList) === "string" ) {
            classes = classList;
            classes.trim();

            classes = classes.split(" ");
            classes.forEach( className => resultClassList.add(className) );
        }
        else if ( Array.isArray(classList) ) {
            classList.forEach( className => resultClassList.add(className) );
        }
        else if ( typeof(classList) === "object" ) {
            if ( !Array.isArray(classList.classList) ) throw SyntaxError;
            classList.classList.forEach( className => resultClassList.add(className) );
        }
        else    throw TypeError("invalig arg \"classList\" of the ClassLine.genClassLine(): must be string, array or another ClassLine object");

        return resultClassList;
    }

    static diff (classList1, classList2) {
        let diffArr = [];

        const handledList1 = ClassLine.genList(classList1);
        const handledList2 = ClassLine.genList(classList2);

        handledList1.forEach(
            className => !handledList2.includes(className) && diffArr.push(className));

        return diffArr;
    }

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
        const handledList = ClassLine.genList(classList);
        handledList.forEach(className => this.add(className));

        return this;
    }
    substract (classList) {
        const handledList = ClassLine.genList(classList);
        this.classList = this.classList.filter(className => !handledList.includes(className));

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
}