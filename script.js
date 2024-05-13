console.log("Let's write JavaScript Code here.")

let currentSong = new Audio();
let songs;
let currentFolder

function secondsToMiutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return '${formattedMinutes}:${formattedSeconds}';
}

async function getSongs(folder) {
    currentFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // Show all the songs in the Playlist.
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" width="34"
                                src="/Web-Development_Full_Course/HTML_Files/Spotify_Clone/Images/music.svg"
                                alt="Music icon">
                            <div class="inFo">
                                <div>${song}</div>
                                <div>Ritik Boss</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert"
                                    src="/Web-Development_Full_Course/HTML_Files/Spotify_Clone/Images/playBtn.svg"
                                    alt="Play">
                            </div> </li>`;
    }

    // Attach an event listener to each song.
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".inFo").firstElementChild.innerHTML)
            playMusic(e.querySelector(".inFo").firstElementChild.innerHTML.trim())
        })
    })

    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currentFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.scr = "/Web-Development_Full_Course/HTML_Files/Spotify_Clone/Images/pauseBtn.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    let a = await fetch(`http://192.168.43.51:3000/Web-Development_Full_Course/HTML_Files/Spotify_Clone/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-1)[0]

            // Get the metadata of the folder.
            let a = await fetch(`http://192.168.43.51:3000/Web-Development_Full_Course/HTML_Files/Spotify_Clone/songs/ncs${folder}/info.json`)
            let response = await a.json();

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="cs" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <img src="/Web-Development_Full_Course/HTML_Files/Spotify_Clone/songs/ncs/${folder}/cover.jpeg" alt="Image1">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
}

async function main() {

    // Get the list of all the songs.
    await getSongs("/songs/ncs");

    playMusic(songs[0], true)

    // Display all the albums on the page.
    await displayAlbums()

    // Attach an event listener to play, next and previous.
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.scr = "/Web-Development_Full_Course/HTML_Files/Spotify_Clone/Images/pauseBtn.svg"
        } else {
            currentSong.pause()
            play.scr = "/Web-Development_Full_Course/HTML_Files/Spotify_Clone/Images/playBtn.svg"
        }
    })

    // Listen for timeUpdate event.
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songTime").innerHTML = '${secondsToMiutesSeconds(currentSong.currentTime)}: /$ {secondsToMiutesSeconds(currentSong.duration)}'

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add and event listener to seekBar.
    document.querySelector(".seekBar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        // console.log(e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    // Add and event listener for hamburger.
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Add and event listener for close button.
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    // Add and event listener to previous.
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add and event listener to next.
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add an event to valume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("/Web-Development_Full_Course/HTML_Files/Spotify_Clone/Images/mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


}

main()
