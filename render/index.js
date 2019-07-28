const { ipcRenderer } = require('electron');
const { $, convertTime } = require('./helper.js');
let player = new Audio();
let tracks;
let currentTrack;

$("addMusic").addEventListener("click", () => {
    ipcRenderer.send("addButtonClicked");
})

$("addedMusicList").addEventListener("click", (event) => {
    console.log(event);
    const {dataset, classList} = event.target;
    const id = dataset && dataset.id;

    if (id) {
        if (classList.contains("fa-play")) {
            if (currentTrack && currentTrack.id == id) {
                // 同一首根
                player.play();
            } else {
                // 不同歌曲
                currentTrack = tracks.find(track =>  track.id == id);
                player.src = currentTrack.path;
                player.play();
                let icon = document.querySelector(".fa-pause");
                if (icon) { 
                    icon.classList.replace("fa-pause", "fa-play");
                }
            }
            classList.replace("fa-play", "fa-pause");
        } else if (classList.contains("fa-pause")) {
            player.pause();
            classList.replace("fa-pause", "fa-play");
        } else if (classList.contains("fa-trash-alt")) {
            ipcRenderer.send("delete-current-track", id);
        }
    }

})

player.addEventListener('loadedmetadata', () => {
    renderPlayerHTML(currentTrack.name, convertTime(player.duration));
 });

 player.addEventListener('timeupdate', () => {
    updateSeeker(player.currentTime, player.duration);
 });

 renderPlayerHTML = (name, duration) => {
    const player = $('current-music');
    const detailInfo = `<div class='col font-weight-bold'>Name:${name}</div><div class='col'><span id="current-seeker">00:00</span>/${duration}</div>`;
    player.innerHTML = detailInfo;
 }

 updateSeeker = (time, duration) => {
    const seeker = $('current-seeker');
    const progress = $('process-bar');
    const percents = Math.floor(time / duration * 100);
    progress.innerHTML = percents + "%";
    progress.style.width = percents + "%";
    seeker.innerHTML = convertTime(time);
 }
 
const renderList = (list) => {
    const listElement = $("addedMusicList");
    const pathsList = list.reduce((html, item) => (
        html += `<li class='row d-flex justify-content-between align-items-center'>
            <div class='col-10'>
                <i class='fa fa-music text-secondary' aria-hidden='true'></i>
                <b>${item.name}</b>
            </div>
            <div class="col=2">
                <i class='fa fa-play mt-2' aria-hidden='true' data-id='${item.id}' ></i>
                <i class='fa fa-trash-alt' aria-hidden='true' data-id='${item.id}' ></i>
            </div>
        </li>`
    ), '')
    listElement.innerHTML = list.length > 0 ?  `<ul>${pathsList}</ul>` : "<i>没有内容</i>";
}

ipcRenderer.on("add-music-list-index", (event, list) => {
    renderList(list);
    tracks = list;
});