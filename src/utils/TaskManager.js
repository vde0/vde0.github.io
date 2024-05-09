// taskorder[macrotask list, ...][macrotask func, ...]
const taskContainer = [];
const taskQueue     = new Set();

function makeMacrotaskList () {
    return [];
}

const execMacrotask = (taskNumber) => {
    if ( !taskQueue.has(taskNumber) ) return;

    taskContainer[taskNumber].forEach( task => task() );

    delete taskContainer[taskNumber];
    taskQueue.delete(taskNumber);
};

let isRunning   = false;
let currentTask = 0;
function runQueue () {
    if (isRunning) return;
    isRunning = true;

    exec(currentTask);

    function exec (taskNumber) {
        if (taskQueue.size === 0 ) {
            isRunning   = false;
            currentTask = 0;
            return;
        }

        setTimeout(_ => {
            execMacrotask(taskNumber);
            exec(++taskNumber);
        });
    }
}

export default class TaskManager {

    static setMacrotask (func, orderPos = 1) {
        if (typeof func !== "function")     throw TypeError(
            "\"func\" arg of the TaskManager.setMacrotask() util must be a function");
        if (typeof orderPos !== "number")   throw TypeError(
            "\"orderPos\" arg of the TaskManager.setMacrotask() util must be a number");
        if (orderPos <= 0)                 throw RangeError(
            "\"orderPos\" arg of the TaskManager.setMacrotask() util must be a range the 1..Infinity");
        
        
        const taskNum = currentTask + orderPos -1;
        if ( !taskQueue.has(taskNum) ) {
            taskQueue.add(taskNum);
            taskContainer[taskNum]  = makeMacrotaskList();
        }
        taskContainer[taskNum].push(func);

        queueMicrotask(runQueue);
    }

    static getMacrotaskQueue () {
        const macrotasks    = [];
        
        taskContainer.forEach( (taskList, taskListNum) => {
            macrotasks[taskListNum] = [...taskList];
        } );

        return macrotasks;
    }
}