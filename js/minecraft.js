const rexUrl = "https://rexdlbox.com/index.php?id=minecraft";

const utils = {
    toTitleCase: function (str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
    extractVersion: function (url) {
        const regex = /v(\d+\.\d+\.\d+(\.\d+)*)/i;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        } else {
            return "Latest";
        }
    },
    cors: function (url) {
        return "https://corsproxy.io/?" + encodeURIComponent(url);
    },
};

function generateVersionInfo(type, data, containerId) {
    const version = data.version;
    const mbSize = data.size;
    const downloadUrl = data.download_url;
    const branch = utils.toTitleCase(type);

    const container = document.querySelector(`#${containerId}`);

    const button = `<a href="${downloadUrl}" class="button">Download ${branch} (${mbSize} MB)</a>`;
    const title = `<h2>Version: <strong>${version}</strong></h2>`;
    const html = title + button;
    container.innerHTML = html;
    container.style.display = "block";
}

async function fetchVersions() {
    let data;

    const url = utils.cors(rexUrl);
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
                "Accept-Language": "en-US, en;q=0.5",
            },
        });
        const text = await response.text();
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(text, "text/html");

        const versions = Array.from(
            htmlDocument.querySelectorAll('a[href*="www.ReXdl.com.apk"]')
        )
            .map((a) => a.href)
            .slice(0, 2);
        const file_sizes_mb = htmlDocument
            .querySelector(".dl-size")
            .textContent.trim()
            .substring(11)
            .split(" | ")
            .map((item) => parseInt(item.substring(0, 3)));

        data = {
            stable: {
                download_url: versions[1],
                version: utils.extractVersion(versions[1]),
                size: file_sizes_mb[0],
            },
            beta: {
                download_url: versions[0],
                version: utils.extractVersion(versions[0]),
                size: file_sizes_mb[1],
            },
        };
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    return data;
}

document.querySelector(".container h1 a").href = rexUrl;

(async function () {
    const data = await fetchVersions();
    console.log(data);
    generateVersionInfo("stable", data.stable, "stable-version");
    generateVersionInfo("beta", data.beta, "beta-version");
})();
