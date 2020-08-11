import axios from "axios";
// import vueApp from "../components/Playlist.vue";

const YT_KEY = process.env.YT_APKEY;

var player;
var YT;
var previousIndex = 0;
var playlist = [];
var isHandleRefresh = false;
var index = 0;


function onYouTubePlayer(room) {
  playlist = room.playlist.map((video) => { return video.videoId });
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    playerVars: {
      playlist: playlist.join(','),
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  if (isHandleRefresh) {
    document.getElementById('player').src += ''
  }

}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.loadPlaylist(playlist, index);
  event.target.playVideo();

}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),

function onPlayerStateChange(event) {
  //Video ENDED WHEN === 0
  if (event.data === 0) {
    console.log('Video Ended');
    // get current video index
    index = player.getPlaylistIndex();
    // vueApp.methods.setEndedIdx( index-1);
    // update playlist and start playing at the proper index
    player.loadPlaylist(playlist, previousIndex + 1);

    /*
    keep track of the last index we got
    if videos are added while the last playlist item is playing,
    the next index will be zero and skip the new videos
    to make sure we play the proper video, we use "last index + 1"
    */
    previousIndex = index;
  }

}


function loadPlayer(room) {
  if (typeof (YT) == 'undefined' || typeof (YT.Player) == 'undefined') {

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);



    window.onYouTubePlayerAPIReady = function () {
      YT = window.YT
      onYouTubePlayer(room);
    };

  } else {
    //IF the player exist and his playlist length is not as same as the playlist variable length , 
    // thats mean playlist variable has been modified -- video added or removed -- therefore , we dont need
    //refresh so the Music Player Keep Playing .... 
    //For Each Video Ended the function )
    if (!player.getPlaylist || !player.getPlaylistIndex || player.getPlaylist()[player.getPlaylistIndex()] !== room.playlist[player.getPlaylistIndex()].videoId) {
      isHandleRefresh = true;
      onYouTubePlayer(room);
    } else {

      //playlist will change no matter if the playlist need refresh!
      playlist = room.playlist.map((video) => {
        return video.videoId;
      })
    }
  }
}

function loadVids(searchValue) {
  return axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${YT_KEY}&q=${searchValue}&maxResults=10`)
    .then((res) => {
      return res.data;
    }).then((data) => {
      return data.items;
    })
}

function addVideoToPlaylist(video) {
  playlist.push(video.videoId);
}

function removeVideoFromPlaylist(videoId) {
  if (playlist.length > 0) {
    const idx = playlist.findIndex((video) => {
      return video === videoId
    })
    playlist.splice(idx, 1)
    return idx;
  }
  return -1;
}

function resetPlayer() {
  index = 0
}

function getPlayerData() {
  return {
    time: player.getCurrentTime(),
    index
  }
}


//Write Better Code ...
function updatePlayerData(data) {
  if (index !== data.index) {
    index = data.index;
    player.loadPlaylist(playlist, index);
  }
  setTimeout(() => {
    player.seekTo(data.time, true);
  }, 1000)
}

function getPlayer() {
  return player;
}

function initPlayer(room) {
  onYouTubePlayer(room)
}

//Test Sync

// function startVideo(currTime) {
//   console.log(currTime)
//   player.seekTo(currTime)
//   player.playVideo();
// }

// function stopVideo() {
//   player.pauseVideo();
// }

// function getTime(){
//   return player.getCurrentTime();
// }

export default {
  loadPlayer,
  loadVids,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  resetPlayer,
  getPlayerData,
  updatePlayerData,
  getPlayer,
  initPlayer
  // startVideo,
  // stopVideo,
  // getTime
}