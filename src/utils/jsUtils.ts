import { BasicDataStruct } from "@types";

export {
    Options as DeepCopyOptions,
    deepCopy, deepCopyArr, deepCopyDict,
};


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
