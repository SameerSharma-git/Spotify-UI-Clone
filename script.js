let songs
let Folders = []
let subFolders = []

// main containe height tweak
document.getElementById('main').style.paddingBottom = (document.querySelector('.playbar').style.height + 78) + 'px'

// CardContainer And Cards
let main_container = document.getElementById('main')

let CardContainer;
let Cards;

// LeftSection Slider
{
    var slider = document.getElementById('slider')
    var range_label = document.getElementById('range-label')
    var left_section = document.querySelector('.leftSection')
    var right_section = document.querySelector('.rightSection')
}

// volume
let volume_range = document.getElementById('volume-range')
let speaker = document.getElementById('speaker-img')
let InitialVolume

// Playbar Items
{
    var playbar_prev = document.querySelector('.playbar-buttons').getElementsByTagName('img')[0]
    var playbar_play = document.querySelector('.playbar-buttons').getElementsByTagName('img')[1]
    var playbar_next = document.querySelector('.playbar-buttons').getElementsByTagName('img')[2]
    var song_info = document.querySelector('.playbar-song-info')
    var song_timestamp = document.querySelector('.playbar-song-timestamp')
    var Seekbar = document.querySelector('.seekbar')
    var Circle = document.querySelector('.circle')
}

let currentSong = new Audio()
let isPlay = false

async function updateAlbums() {
    let foldersDiv = document.createElement('div')

    foldersDiv.innerHTML = await (await fetch('https://sameersharma-git.github.io/Spotify-UI-Clone/Songs/')).text()
    let anchors = foldersDiv.getElementsByTagName('a')

    // Fetching Main Folders
    for (let i = 0; i < anchors.length; i++) {
        const anchor = anchors[i];
        if (anchor.href.includes('/Songs/') && !anchor.href.endsWith('.mp3')) {
            Folders.push(anchor.href.split('/')[anchor.href.split('/').length - 1])
        }
    }

    // Fetching Sub Folders
    for (let i = 0; i < Folders.length; i++) {
        const Folder = Folders[i];
        let list = []

        let div = document.createElement('div')
        div.innerHTML = await (await fetch(`https://sameersharma-git.github.io/Spotify-UI-Clone/Songs/${Folder}`)).text()
        let as = div.getElementsByTagName('a')
        for (let z = 0; z < as.length; z++) {
            const a = as[z];
            if (a.href.includes(`${Folder}/`) && !a.href.endsWith('/info.json')) {
                list.push(a.href.split('/')[a.href.split('/').length - 1])
            }
        }
        subFolders.push(list);
    }

    // Displaying Fetched Foldes And SubFolders
    for (let i = 0; i < Folders.length; i++) {
        const Folder = Folders[i];
        let main_string = `<div data-main_folder="${Folder}" class="card-container right-section-margin-left border-4px bg-grey flex">`
        for (let z = 0; z < subFolders[i].length; z++) {
            const subFolder = subFolders[i][z];
            let info = await ((await fetch(`https://sameersharma-git.github.io/Spotify-UI-Clone/Songs/${Folder}/${subFolder}/info.json`)).json())
            main_string += `<div data-main_sub_folder="${subFolder}" class="cards flex" data-id="${subFolder}&${i}">
            <div class="play flex align-center justify-center"><img src="../Images/Icons/play.svg" alt=""></div>
            <img src="${info.im_src}" alt="preview">
            <h3>${info.title}</h3>
            <p>${info.desc}</p>
            </div>`
        }
        main_string += `</div>`
        main_container.innerHTML += main_string
    }
    // Storing Cards in list
    Cards = document.querySelectorAll('.cards')
    CardContainer = document.querySelectorAll('.card-container')
    
}

async function getSongs(Folder = '', SubFolder) {
    songs = []
    let songData = await fetch(`https://sameersharma-git.github.io/Spotify-UI-Clone/Songs/${Folder}/${SubFolder}`)
    let response = await songData.text()

    let div = document.createElement('div')
    div.innerHTML = response

    let as = div.getElementsByTagName('a')
    for (const a of as) {
        if (a.href.endsWith('.mp3')) {
            songs.push(a.href);
        }
    }

    // default
    currentSong.src = songs[0]
    song_info.innerHTML = songs[0].split('%20')[0].split('/')[songs[0].split('%20')[0].split('/').length - 1]
    isPlay = false
    

    //Initial Duration
    // song_timestamp.getElementsByTagName('span')[2].innerHTML = seconds_formatter(currentSong.duration)

    var playlist_ul = document.querySelector('.playlist').firstElementChild
    playlist_ul.innerHTML = " "
    

    for (let i = 0; i < songs.length; i++) {
        playlist_ul.innerHTML += `<li>
                            <div class="playlist-song flex align-center">
                                <div class="playlist-info flex align-center">
                                    <img class="invert pointer" src="../Images/Icons/icons8-music.svg" alt="">
                                    <div>
                                        <p>${songs[i].split('%20')[0].split('/')[songs[i].split('%20')[0].split('/').length-1]}</p>
                                        <p>Artist Name</p>
                                    </div>
                                </div>
                                <div onclick="playSong('${songs[i]}')" class="playlist-play"><img class="invert pointer"" src="../Images/Icons/play.svg"
                                        alt=""></div>
                            </div>
                        </li>`
    }
}

function changeVolume() {
    let volume_percent = parseInt(volume_range.value)
    if (volume_percent == 0) {
        speaker.src = '../Images/Icons/icons8-volume-off-100.png'
    }
    else {
        speaker.src = '../Images/Icons/icons8-volume-100.png'
    }
    currentSong.volume = volume_percent / 100
}

