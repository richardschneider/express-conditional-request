'use strict';

function isWeak(etag) {
    return etag.startsWith('W/"');
}

function isStrong(etag) {
    return etag.startsWith('"');
}

function opaqueTag(etag) {
    if (isWeak(etag))
        return etag.substring(2);

    return etag;
}
function weakMatch(a, b) {
    return opaqueTag(a) === opaqueTag(b);
}

function strongMatch(a, b) {
    return isStrong(a) && isStrong(b) && a === b;
}

module.exports = {
    isWeak: isWeak,
    isStrong: isStrong,
    weakMatch: weakMatch,
    strongMatch: strongMatch
};
