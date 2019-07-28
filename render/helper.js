exports.$ = id => {
    return document.getElementById(id)
}

exports.convertTime = (time) => {
    let minutes = "0" + Math.floor(time / 60);
    let seconds = "0" + Math.floor(time % 60);

    return minutes.substr(-2) + ":" + seconds.substr(-2);
}