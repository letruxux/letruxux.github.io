const btn = document.querySelector("button");
const audio = document.querySelector("video");
const playDiv = document.querySelector(".play");
let isStarted = false;

function goFullScreen(...args) {
    if (isStarted) {
        const { documentElement } = document;
        if (documentElement.requestFullscreen)
            documentElement.requestFullscreen();
        else if (documentElement.mozRequestFullScreen)
            documentElement.mozRequestFullScreen();
        else if (documentElement.webkitRequestFullscreen)
            documentElement.webkitRequestFullscreen();
        else if (documentElement.msRequestFullscreen)
            documentElement.msRequestFullscreen();
    }
}

window.addEventListener("beforeunload", (e) => {
    if (isStarted) e.preventDefault();
});
document.addEventListener("click", goFullScreen);
document.addEventListener("keypress", goFullScreen);
btn.addEventListener("click", () => {
    isStarted = true;
    playDiv.style.display = "none";
    audio.play();
    goFullScreen();
});
