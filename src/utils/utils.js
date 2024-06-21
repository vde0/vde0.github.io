function checkAncestor (el, selector) {
    return !!el.closest(selector);
}

function checkOwnershipToArea (el, selector) {
    return el.matches(selector) || !!el.closest(selector);
}

const dvhDiv        = document.createElement("div");
const lvhDiv        = document.createElement("div");
const svhDiv        = document.createElement("div");
const vhDiv         = document.createElement("div");
const percentDiv    = document.createElement("div");

dvhDiv.classList.add("full-unit_dvh");
lvhDiv.classList.add("full-unit_lvh");
svhDiv.classList.add("full-unit_svh");
vhDiv.classList.add("full-unit_vh");
percentDiv.classList.add("full-unit_percent");

document.documentElement.append(dvhDiv);
document.documentElement.append(lvhDiv);
document.documentElement.append(svhDiv);
document.documentElement.append(vhDiv);
document.documentElement.append(percentDiv);

const meter = {
    get dvh () { return dvhDiv.offsetHeight; },
    get lvh () { return lvhDiv.offsetHeight; },
    get svh () { return svhDiv.offsetHeight; },
    get vh () { return vhDiv.offsetHeight; },
    get percent () { return percentDiv.offsetHeight; },
}


const mobile_events = new Set([
    "touchstart",
    "touchend",
    "touchmove",
    "touchcancel",
]);
const isMobile = ('ontouchstart' in document.documentElement && !!(navigator.userAgent.match(/Mobi/)));
const isIOs     = !!navigator.userAgent.match(/(iPhone|iPod|iPad)/);


export {
    checkAncestor,
    checkOwnershipToArea,
    isMobile,
    isIOs,

    meter,
}