function playSong(song) {
    currentSong.src = song
    changeVolume()
    currentSong.play()
    isPlay = true
    playbar_play.src = '../Images/Icons/icons8-pause-100.png'
}

function Change_button(isPlay) {
    if (isPlay) {
        playbar_play.src = '../Images/Icons/icons8-pause-100.png'
    }
    else {
        playbar_play.src = '../Images/Icons/play.svg'
    }
}

function seconds_formatter(seconds) {
    let min = '00';
    let sec;
    if (seconds >= 60) {
        if (min = Math.floor(seconds / 60) < 10) {
            min = "0" + Math.floor(seconds / 60)
        }
        else {
            min = Math.floor(seconds / 60)
        }
        sec = Math.floor(seconds - (Math.floor(seconds / 60) * 60))
    }
    else {
        if (seconds < 10) {
            sec = "0" + Math.floor(seconds)
        }
        else {
            sec = Math.floor(seconds)
        }
    }
    return `${min}:${sec}`
}

async function main() {
    // Updating Albums
    await updateAlbums()
    await getSongs(Folders[0], subFolders[0][0])
    

    // Playbar Events
    playbar_prev.addEventListener('click', () => {
        currentSong.pause()
        if (songs.indexOf(currentSong.src) - 1 > -1) {
            currentSong.src = songs[songs.indexOf(currentSong.src) - 1]
        }
        else {
            currentSong.src = songs[songs.length - 1]
        }
        changeVolume()
        currentSong.play()
        isPlay = true
        Change_button(isPlay)
    })

    playbar_next.addEventListener('click', () => {
        currentSong.pause()
        if (songs.indexOf(currentSong.src) != (songs.length - 1)) {
            currentSong.src = songs[songs.indexOf(currentSong.src) + 1]
        }
        else {
            currentSong.src = songs[0]
        }
        changeVolume()
        currentSong.play()
        isPlay = true
        Change_button(isPlay)
    })

    playbar_play.addEventListener('click', () => {
        changeVolume()
        if (isPlay) {
            currentSong.pause()
            isPlay = false
        }
        else {
            currentSong.play()
            isPlay = true
        }
        Change_button(isPlay)
    })

    // Update Currentsong
    currentSong.addEventListener('timeupdate', () => {
        // Updating Song Info
        let currentTime = currentSong.currentTime
        let duration = currentSong.duration
        song_info.innerHTML = currentSong.src.split('%20')[0].split('/')[currentSong.src.split('%20')[0].split('/').length - 1]
        song_timestamp.getElementsByTagName('span')[0].innerHTML = seconds_formatter(currentTime)
        song_timestamp.getElementsByTagName('span')[2].innerHTML = seconds_formatter(duration)

        // When Song completes
        if (currentTime == duration) {
            if (songs.indexOf(currentSong.src) == (songs.length - 1)) {
                playSong(songs[0])
            }
            else {
                playSong(songs[(songs.indexOf(currentSong.src)) + 1])
            }
        }

        // Updating Circle
        let percent = (currentTime / duration) * 100
        Circle.style.left = percent + '%'
    })

    // Seekbar Event
    Seekbar.addEventListener("click", (e) => {
        let seek_percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        Circle.style.left = seek_percent + '%'
        currentSong.currentTime = (currentSong.duration * seek_percent) / 100
    })

    // Volume bar
    volume_range.oninput = changeVolume
    speaker.addEventListener("click", () => {
        if (volume_range.value != 0) {
            speaker.src = '../Images/Icons/icons8-volume-off-100.png'
            InitialVolume = volume_range.value
            volume_range.value = 0
        }
        else {
            speaker.src = '../Images/Icons/icons8-volume-100.png'
            volume_range.value = InitialVolume
        }
        changeVolume()
    })

    // Event Listener For Cards
    for (let x = 0; x < Cards.length; x++) {
        const card = Cards[x];
        card.addEventListener('click', (e)=>{
            let mainFolder_click = CardContainer[parseInt(e.currentTarget.dataset.id.split('&')[1])].dataset.main_folder
            let subFolder_click = e.currentTarget.dataset.main_sub_folder

            getSongs(mainFolder_click, subFolder_click)
            isPlay = false
            changeVolume()
            Change_button()
            Circle.style.left = 0 
        })
    }
}

main()

// left Section slide functionality // Not Working !
range_label.addEventListener('drag', (e) => {
    let valueX = e.offsetX
    if (valueX >= -119 && valueX <= 191) {
        range_label.style.left = (119 + valueX) + 'px'
        if (valueX < 0) {
            left_section.style.width = (left_section.style.width + valueX) + 'px'
        }
        else {
        }
    }
    e.stopPropagation()
})

// Hamburger Functionality
{
    let left_section = document.querySelector('.leftSection');
    let hamburger = document.querySelector('.hamburger');
    let lines = [hamburger.childNodes[1], hamburger.childNodes[3], hamburger.childNodes[5]];
    let lines_classes = ["first-line", "second-line", "third-line"];

    hamburger.addEventListener('click', () => {
        left_section.classList.toggle('ham-left')
        for (let i = 0; i < lines.length; i++) {
            lines[i].classList.toggle(lines_classes[i]);
        }
    })

    document.getElementsByTagName("html").addEventListener('click', () => {
        left_section.classList.toggle('ham-left')
    })
}