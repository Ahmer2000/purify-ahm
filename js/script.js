let currentSurah = new Audio();
let recAll;
let currFolder;

const playRec = (surah,pause=false)=>{
    currentSurah.src = `/${currFolder}/` + surah;
    if (!pause) {
        currentSurah.play();
        play.src= "./images/pause.svg";  
    }  
    document.querySelector('.audio-info').innerHTML= surah.replace('.mp3','');
    document.querySelector('.audio-duration').innerHTML= '00:00/00:00';
    
}
function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60); // Round down to remove milliseconds
    
    // Add leading zeros if necessary
    var minutesStr = minutes < 10 ? "0" + minutes : minutes;
    var secondsStr = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
    
    return minutesStr + ":" + secondsStr;
}

async function getRecitations (folder) {
    currFolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    recAll = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            recAll.push(element.href.split(`/${folder}/`)[1]);
        }
        
    }
     // Get all the recitations and store them in the playlist of the library 
     let recCard = document.querySelector('.recCards').getElementsByTagName('ul')[0]
     recCard.innerHTML = "";
     for (const rec of recAll) {
         recCard.innerHTML = recCard.innerHTML + `<li>
         <div class="flex playcard">
         <div class="recInfo">
         <div class="recName">${rec}</div>
         <div class="name"><p>Sheikh Mishari Alafasy</p></div>
         </div>
         <div class="playNow">
         <img id="cardplay" src="./images/play.svg" alt="playNow">
         </div>
         </div>
         </li>`
     }
     // var audio = new Audio(recAll[0]);
     // audio.play();
     // Attach an event-listener on playlist item
     Array.from(document.querySelector('.recCards').getElementsByTagName('li')).forEach((e)=>{
         e.addEventListener('click',element=>{
             console.log(e.querySelector('.recInfo').firstElementChild.innerHTML);
             playRec(e.querySelector('.recInfo').firstElementChild.innerHTML);
             document.querySelector('.left').style.left = '-120' + '%';
         })
     });
     
     return recAll;    
     }

async function displayAlbums (){
    let a = await fetch(`/recitations/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement('div');
    div.innerHTML = response;
    console.log(div);
    let cardContainer = document.querySelector('.cardContainer')
    let anchors = div.getElementsByTagName('a')
    console.log(anchors)
    let arr = Array.from(anchors);
    for (let index = 0; index < arr.length; index++) {
        const e= arr[index];
        
        if (e.href.includes("surahs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/")[4];
            console.log(e.href.split("/")[4]);
            let a = await fetch(`/recitations/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card ">
            <div class="play-btn">
            <img src="./images/play.svg" alt="play">
            </div>
            <img src=${response.img} alt="image">
            <h4>${response.title}</h4>
            <p>${response.description}</p>
            </div>`}
        }
        // Attah an event-listener to cards to load the playlists we want to load
        Array.from(document.getElementsByClassName('card')).forEach((e)=>{
            e.addEventListener('click',async (item)=>{
                recAll = await getRecitations(`recitations/${item.currentTarget.dataset.folder}`);
                document.querySelector('.left').style.left = '0' + '%';
                playRec(recAll[0])
            })
        })
        
        
}
 
async function recitations () {
    await getRecitations('recitations/91-100surahs');
    playRec(recAll[0],true)
    // console.log(recAll);

    // Display all the albums on the page
    await displayAlbums();
   

    // Attach an event-listener to play prev and next 
    play.addEventListener('click',()=>{
        if (currentSurah.paused) {
            currentSurah.play()
            play.src = "./images/pause.svg"
        }
        else{
            currentSurah.pause()
            play.src = "./images/play.svg"
        }

    })
   

    // Attach an eventlistener to audio-duration
    currentSurah.addEventListener('timeupdate',()=>{
        // console.log(currentSurah.currentTime,currentSurah.duration);
        document.querySelector('.audio-duration').innerHTML =`${secondsToMinutes(currentSurah.currentTime)}/${secondsToMinutes(currentSurah.duration)}`
        document.querySelector('#progress').style.left = (currentSurah.currentTime/currentSurah.duration)*100 + "%";
        if ((currentSurah.currentTime/currentSurah.duration)*100 + "%" === '100%') {
            play.src = "./images/play.svg";
        }
    })
    // Attach an eventlistener to progressBar
    document.querySelector('.progressBar').addEventListener('click',(e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector('#progress').style.left = percent + '%';
        currentSurah.currentTime = ((currentSurah.duration)*percent)/100;  
    })
    // Attach an eventlistener to hamburger menu
    document.querySelector('.hamburger').addEventListener("click",()=>{
        document.querySelector('.left').style.left = '0' + '%';
    })
    // Attach an eventlistener to close button in left div
    document.querySelector('.close').addEventListener("click",()=>{
        document.querySelector('.left').style.left = '-120' + '%';
    })
    document.querySelector('.H').addEventListener("click",()=>{
        document.querySelector('.left').style.left = '-120' + '%';
    })
    
    // Attach an event listener to volume slider
    document.querySelector('.slider').addEventListener('change',(e)=>{
        currentSurah.volume = parseInt(e.target.value)/100;
        if (parseInt(e.target.value)/100 == 0) {
           document.querySelector('.mute').style.opacity = '1' 
        }
        else{
            document.querySelector('.mute').style.opacity = '0'
        }
    })
       // Attach an event listener to backward and forward buttons of playbar
       document.querySelector('.forward').addEventListener('click',()=>{
        let index = recAll.indexOf(currentSurah.src.split("/")[5]);
        if ((index + 1) < recAll.length) {
            playRec(recAll[index + 1])
        }
        console.log(index);
    })
    document.querySelector('.backward').addEventListener('click',()=>{
        let index = recAll.indexOf(currentSurah.src.split("/")[5]);
        if ((index - 1) >= 0) {
            playRec(recAll[index - 1])
        }
        console.log(index);
    })
   
} 
recitations();
