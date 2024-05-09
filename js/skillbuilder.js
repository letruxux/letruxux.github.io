const loadingElement = document.getElementById("loading");
const resultImg = document.querySelector("img#result");
const _possibleProviders = [
    ["tandpfun", "https://skillicons.dev/icons"],
    ["LelouchFR", "https://go-skill-icons.vercel.app/api/icons"],
];
const _suggestedProvider = _possibleProviders[0];
const _selectedByQueryProvider = new URLSearchParams(location.search).get("p");
const selectedProvider = _possibleProviders.map((e) => e[0]).includes(_selectedByQueryProvider)
    ? _possibleProviders.filter(([author, _]) => {
          return author.toLowerCase() === _selectedByQueryProvider.toLowerCase();
      })[0]
    : _suggestedProvider || _suggestedProvider;

const [repoAuthor, baseUrl] = selectedProvider;

document.querySelector("h3#title").textContent = `${repoAuthor} - SkillIcons`;

resultImg.onload = () => {
    if (!loadingElement.classList.contains("loaded")) loadingElement.classList.add("loaded");
};

/** @param {Event} e */
resultImg.onerror = (e) =>
    _selectedByQueryProvider
        ? alert(
              "There was an error loading a custom set. Please reload or use the default one by removing the 'p' parameter from the url."
          )
        : null;

// https://stackoverflow.com/a/66180709/20808998
const loadImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    dummy.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(dummy.value);
    document.body.removeChild(dummy);
}

async function fetchMd() {
    let resp;
    try {
        resp = await fetch("https://raw.githubusercontent.com/" + repoAuthor + "/skill-icons/main/readme.md");
        if (!resp.ok) {
            throw new Error("Trying README.md");
        }
    } catch (error) {
        try {
            resp = await fetch("https://raw.githubusercontent.com/" + repoAuthor + "/skill-icons/main/README.md");
        } catch (error) {
            return "";
        }
    }

    if (!resp.ok) {
        return "";
    }
    return await resp.text();
}

/** @param {string} md */
function mdToTable(md) {
    const pattern = /\|(.+?)\|(.+?)\|/g;

    const matches = Array.from(md.matchAll(pattern));

    const tablePart = matches
        .map((match) =>
            match
                .slice(1)
                .map((cell) => cell.trim())
                .join("|")
        )
        .join("\n");

    return tablePart;
}

function getNewSkillIconsUrl() {
    const perline = document.querySelector("input#perline").value;
    let _iconsString = "";
    const _tableElements = document.querySelectorAll("table tbody tr:not(:nth-child(1))");
    for (const tr of _tableElements) {
        const input = tr.querySelector("input");
        const checked = input.checked;
        if (checked) {
            const iconId = tr.querySelector("pre").textContent;
            _iconsString += iconId + ",";
        }
    }
    const perlineString = perline < 50 ? (perline != 0 ? `?perline=${perline}` : "?") : "?perline=15";
    const iconsString = _iconsString.length > 0 ? _iconsString : "all";
    console.log(baseUrl);
    return `${baseUrl}${perlineString}&i=${iconsString}`;
}

function updateImage() {
    resultImg.setAttribute("src", getNewSkillIconsUrl());
}

/**
 * @param {string} table
 */
function extractIcons(table) {
    const iconIds = {};

    const lines = table.trim().split("\n");

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split("|");
        if (!parts[0]) {
            continue;
        }
        if (!parts[0].startsWith("`")) {
            continue;
        }
        const iconId = parts[0].trim().replaceAll("`", "");
        const html = parts[1].trim();
        const url =
            "https://raw.githubusercontent.com/" +
            repoAuthor +
            "/skill-icons/main" +
            new DOMParser()
                .parseFromString(html, "text/html")
                .body.firstElementChild.getAttribute("src")
                .replace(".", "");
        iconIds[iconId] = url;
    }

    return iconIds;
}

document.addEventListener("DOMContentLoaded", async () => {
    const md = await fetchMd();
    const table = mdToTable(md);
    const iconIds = extractIcons(table);
    console.log(iconIds);

    const tableElement = document.querySelector("table tbody");
    for (const [iconId, iconUrl] of Object.entries(iconIds)) {
        const tr = document.createElement("tr");
        tr.id = iconId;

        const tdIcon = document.createElement("td");
        const img = document.createElement("img");
        img.src = iconUrl;
        const pre = document.createElement("pre");
        pre.textContent = iconId;
        tdIcon.appendChild(img);
        tdIcon.appendChild(pre);

        const tdCheckbox = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selected";
        checkbox.addEventListener("click", updateImage);
        tdCheckbox.appendChild(checkbox);

        tr.appendChild(tdIcon);
        tr.appendChild(tdCheckbox);

        tableElement.appendChild(tr);
    }

    updateImage();
    loadImage(getNewSkillIconsUrl()).then(() => loadingElement.classList.add("loaded"));
});

function reArrange() {
    const bUrl = getNewSkillIconsUrl();
    location.href = "/skillbuilder-arrange.html?u=" + encodeURIComponent(bUrl);
}

document.querySelector("input#perline").onchange = updateImage;
