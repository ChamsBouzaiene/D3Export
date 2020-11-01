'use strict';

var setAttribute = function (attribute, value) { return function (elem) {
    elem.setAttribute(attribute, value);
    return elem;
}; };
var setStyle = function (param, value) { return function (elem) {
    elem.style[param] = value;
    return elem;
}; };

var compose = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (input) { return fns.reduceRight(function (mem, fn) { return fn(mem); }, input); };
};

var prefix;
(function (prefix) {
    prefix["xmlns"] = "http://www.w3.org/2000/xmlns/";
    prefix["xlink"] = "http://www.w3.org/1999/xlink";
    prefix["svg"] = "http://www.w3.org/2000/svg";
})(prefix || (prefix = {}));
var setDownload = function (name) { return setAttribute("download", name + ".svg"); };
var setHref = function (url) { return setAttribute("href", url); };
var setDisplayNone = setStyle("display", "none");
var fileBlob = function (fileChunks) {
    return new Blob(fileChunks, { type: "text/xml" });
};
var clickAnchorTag = function (el) {
    el.click();
    return el;
};
var fileUrl = function (fileBlob, windowURL) {
    if (windowURL === void 0) { windowURL = window.URL || window.webkitURL; }
    return windowURL.createObjectURL(fileBlob);
};
var anchorTag = document.createElement("a");
var createAnchor = function (url, name) {
    return compose(setDownload(name), setHref(url), setDisplayNone)(anchorTag);
};
var createUrl = function (fileChunks) {
    return compose(fileUrl, fileBlob)(fileChunks);
};
var removeAnchore = function (anchore) { return anchore.remove(); };
function download(fileChunks, fileName, body) {
    compose(removeAnchore, clickAnchorTag, function (el) { return createAnchor(el, fileName); }, createUrl)(fileChunks);
    // setTimeout(function () {
    //   window.URL.revokeObjectURL(url);
    // }, 10);
}
download(["test"], "lol");
