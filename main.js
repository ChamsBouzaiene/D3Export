const prefix = {
  xmlns: "http://www.w3.org/2000/xmlns/",
  xlink: "http://www.w3.org/1999/xlink",
  svg: "http://www.w3.org/2000/svg",
};

export function download(svgInfo, filename) {
  window.URL = window.URL || window.webkitURL;
  const blob = new Blob(svgInfo.source, { type: "text/xml" });
  const url = window.URL.createObjectURL(blob);
  var body = document.body;
  var a = document.createElement("a");

  body.appendChild(a);
  a.setAttribute("download", filename + ".svg");
  a.setAttribute("href", url);
  a.style.display = "none";
  a.click();
  a.parentNode.removeChild(a);

  setTimeout(function () {
    window.URL.revokeObjectURL(url);
  }, 10);
}

function setInlineStyles(svg) {
  const emptySvg = window.document.createElementNS(prefix.svg, "svg");
  window.document.body.appendChild(emptySvg);
  const emptySvgDeclarationComputed = window.getComputedStyle(emptySvg);

  function explicitlySetStyle(element) {
    var cSSStyleDeclarationComputed = getComputedStyle(element);
    var i, len, key, value;
    var computedStyleStr = "";
    for (i = 0, len = cSSStyleDeclarationComputed.length; i < len; i++) {
      key = cSSStyleDeclarationComputed[i];
      value = cSSStyleDeclarationComputed.getPropertyValue(key);
      if (value !== emptySvgDeclarationComputed.getPropertyValue(key)) {
        computedStyleStr += key + ":" + value + ";";
      }
    }
    element.setAttribute("style", computedStyleStr);
  }
  function traverse(obj) {
    var tree = [];
    tree.push(obj);
    visit(obj);
    function visit(node) {
      if (node && node.hasChildNodes()) {
        var child = node.firstChild;
        while (child) {
          if (child.nodeType === 1 && child.nodeName !== "SCRIPT") {
            tree.push(child);
            visit(child);
          }
          child = child.nextSibling;
        }
      }
    }
    return tree;
  }
  // hardcode computed css styles inside svg
  const allElements = traverse(svg);
  let i = allElements.length;
  while (i--) {
    explicitlySetStyle(allElements[i]);
  }
}

function preprocess(svg, config) {
  svg.setAttribute("version", "1.1");
  svg.removeAttribute("xmlns");
  svg.removeAttribute("xlink");

  if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
    svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
  }

  if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
    svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
  }

  setInlineStyles(svg);
  const rect = svg.getBoundingClientRect();
  svg.style.width = rect.width;
  svg.style.height = rect.height;
  console.log("svg", svg);
  let xmls = new XMLSerializer();
  const source = xmls.serializeToString(svg);
  const doctype =
    '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

  const svgInfo = {
    class: svg.getAttribute("class"),
    id: svg.getAttribute("id"),
    source: [doctype + source],
  };

  return svgInfo;
}

function getDefaultFileName(svgInfo) {
  var defaultFileName = "untitled";
  if (svgInfo.id) {
    defaultFileName = svgInfo.id;
  } else if (svgInfo.class) {
    defaultFileName = svgInfo.class;
  } else if (window.document.title) {
    defaultFileName = window.document.title
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase();
  }

  return defaultFileName;
}

export function save(svgElement, config) {
  if (svgElement.nodeName !== "svg" || svgElement.nodeType !== 1) {
    throw Error("Input a valid svg element");
  }
  config = config || {};
  const svgInfo = preprocess(svgElement, config);
  const defaultFileName = getDefaultFileName(svgInfo);
  const filename = config.filename || defaultFileName;
  if (config.pdf) {
    return printDiv(svgElement, filename);
  }
  download(svgInfo, filename);
}

export function printDiv(ref, filename) {
  console.log(ref.style);
  let mywindow = window.open(
    "",
    "PRINT",
    "height=650,width=900,top=100,left=150"
  );
  mywindow.document.write(`<html><head><title>${filename}</title>`);
  mywindow.document.write("</head><body >");
  mywindow.document.write(`${ref.outerHTML}`);
  mywindow.document.write("</body></html>");

  mywindow.print();

  return true;
}
