export {
    Options as DeepCopyOptions,
    deepCopy, deepCopyArr, deepCopyDict,
    wait,
    addDebug,
    once,
    listen,
    unlisten,
    listenOnce,
};


import { BasicDataStruct } from "@types";


type Options = {
    copyDict?:          boolean;
    copyArray?:         boolean;
    depth?:             number;
    underGround?:       boolean;
};


function deepCopyDict<D extends {}> (dict: D, {
    copyDict        =   true,
    copyArray       =   false,
    depth           =   3,
    underGround     =   false,
}: Options = {}): BasicDataStruct {
    return deepCopy<D>(dict, {copyDict, copyArray, depth, underGround});
}
function deepCopyArr<A extends any[]> (arr: A, {
    copyDict        =   false,
    copyArray       =   true,
    depth           =   3,
    underGround     =   false,
}: Options = {}): BasicDataStruct {
    return deepCopy<A>(arr, {copyDict, copyArray, depth, underGround});
}

function deepCopy<T extends BasicDataStruct> (
    obj: T,
    {
        copyDict        =   true,
        copyArray       =   true,
        depth           =   3,
        underGround     =   false,
    }: Options = {},
    memo: Map<BasicDataStruct, BasicDataStruct> = new Map()
): BasicDataStruct {

    const isArray:  boolean = Array.isArray(obj);

    // Depth Checking
    // if -1 -> Full depth
    if (depth === 0) {
        if (underGround) return obj;
        return isArray ? [] : {};
    }

    // Memo Checking
    if (memo.has(obj)) return memo.get(obj) as T;

    // Check for ban to copy the Object type
    if (isArray && !copyArray || !isArray && !copyDict) return obj;

    const resultObj: BasicDataStruct = isArray ? [] : {};
    memo.set(obj, resultObj);
    
    const options: Options = {copyArray, copyDict, depth: depth-1, underGround};
    for (let [key, val] of Object.entries(obj)) {

        if (typeof val === "object" && val !== null) {

            resultObj[key] = deepCopy(val, options, memo);
            continue;
        }
        resultObj[key as keyof T] = val;
    }

    return resultObj;
}

const wait = async (ms: number): Promise<void> => {
    return new Promise( (resolve) => setTimeout(resolve, ms) );
};

function addDebug(prop: string, val: any) {
    if (!window.debug) window.debug = {};
    window.debug[prop] = val;
}

function once (callback: CallableFunction): () => boolean {
    let called = false;
    return (...args) => { if (called) return false; called = true; callback(...args); return true; };
}


type OnType<E extends string = string>  = (event: E, listener: CallableFunction) => void;
type OffType<E extends string = string> = (event: E, listener: CallableFunction) => void;
type Events<E extends string = string> = Partial<Record<E, CallableFunction>>;

function listen <E extends string = string>(
    master: Record<keyof any, any>, events: Events<E>, toolName: string = 'on'
): void {
    for (let event in events) master[toolName]?.(event, events[event]);
}
function listenOnce <E extends string = string>(
    master: Record<keyof any, any>, events: Events<E>, toolName: string = 'once'
): void {
    for (let event in events) master[toolName](event, events[event]);
}
function unlisten <E extends string = string>(
    master: Record<keyof any, any>, events: Events<E>, toolName: string = 'off'
): void {
    for (let event in events) master[toolName](event, events[event]);
}