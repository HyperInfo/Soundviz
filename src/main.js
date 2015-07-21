// grab the room from the URL
var room = window.location.search && window.location.search.split('?')[1];
var mySpeaker = new Audio();
mySpeaker.volume=0;

// create our webrtc connection
var webrtc = new SimpleWebRTC({
  // the id/element dom element that will hold "our" video
  //url:'http://stun.l.google.com:19302',
  //url:'localhost:8888',
  url:'http://10.228.56.31:8001',
  localVideoEl: 'localVideo',
  // the id/element dom element that will hold remote videos
  remoteVideosEl: 'remoteVideos',
  autoRequestMedia: true,
  debug: false,
  detectSpeakingEvents: true,
  autoAdjustMic: true
});

//webrtc.on('videoOff');
//webrtc.setMicIfEnabled(0);




// when it's ready, join if we got a room from the URL
webrtc.on('readyToCall', function () {
  if (room) webrtc.joinRoom(room);
});

function showVolume(elementId, volume) {
  if(!elementId)return;
  var ctx = document.getElementById(elementId).getContext("2d");
  ctx.beginPath();
  var r;
  if (volume < -60) { // vary between -45 and -20
    r = 0;
  } else if (volume > -20) {
    r=120;
  } else {
    r = 180/60*volume+180; //-60 is minimam of volume
  }
  ctx.arc(180, 180, r, 0, Math.PI*2, true);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgb(155, 188, 89)'; // 緑
  ctx.stroke();

  ctx.fillStyle='rgba(34,51,68,0.1)';
  ctx.fillRect(0,0,360,360);

}


//webrtc.on('channelMessage', function (peer, label, data) {
//  console.log('channelMessage');
//  if (data.type == 'volume') {
//    showVolume('remote', data.volume);
//  }
//});

webrtc.on('videoAdded', function (video, peer) {
  console.log('video added', peer);
  var remotes = document.getElementById('remotes');
  if (remotes) {
    var d=document.createElement('div');
    d.id = 'volume_' + peer.id;
    d.className = 'volume';
    d.style.width="360";
    d.style.float="left";
    var canvas = document.createElement('canvas');
    canvas.id = 'cv_'+ peer.id;    //ID
    canvas.height = 360;         //サイズ　縦
    canvas.width = 360;          //サイズ　横
    //canvas.style.border="1px solid";
    d.appendChild(canvas);
    //showVolume(d, -40);
    remotes.appendChild(d);
    var loginsnd = new Audio();
    loginsnd.src = "assets/login.wav";
    loginsnd.play();
  }else{
    console.log("add error")
  }
});

webrtc.on('videoRemoved', function (video, peer) {
  var remotes = document.getElementById('remotes');
  var el = document.getElementById('cv' + webrtc.getDomId(peer));
  if (remotes && el) {
    remotes.removeChild(el);
    var logoutsnd = new Audio();
    logoutsnd.src = "assets/logout.wav";
    logoutsnd.play();
  }
});

// remote volume has changed
webrtc.on('remoteVolumeChange', function (peer, volume) {
  showVolume('cv_' + peer.id, volume);
});

webrtc.on('volumeChange', function (volume, treshold) {
  showVolume('localVolume', volume);
});
