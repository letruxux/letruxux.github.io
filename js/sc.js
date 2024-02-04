const cors = function (url) {
    return "https://corsproxy.io/?" + encodeURIComponent(url);
};

(async () => {
    const response = await fetch(
        cors("https://www.informarea.it/streamingcommunity-nuovo-indirizzo/"),
        {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
                "Accept-Language": "en-US, en;q=0.5",
            },
        }
    );
    const text = await response.text();
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(text, "text/html");
    const newUrl = htmlDocument.querySelector(
        "#post-77995 > div.cm-post-content > div.cm-entry-summary > ul:nth-child(12) > li > strong > span"
    ).textContent;
    location.href = newUrl;
})();
