const gridElement = document.querySelector(".grid");
const overElement = document.querySelector(".over");
const tutorialElement = document.querySelector(".tutorial");

const utils = {
    youtubeIdFromUrl: function (url) {
        const match = url.match(
            /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        );
        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return null;
        }
    },
    twitchUsernameFromUrl: function (url) {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?twitch\.tv\/(\w+)/i);
        if (match) {
            return match[1];
        } else {
            return null;
        }
    },
    kickUsernameFromUrl: function (url) {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?kick\.com\/(\w+)/i);
        if (match) {
            return match[1];
        } else {
            return null;
        }
    },
    urlsToIFrames: function (urls) {
        let iframes = [];
        for (const url of urls) {
            const youtubeId = utils.youtubeIdFromUrl(url);
            const twitchUsername = utils.twitchUsernameFromUrl(url);
            const kickUsername = utils.kickUsernameFromUrl(url);

            if (youtubeId) {
                iframes.push(
                    `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&mute=1" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
                );
            } else if (twitchUsername) {
                iframes.push(
                    `<iframe class="videoplayer" src="http://player.twitch.tv/?channel=${twitchUsername}&parent=127.0.0.1&muted=true&theme=dark&chat=false&autoplay=true" frameborder="0" scrolling="no" allowfullscreen></iframe>`
                );
            } else if (kickUsername) {
                iframes.push(
                    `<iframe src="https://player.kick.com/${kickUsername}?allowfullscreen=true&muted=true&autoplay=true" frameborder="0" scrolling="no" allowfullscreen> </iframe>`
                );
            } else {
                console.log(url + " is invalid");
            }
        }
        return iframes;
    },
};

const settings = {
    element: document.querySelector(".tools"),
    toggle: function () {
        this.element.style.display =
            this.element.style.display == "none" ? "unset" : "none";
        overElement.classList.toggle("over");
    },
};

settings.element.querySelector(".apply-btn").onclick = function () {
    const gridX = settings.element.querySelector("#grid-num-x").value;
    const gridY = settings.element.querySelector("#grid-num-y").value;

    const links = settings.element
        .querySelector("#links")
        .value.replace(/ +(?= )/g, "")
        .split(" ");

    gridElement.style.gridTemplateColumns = `repeat(${gridX}, 1fr)`;
    gridElement.style.gridTemplateRows = `repeat(${gridY}, 1fr)`;

    if (links.length > gridX * gridY) {
        alert(
            `The grid (${gridX}x${gridY}) is too small to fit all the videos. (${links.length})`
        );
        return;
    }

    tutorialElement.remove();

    const iframes = utils.urlsToIFrames(links);

    gridElement.innerHTML = "";
    for (ifr of iframes) {
        gridElement.innerHTML += ifr;
    }
};

overElement.classList.toggle("over");
