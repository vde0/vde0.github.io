export default class ComponentUpdateHook {
    connect (updateFunc, context) {
        this._customUpdate      = updateFunc.bind(context);
        this._componentUpdate   = context.componentDidUpdate?.bind(context);

        context.componentDidUpdate  = this._update.bind(this);
    }
    on () {
        this._on = true;
    }
    _update () {
        this._componentUpdate?.();

        if (!this._on) return;
        this._customUpdate();
        this._on = false;
    }
}