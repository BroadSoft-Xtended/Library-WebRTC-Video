module.exports = require('bdsft-sdk-model')(Video, {
  config: require('../../js/config.js')
});

var Constants = require('webrtc-core').constants
function Video(eventbus, debug, urlconfig, cookieconfig, sipstack, fullscreen) {
  var self = {};

  self.updateSipStackAudioOnly = function(showLocal){
    sipstack.sendVideo = showLocal;
  };
  self.updateSipStackReceiveVideo = function(showRemote){
    sipstack.receiveVideo = showRemote;
  };

  self.props = ['localStream', 'remoteStream', 'classes', 'hasRemote', 'hasLocal', 'showLocal', 'showRemote'];

  self.bindings = {
    'classes': {
      video: ['displayResolution', 'enableSelfView', 'selfViewLocation', 'selfViewSize', 'hasLocal', 'hasRemote', 'showLocal', 'showRemote'],
      fullscreen: 'visible',
      sipstack: 'callState',
      urlconfig: 'hd',
      cookieconfig: ['hd']
    },
    displayResolution: {
      cookieconfig: 'displayResolution'
    },
    enableSelfView: {
      cookieconfig: 'enableSelfView',
      urlconfig: 'enableSelfView'
    },
    showLocal: {
      sipstack: 'sendVideo'
    },
    showRemote: {
      sipstack: 'receiveVideo'
    },
    sipStackAudioOnly: {
      self: 'showLocal'
    },
    sipStackReceiveVideo: {
      self: 'showRemote'
    }
  }

  self.validateUserMediaResolution = function(videoWidth, videoHeight) {
    var encodingWidth = sipstack.encodingResolutionWidth();
    var encodingHeight = sipstack.encodingResolutionHeight();
    debug.debug("validating video resolution " + videoWidth + "," + videoHeight + " to match selected encoding " + encodingWidth + "," + encodingHeight);
    if (!videoWidth && !videoHeight) {
      return;
    }

    if (encodingWidth !== videoWidth || encodingHeight !== videoHeight) {
      var msg = "Video resolution " + videoWidth + "," + videoHeight + " does not match selected encoding " + encodingWidth + "," + encodingHeight;
      debug.debug(msg);
    }
  };

  self.listeners = function() {
    eventbus.on("userMediaUpdated", function(e) {
      self.updateStreams([e && e.localStream], []);
    });
    eventbus.on(["iceconnected", "icecompleted"], function(e) {
      self.updateSessionStreams(e.sender);
    });
    eventbus.on('started', function(e) {
      self.hasRemote = e.sender.hasRemoteVideo();
      self.hasLocal = e.sender.hasLocalVideo();
    });
  };

  self.isMediaFlowing = function(streams) {
    if (!streams || streams.length === 0) {
      return false;
    }
    var tracks = streams.map(function(stream) {
      return stream && stream.getTracks && stream.getTracks();
    });
    if (!tracks) {
      return false;
    }
    tracks = [].concat.apply([], tracks);
    for (var i = 0; i < tracks.length; i++) {
      if (tracks[i] && tracks[i].readyState !== 'live') {
        debug.info('track is NOT live : ' + JSON.stringify(tracks[i]));
        return false;
      }
    }
    return true;
  };

  self.hasStream = function(streams) {
    return streams && streams.length > 0 && typeof(streams[0]) !== 'undefined' && !streams[0].ended;
  };

  var getVideoTrack = function(stream) {
    return stream && stream.getVideoTracks().length && stream.getVideoTracks()[0];
  };

  self.getRemoteVideoTrack = function() {
    return getVideoTrack(self.remoteStream);
  };

  self.getLocalVideoTrack = function() {
    return getVideoTrack(self.localStream);
  };

  self.updateSessionStreams = function(session) {
    session = session || sipstack.activeSession;
    if (session) {
      debug.debug("updating session streams : " + session.id);
      self.updateStreams(session.getLocalStreams(), session.getRemoteStreams());
    }
  };

  self.updateStreams = function(localStreams, remoteStreams) {
    debug.debug("updating video streams");
    self.setVideoStream('localStream', localStreams);
    self.setVideoStream('remoteStream', remoteStreams);
    if(self.remoteStream) {
      self.remoteStream.onactive = function(){
        debug.log('remoteStream.onactive');
      };
      self.remoteStream.onaddtrack = function(){
        debug.log('remoteStream.onaddtrack');
      };
      self.remoteStream.onended = function(){
        debug.log('remoteStream.onended');
      };
      self.remoteStream.oninactive = function(){
        debug.log('remoteStream.oninactive');
      };
      self.remoteStream.onremovetrack = function(){
        debug.log('remoteStream.onremovetrack');
      };
    }

    if(self.remoteStream && self.remoteStream.getVideoTracks().length > 0) {
      var videoTrack = self.remoteStream.getVideoTracks()[0];
      debug.log('adding listeners to remoteStream video track : '+videoTrack.id+', '+videoTrack.readyState);
      videoTrack.onstarted = function () {
        debug.log('remoteStream.onstarted');
        self.hasRemote = true;
      }
      videoTrack.onended = function () {
        debug.log('remoteStream.onended');
        self.hasRemote = false;
      }
      videoTrack.onmute = function () {
        debug.log('remoteStream.onmute');
        self.hasRemote = false;
      }
      videoTrack.onunmute = function () {
        debug.log('remoteStream.onunmute');
        self.hasRemote = true;
      }
    }
  };

  self.setVideoStream = function(localOrRemote, streams) {
    var mediaFlowing = self.isMediaFlowing(streams);
    if (!mediaFlowing) {
      debug.info('media is NOT flowing');
    }

    if (self.hasStream(streams)) {
      debug.log("setVideoStream : " + localOrRemote + " : " +streams[0].id);
      self[localOrRemote] = streams[0];
    } else {
      debug.log("setVideoStream : " + localOrRemote + " : end ");
      self[localOrRemote] = null;
    }
  };

  return self;
}