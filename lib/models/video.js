module.exports = require('webrtc-core').bdsft.Model(Video);

function Video(eventbus, debug, configuration, sipstack) {
  var self = {};

  self.props = ['localStream', 'remoteStream', 'classes', 'visible'];

  self.bindings = {
    'classes': {
      video: 'visible',
      sipstack: 'callState',
      configuration: ['enableSelfView', 'views', 'resolutionType', 'selfViewLocation', 'selfViewSize']
    }
  }

  self.validateUserMediaResolution = function(videoWidth, videoHeight) {
    var encodingWidth = configuration.resolutionEncodingWidth();
    var encodingHeight = configuration.resolutionEncodingHeight();
    debug("validating video resolution " + videoWidth + "," + videoHeight + " to match selected encoding " + encodingWidth + "," + encodingHeight);
    if (!videoWidth && !videoHeight) {
      return;
    }

    if (encodingWidth !== videoWidth || encodingHeight !== videoHeight) {
      var msg = "Video resolution " + videoWidth + "," + videoHeight + " does not match selected encoding " + encodingWidth + "," + encodingHeight;
      debug(msg);
    }
  };

  self.listeners = function() {
    eventbus.on("userMediaUpdated", function(e) {
      self.updateStreams([e && e.localStream], []);
    });
    eventbus.on(["iceconnected", "icecompleted"], function(e) {
      self.updateSessionStreams(e.sender);
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
        debug('track is NOT live : ' + JSON.stringify(tracks[i]));
        return false;
      }
    }
    return true;
  };

  self.hasStream = function(streams) {
    return streams && streams.length > 0 && typeof(streams[0]) !== 'undefined' && !streams[0].ended;
  };

  self.updateSessionStreams = function(session) {
    session = session || sipstack.activeSession;
    if (session) {
      debug("updating session streams : " + session.id);
      self.updateStreams(session.getLocalStreams(), session.getRemoteStreams());
    }
  };

  self.updateStreams = function(localStreams, remoteStreams) {
    debug("updating video streams");
    self.setVideoStream('localStream', localStreams);
    self.setVideoStream('remoteStream', remoteStreams);
  };

  self.setVideoStream = function(localOrRemote, streams) {
    debug("setVideoStream : " + localOrRemote + " : " +JSON.stringify(streams));
    var mediaFlowing = self.isMediaFlowing(streams);
    if (!mediaFlowing) {
      debug('media is NOT flowing');
    }

    if (self.hasStream(streams)) {
      self[localOrRemote] = streams[0];
    } else {
      self[localOrRemote] = null;
    }
  };

  return self;
}