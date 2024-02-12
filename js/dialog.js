const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const pauseButton = document.querySelector("#create-pause-btn");
const runButton = document.querySelector("#run-btn");
const dialog = document.querySelector(".dialog");
const expectedDialogText = document.querySelector("#dialog-text");

async function startAnimation() {
    const text = expectedDialogText.value.trim();

    dialog.innerHTML = "";
    let currentPause = document.querySelector("#starting-speed").value;
    let parsingPause = false;
    let pauseBuffer = "";
    for (const character of text.split("")) {
        // line breaks (<br>s)
        if (encodeURI(character) === "%0A") {
            dialog.insertAdjacentHTML("beforeend", "<br>");

            // pauses and speeds
        } else if (character === "{") {
            parsingPause = true;
        } else if (character === "}") {
            parsingPause = false;
            currentPause = parseInt(pauseBuffer) || currentPause;
            pauseBuffer = "";
        } else if (parsingPause) {
            pauseBuffer += character;
        } else {
            dialog.innerHTML += character;
            await sleep(currentPause);
        }
    }
}

runButton.addEventListener("click", () => startAnimation());
