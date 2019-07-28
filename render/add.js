const {ipcRenderer} = require("electron");
const {$} = require("./helper.js");
const path = require("path");

let selectedMusicList = []; 
$("chooseMusic").addEventListener("click", () => {
  ipcRenderer.send("chooseMusic")
});

$("addMusic").addEventListener("click", () => {
    ipcRenderer.send("addMusic", selectedMusicList);
})
const renderHTMLMusicListAddPage = (paths) => {
    const pathsContainer = $('musicList');
    const pathsList = paths.reduce((html, item) => (
        html += `<li >${path.basename(item)}</li>`
    ), '')
    pathsContainer.innerHTML = `<ul>${pathsList}</ul>`
};

ipcRenderer.on("add-music-list", (event, arguments) => {
    renderHTMLMusicListAddPage(arguments);
    selectedMusicList = arguments;
})

