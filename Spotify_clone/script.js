console.log("Spotify")
let currentSong = new Audio(); // currentSong resolves the problem that whenever i tried to play multiple songs then all of them were being played simultaneously , so to avoid this problem i have created a single audio element by the variable name currentSong
let currFolder;
let songs;
// function to convert seconds to minute : seconds format

function convertSeconds(seconds) {
   if(isNaN(seconds) || seconds < 0){
        return "00:00";
   }

   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = Math.floor(seconds % 60);

   const formattedMinutes = String(minutes).padStart(2, '0');
   const formattedSeconds = String(remainingSeconds).padStart(2, '0');

   return `${formattedMinutes} : ${formattedSeconds}` ;
}


async function getSongs(folder){
    currFolder = folder ;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    let songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    return songs;
}

const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/" + track);
    currentSong.src = `/${currFolder}/` + track;  // this is the current song which gets updated when a new click is deteted , it avoid multiple songs being played at the same time

    if(!pause){
        currentSong.play();
        play.src="pause.svg"//this ensure that when the song is played then the play button gets toggled to pause button
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}


async function main(){

    // Get the list of all the songs
    songs = await getSongs("songs/ncs");
    playMusic(songs[0], true);


    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img  src="music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20"," ")}</div>
                  <div>K.K.</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img src="play.svg" alt="">
                </div>
         </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    // Add event listener to play , next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg"
        }
        else{
            currentSong.pause();
            play.src="play.svg"
        }
    })

    
    
    
    
    // listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        
        document.querySelector(".songtime").innerHTML = `${convertSeconds(currentSong.currentTime)} / ${convertSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector(".circle").style.left = percent + "%";
        // this code helps in moving the circle on the seekbar
        currentSong.currentTime = ((currentSong.duration) * percent) / 100 ; // this code helps us to play the song 
        // wherever we want from by moving the circle on the seekbar
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0";
    })

    // Add an event listener to close icon
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%";
    })

    // Add an event listener to previous button
    previous.addEventListener("click",()=>{
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        
        if((index - 1) >= 0){
            playMusic(songs[index-1]);
        }
    })
    
    // Add an event listener to next button
    next.addEventListener("click",()=>{
        

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        
        if((index + 1) < songs.length){
            playMusic(songs[index+1]);
        }

    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        
        currentSong.volume = parseInt(e.target.value) / 100
    })

    // Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getSongs(`${item.currentTarget.dataset.folder}`);
        })
    })
}

main();     
