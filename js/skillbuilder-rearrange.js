const loadingElement = document.getElementById("loading");
const resultImg = document.querySelector("img#result");

const _url = new URLSearchParams(location.search).get("u");
if (!_url) {
    location.href = "/skillbuilder.html";
}
const url = decodeURIComponent(_url);
const urlObj = new URL(url);
const newUrlParams = urlObj.searchParams;
const selectedIcons = newUrlParams
    .get("i")
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e);

resultImg.onload = () => {
    if (!loadingElement.classList.contains("loaded"))
        loadingElement.classList.add("loaded");
};

// https://stackoverflow.com/a/66180709/20808998
const loadImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

function buildNewUrl(old) {
    const lis = document.querySelectorAll("#icons ul li");
    const params = new URLSearchParams();
    params.append("perline", old.get("perline"));
    const items = [];
    for (const li of lis) items.push(li.textContent);
    params.append("i", items.join(","));
    const newUrl = urlObj.origin + urlObj.pathname + "?" + params.toString();
    return newUrl;
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    dummy.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(dummy.value);
    document.body.removeChild(dummy);
}

function updateImage(newUrl) {
    resultImg.setAttribute("src", newUrl);
}

document.addEventListener("DOMContentLoaded", async () => {
    const ul = document.querySelector("div#icons ul");
    ul.innerHTML = "";
    for (const icon of selectedIcons) {
        const li = document.createElement("li");
        li.setAttribute("draggable", "true");
        li.setAttribute("ondragover", "dragOver(event)");
        li.setAttribute("ondragstart", "dragStart(event)");
        li.setAttribute("ondragend", "dragEnd(event)");
        li.textContent = icon;
        ul.appendChild(li);
    }

    loadImage(url).then(() => loadingElement.classList.add("loaded"));
    updateImage(url);
});

// https://stackoverflow.com/a/28962290/20808998
var _el;

function dragOver(e) {
    if (isBefore(_el, e.target)) e.target.parentNode.insertBefore(_el, e.target);
    else e.target.parentNode.insertBefore(_el, e.target.nextSibling);
}

function dragStart(e) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", null); // Thanks to bqlou for their comment.
    _el = e.target;
}

function isBefore(el1, el2) {
    if (el2.parentNode === el1.parentNode)
        for (
            var cur = el1.previousSibling;
            cur && cur.nodeType !== 9;
            cur = cur.previousSibling
        )
            if (cur === el2) return true;
    return false;
}

function dragEnd(e) {
    loadingElement.classList.remove("loaded");
    const builtUrl = buildNewUrl(newUrlParams);
    updateImage(builtUrl);
    loadImage(builtUrl).then(() => loadingElement.classList.add("loaded"));
}
