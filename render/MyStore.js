const Store = require('electron-store');
// const uuid = require('uuid');
const path = require('path');

class MyStore extends Store{
    constructor(settings) {
        super(settings);
        this.tracks = this.get('tracks') || []
    }

    getTracks() {
        return this.get('tracks') || [];
    }

    saveTracks() {
        this.set('tracks', this.tracks)

        return this;
    }

    addTracks(tracks) {
        const newTracks = tracks.map(item => {
            return {
                id: Math.floor(Math.random() * 1000000),
                path: item,
                name: path.basename(item)
            }
        }).filter(track => {
            const currentTracksPath = this.getTracks().map(item => item.path);
            return currentTracksPath.indexOf(track.path) < 0;
        });

        this.tracks = [...this.tracks, ...newTracks];
        return this.saveTracks();
    }

    removeTrack(id) {
        this.tracks = this.tracks.filter(track => {return track.id != id});
        return this.saveTracks();
    }

}

module.exports = MyStore;