import { setAttribute, setStyle } from "./lib/domUtils";
import { compose } from "./lib/func";

enum prefix {
  xmlns = "http://www.w3.org/2000/xmlns/",
  xlink = "http://www.w3.org/1999/xlink",
  svg = "http://www.w3.org/2000/svg",
}

type AnchorOptions = {
  url: string;
  name: string;
};

const setDownload = (name: string) => setAttribute("download", name + ".svg");
const setHref = (url: string) => setAttribute("href", url);
const setDisplayNone = setStyle("display", "none");

const fileBlob = (fileChunks: any) =>
  new Blob(fileChunks, { type: "text/xml" });

const clickAnchorTag = (el: HTMLAnchorElement) => {
  el.click();
  return el;
};

const fileUrl = (
  fileBlob: any,
  windowURL: any = window.URL || window.webkitURL
) => windowURL.createObjectURL(fileBlob);

const anchorTag = document.createElement("a");

const createAnchor = (url: string, name: string) =>
  compose(setDownload(name), setHref(url), setDisplayNone)(anchorTag);

const createUrl = (fileChunks: any): string =>
  compose(fileUrl, fileBlob)(fileChunks);

let body = document.body;
const appendChild = (child: HTMLElement) => (el: HTMLElement) => {
  el.appendChild(child);
  return el;
};
const removeAnchore = (anchore: HTMLElement) => anchore.remove();

function download(fileChunks: any, fileName: string, body: HTMLElement): void {
  compose(
    removeAnchore,
    clickAnchorTag,
    (el: string) => createAnchor(el, fileName),
    createUrl
  )(fileChunks);

  // setTimeout(function () {
  //   window.URL.revokeObjectURL(url);
  // }, 10);
}

download(["test"], "lol", body);
