import { BasicDataStruct } from "@types";
import { deepCopy, deepCopyArr, deepCopyDict, DeepCopyOptions } from "@utils";


describe("Deep Coping", () => {

    test("deepCopy", () => {
        const dict1: BasicDataStruct = {
            prop1: "text1",
            nestedObj: {
                nestedProp1: "glass",
                nestedProp2: "fire",
            },
            nestedArr: [10],
        };
        dict1.ref = dict1;
        dict1.nestedArr.push(dict1.ref);

        const dict2: BasicDataStruct = deepCopy<typeof dict1>(dict1);

        expect(dict2).not.toBe(dict1);
        expect(dict2).toEqual(dict1);

        expect(dict2.ref).not.toBe(dict1);
        expect(dict2.ref).toEqual(dict1);
        expect(dict2).not.toBe(dict1.ref);
        expect(dict2).toEqual(dict1.ref);
        expect(dict2.ref).not.toBe(dict1.ref);
        expect(dict2.ref).toEqual(dict1.ref);
        expect(dict2.nestedArr[1]).not.toBe(dict1);
        expect(dict2.nestedArr[1]).toEqual(dict1);

        expect(dict2.ref).toBe(dict2);
        expect(dict2.nestedArr[1]).toBe(dict2);

        expect(dict2.nestedObj).not.toBe(dict1.nestedObj);
        expect(dict2.nestedObj).toEqual(dict1.nestedObj);

        dict2.nestedArr[1] = dict1;
        expect(dict2.nestedArr[1]).toBe(dict1);
        expect(dict2).toEqual(dict1);

        dict2.prop1 = "Another text";
        delete dict2.nestedObj.nestedProp1;
        dict2.nestedArr[0] = true;

        expect(dict2).not.toEqual(dict1);
        expect(dict2.nestedObj).not.toEqual(dict1.nestedObj);
        expect(dict2.nestedArr).not.toEqual(dict1.nestedArr);

    });
    test("deepCopyArr", () => {
        const arr1: any[] = [5555, true, {prop1: "some text"}];
        arr1.push(arr1);

        const arr2 = deepCopyArr<any[]>(arr1) as BasicDataStruct;

        expect(Array.isArray(arr2)).toBe(true);

        expect(arr2).not.toBe(arr1);
        expect(arr2).toEqual(arr1);
        expect(arr2[2]).toBe(arr1[2]);
        expect(arr2[3]).toBe(arr2);

        const text2     = "Another text"
        arr2[2].prop1   = text2;

        expect(arr2[2].prop1).toBe(text2);
    });
    test("deepCopyDict", () => {
        const dict1: BasicDataStruct = {prop1: [true, "text"], prop2: false};

        const dict2 = deepCopyDict<typeof dict1>(dict1);

        expect(Array.isArray(dict2)).toBe(false);

        expect(dict2).not.toBe(dict1);
        expect(dict2).toEqual(dict1);
        expect(dict2.prop1).toBe(dict1.prop1);

        dict2.prop2 = !dict2.prop2;
        expect(dict2).not.toEqual(dict1);

        dict2.prop1[1] = "Fake Boolean";
        expect(dict2.prop1[1]).toBe(dict1.prop1[1]);
    });

    test("depth = 0", () => {
        const opts: DeepCopyOptions = {depth: 0};

        const dict1: BasicDataStruct = {
            prop1: "Text1",
            prop2: true,
        };

        const dict2 = deepCopy<typeof dict1>(dict1, opts);

        expect(dict2).not.toBe(dict1);
        expect(dict2).not.toEqual(dict1);
        expect(dict2).toEqual({});

        const arr1: any[] = [true, "Not Text", 55];

        const arr2 = deepCopyArr<typeof arr1>(arr1, opts);

        expect(arr2).not.toBe(arr1);
        expect(arr2).not.toEqual(arr1);
        expect(arr2).toEqual([]);
    });
    test("depth = 0 & underGround = true", () => {
        const opts: DeepCopyOptions = {depth: 0, underGround: true};

        const dict1: BasicDataStruct = {
            prop1: "Text1",
            prop2: true,
        };
        const dict2 = deepCopy<typeof dict1>(dict1, opts);
        expect(dict2).toBe(dict1);

        const arr1: any[] = [true, "Not Text", 55];
        const arr2 = deepCopyArr<typeof arr1>(arr1, opts);
        expect(arr2).toBe(arr1);
    });
});