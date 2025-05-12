// === INTERFACE ===
export interface IPrivateContext<O extends object, P extends DefaultPrivateProps> {
    set     <K extends keyof P> (obj: O, prop: K, value: P[K]):     void;
    set     <K extends keyof P> (obj: O, props: {[J in K]?: P[J]}): void;
    get     <K extends keyof P> (obj: O, prop: K):                  P[K] | undefined;
    get     <K extends keyof P> (obj: O, propNames: K[]):           {[J in K]: P[J]};
    has     <K extends keyof P> (obj: O, prop: K):                  boolean;
    delete  <K extends keyof P> (obj: O, prop: K):                  boolean;
}
type DefaultPrivateProps = { [PK in PropertyKey]: any };


// === PRIVATE DATA ===
const context = new WeakMap<object, DefaultPrivateProps>();


// === Make-util OF FABRIC PATTERN ===
export class PrivateContext<
    O extends object,
    P extends DefaultPrivateProps = DefaultPrivateProps

> implements IPrivateContext<O, P> {

    // === API OBJECT ===
    set     <K extends keyof P> (obj: O, prop: K, value: P[K]):         void;
    set     <K extends keyof P> (obj: O, props: {[J in K]?: P[J]}):     void;
    set     <K extends keyof P> (obj: O, propOrProps: K | {[J in K]?: P[J]}, value?: P[K]): void {

        if ( !context.has(obj) ) context.set(obj, {});
        switch (typeof propOrProps) {

            case "string":
                if (value === undefined) throw Error("'value' arg is undefined");

                const prop = propOrProps;
                if (typeof value === 'function') value = value.bind(obj);
                context.get(obj)![prop] = value;
                break;

            case "object":
                const props         = propOrProps;
                const privatePlace  = context.get(obj)!;

                Object.assign(privatePlace, props);
                break;
        }
    }
    get     <K extends keyof P> (obj: O, prop: K):                  P[K] | undefined;
    get     <K extends keyof P> (obj: O, propNames: K[]):           {[J in K]: P[J]};
    get     <K extends keyof P> (obj: O, propOrPropNames: K | K[]): P[K] | {[J in K]: P[J]} | undefined | {} {

        switch (typeof propOrPropNames) {

            case "string":
                const prop = propOrPropNames;
                return context.get(obj)?.[prop];

            case "object":
                if (!Array.isArray(propOrPropNames)) throw Error("'propNames' arg must be array");

                const propNames                 = propOrPropNames;
                const privatePlace              = context.get(obj);
                const result: {[J in K]: P[J]}  = {} as {[J in K]: P[J]};

                if (!privatePlace) return {};

                propNames.forEach(propName => result[propName] = privatePlace[propName]);
                return result;
        }
        if (typeof propOrPropNames === "string") {
            const prop = propOrPropNames;
            return context.get(obj)?.[prop];
        }

    }
    has     <K extends keyof P> (obj: O, prop: K): boolean {
        const privatePlace = context.get(obj);
        return privatePlace ? prop in privatePlace : false;
    }
    delete  <K extends keyof P> (obj: O, prop: K): boolean {
        const privatePlace = context.get(obj);
        if ( !(privatePlace) ) return false;
        return delete privatePlace[prop];
    }
}