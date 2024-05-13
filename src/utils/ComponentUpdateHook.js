import TaskManager from "./TaskManager";

export default class ComponentUpdateHook {
    connect (updateFunc, context) {
        this._customUpdate      = updateFunc.bind(context);
    }
    on () {
        TaskManager.setMacrotask( _ => this._customUpdate() );
    }
}