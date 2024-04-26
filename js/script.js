console.log("Running the script");
let currentSong = new Audio();
let songs = [];

// Convert seconds to minutes
function secondsToMinutesSeconds(seconds) {
    // Round seconds to the nearest whole number
    seconds = Math.round(seconds);

    // Calculate minutes and seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Format minutes and seconds with leading zeros if necessary
    var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    var formattedSeconds = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    // Combine minutes and seconds with a colon
    return formattedMinutes + ':' + formattedSeconds;
}

async function getSongs() {
    try {
        let response = await fetch("http://127.0.0.1:3000/songs/");
        let text = await response.text();
        let div = document.createElement("div");
        div.innerHTML = text;
        let links = div.getElementsByTagName('a');
        // let songs = [];
        for (let link of links) {
            if (link.href.endsWith(".mp3")) {
                songs.push(link.href.split("/songs/")[1]);
            }
        }
        return songs;
    } catch (error) {
        console.error('Failed to fetch songs:', error);
        return [];
    }
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track
    if (!pause) {
        currentSong.play()
        play.src = "images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function main() {
    try {
        let songs = await getSongs();
        playMusic(songs[0], true);
        console.log(songs);
        let songUL = document.querySelector(".songList ul")
        for (const song of songs) {

            // Create the list item
            let li = document.createElement("li");

            // Create and append the image for the music icon
            let imgMusic = document.createElement("img");
            imgMusic.classList.add("invert");
            imgMusic.src = "images/music.svg";
            imgMusic.alt = "";
            li.appendChild(imgMusic);

            // Create the 'info' div and its children
            let infoDiv = document.createElement("div");
            infoDiv.className = "info";

            let songDiv = document.createElement("div");
            // Assume 'song' is a variable containing the song name
            songDiv.textContent = song.replaceAll("%20", " ")
                .replaceAll("(PagalWorld.com.cm)", "")
            infoDiv.appendChild(songDiv);

            let artistDiv = document.createElement("div");
            artistDiv.textContent = "By Mayank";
            infoDiv.appendChild(artistDiv);

            li.appendChild(infoDiv);

            // Create the 'playnow' div and its children
            let playNowDiv = document.createElement("div");
            playNowDiv.className = "playnow";

            let span = document.createElement("span");
            span.textContent = "Play now";
            playNowDiv.appendChild(span);

            let imgPlay = document.createElement("img");
            imgPlay.classList.add("invert");
            imgPlay.src = "images/play.svg";
            imgPlay.alt = "";
            playNowDiv.appendChild(imgPlay);

            li.appendChild(playNowDiv);
            songUL.appendChild(li);

        }

        // Attach an event listener to each song
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(li => {
            li.addEventListener("click", () => {
                let songName = li.querySelector(".info div:first-child").textContent;
                playMusic(songName);
            });
        });

        // Attach an event listener to play
        play.addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play()
                play.src = "images/pause.svg"
            }
            else {
                currentSong.pause()
                play.src = "images/play.svg"
            }
        })

        // Listen for timeupdate event
        currentSong.addEventListener("timeupdate", () => {
            console.log(currentSong.currentTime, currentSong.duration);
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        })

        // Add an event listener to seekbar
        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentSong.currentTime = ((currentSong.duration) * percent) / 100
        })

        // Add an event listener to previous
        prev.addEventListener("click", () => {
            currentSong.pause()
            console.log("Previous clicked")
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if ((index - 1) >= 0) {
                playMusic(songs[index - 1])
            }
        })

        // Add an event listener to next
        next.addEventListener("click", () => {
            currentSong.pause()
            console.log("Next clicked")

            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if ((index + 1) < songs.length) {
                playMusic(songs[index + 1])
            }
        })

    } catch (error) {
        console.error('Error in main function:', error);
    }
}

main(); 