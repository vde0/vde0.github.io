import TaskManager from "./TaskManager";

export default class UpdateHook {
    connect (updateFunc) {
        this._customUpdate  = updateFunc;
    }
    on () {
        this._customUpdate?.()
    }
    onAsMacrotask (order) {
        TaskManager.setMacrotask( _ => this._customUpdate?.(), order );
    }
}