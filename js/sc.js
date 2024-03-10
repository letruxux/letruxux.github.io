const cors = function (url) {
    return "https://corsproxy.io/?" + encodeURIComponent(url);
};

let errors = 0;

const choices = [
    {
        url: "https://tecnologiacasa.it/streamingcommunity-nuovo-indirizzo/",
        selector: "p > a[target='_blank'][href*='streamingcommunity']",
    },
    {
        url: "https://www.informarea.it/streamingcommunity-nuovo-indirizzo/",
        selector: 'span[style="color: #ff0000;"]',
    },
];

const h1 = document.body.querySelector("h1");

async function animateText(text) {
    for (let i = 0; i < text.length; i++) {
        h1.textContent = text.substring(0, i + 1);
        await new Promise((resolve) => setTimeout(resolve, 30));
    }
}

(async () => {
    for (const choice of choices) {
        try {
            const response = await fetch(cors(choice.url), {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
                    "Accept-Language": "en-US, en;q=0.5",
                },
            });
            const text = await response.text();
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text, "text/html");

            const newUrl = htmlDocument.querySelector(
                choice.selector
            ).textContent;
            location.href = newUrl;
            break;
        } catch (error) {
            console.error("fallback", error);
            errors++;
            if (errors === choices.length)
                animateText("there was an error while parsing the url");
            continue;
        }
    }
})();

animateText("redirecting...");
