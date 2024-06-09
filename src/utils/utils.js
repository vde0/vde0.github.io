function checkAncestor (el, selector) {
    return !!el.closest(selector);
}

function checkOwnershipToArea (el, selector) {
    return el.matches(selector) || !!el.closest(selector);
}


const mobile_events = new Set([
    "touchstart",
    "touchend",
    "touchmove",
    "touchcancel",
]);
const isMobile = ('ontouchstart' in document.documentElement && !!(navigator.userAgent.match(/Mobi/)));
const isIOS     = !!navigator.userAgent.match(/(iPhone|iPod|iPad)/);


export {
    checkAncestor,
    checkOwnershipToArea,
    isMobile,
    isIOS,
}