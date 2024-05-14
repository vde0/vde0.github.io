// private static consts
const TOP_DIRECT    = Symbol("TOP");
const RIGHT_DIRECT  = Symbol("RIGHT");
const BOTTOM_DIRECT = Symbol("BOTTOM");
const LEFT_DIRECT   = Symbol("LEFT");
const surfaceTable  = {
    // direct: [piston-surface, movable-surfase]
    [TOP_DIRECT]    : ["top"    ,   "bottom"    ,   "height"],
    [RIGHT_DIRECT]  : ["right"  ,   "left"      ,   "width" ],
    [BOTTOM_DIRECT] : ["bottom" ,   "top"       ,   "height"],
    [LEFT_DIRECT]   : ["left"   ,   "right"     ,   "width" ],
};

export default class StickyPiston {

    constructor (pistonEl = null, movableEl = null) {

        this.pistonBlock    = pistonEl;
        this.movableBlock   = movableEl;
        this.curDirect      = TOP_DIRECT;
        this._pistonSurface  = null;
        this._movableSurface = null;

        this.setSurfaces();
    }

    get TOP ()      { return TOP_DIRECT; }
    get RIGHT ()    { return RIGHT_DIRECT; }
    get BOTTOM ()   { return BOTTOM_DIRECT; }
    get LEFT ()     { return LEFT_DIRECT; }

    get piston () { return this.pistonBlock; }
    set piston (el) { this.pistonBlock = el; this.setSurfaces(); }

    get movable () { return this.movableBlock; }
    set movable (el) { this.movableBlock = el; this.setSurfaces(); }

    get direction () { return this.curDirect; }
    set direction (symb) { 
        if (
            symb !== TOP_DIRECT     &&
            symb !== RIGHT_DIRECT   &&
            symb !== BOTTOM_DIRECT  &&
            symb !== LEFT_DIRECT
        ) {
            throw SyntaxError;
        }

        this.curDirect = symb;
        this.setSurfaces();
    }

    get pistonSurface () { return this._pistonSurface }
    get movableSurface () { return this._movableSurface }

    setSurfaces = () => {
        this._pistonSurface   = this.pistonBlock?.getBoundingClientRect()[
            surfaceTable[this.curDirect][0] ];
        this._movableSurface  = this.movableBlock?.getBoundingClientRect()[
            surfaceTable[this.curDirect][1] ];
    }

    press () {
        if (!this.movableBlock || !this.pistonSurface) return;
        const offset        = this.pistonSurface - this.movableSurface;
        const curHeight     = this.movableBlock.offsetHeight;
        const resultHeight  = curHeight + offset >= 0 ? curHeight + offset : 0;

        if (Number.isNaN(resultHeight)) return;

        this.movableBlock.style.setProperty(
            surfaceTable[this.curDirect][2], resultHeight + "px");
        this.setSurfaces();
    }
}