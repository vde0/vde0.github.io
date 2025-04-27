// === INTERFACE ===
export interface PrivateContext<O extends object, P extends Record<PropertyKey, any> = Record<PropertyKey, any>> {
    get (obj: O, prop: keyof P): P[typeof prop];
    set (obj: O, prop: keyof P, value: P[typeof prop]): void;
    has (obj: O, prop: keyof P): boolean;
    delete (obj: O, prop: keyof P): boolean;
}

// === Make-util OF FABRIC PATTERN ===
export function makePrivateContext<
    O extends object,
    P extends Record<PropertyKey, any> = Record<PropertyKey, any>

> (): PrivateContext<O, P> {

    // === PRIVATE DATA ===
    const context = new WeakMap<O, P>();

    // === API OBJECT ===
    return {
        set (obj, prop, value) {
            if ( !context.has(obj) ) context.set(obj, {} as P);
            if (typeof value === 'function') value = value.bind(obj);
            context.get(obj)![prop] = value;
        },
        get (obj, prop) {
            return context.get(obj)?.[prop] as P[typeof prop];
        },
        has (obj, prop) {
            const privatePlace = context.get(obj);
            return privatePlace ? prop in privatePlace : false;
        },
        delete (obj, prop) {
            const privatePlace = context.get(obj);
            if ( !(privatePlace) ) return true;
            return delete privatePlace[prop];
        },
    }
}