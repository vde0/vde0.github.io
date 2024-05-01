function checkAncestorByClass (el, selector) {
    const parent = el.parentNode;

    if      (parent === document) return false;
    else if (parent.classList.contains(selector)) return true;
    
    return checkAncestorByClass(parent, selector);
}

function checkClickByArea (evt, selector) {
    const el = evt.target;
    return (
        el.classList.contains(selector) || checkAncestorByClass(el, selector)
    );
}

export {checkAncestorByClass, checkClickByArea}