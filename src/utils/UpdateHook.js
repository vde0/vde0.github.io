import TaskManager from "./TaskManager";

export default class UpdateHook {
    connect (updateFunc) {
        this._customUpdate  = updateFunc;
    }
    on (...args) {
        this._customUpdate?.(...args)
    }
    onAsMacrotask (order) {
        TaskManager.setMacrotask( _ => this._customUpdate?.(), order );
    }
}