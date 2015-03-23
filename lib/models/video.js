module.exports = require('webrtc-core').bdsft.Model(Video);

function Video(eventbus, debug, configuration) {
  var self = {}; 

  var updateClasses = function(){
    self.classes = [
      configuration.enableSelfView ? 'enableSelfView' : '',
      configuration.selfViewLocation ? 'selfView-'+configuration.selfViewLocation : '',
      configuration.selfViewSize ? 'selfView-'+configuration.selfViewSize : '',
      typeof self.visible === 'undefined' || self.visible ? 'video-shown' : 'video-hidden'
    ].concat(configuration.views);
  };
  self.props = {'localEl': true, 'remoteEl': true, 'localWidth': true, 'localHeight': true, 'classes': true, visible: {
    onSet: function(){
      updateClasses();
    }
  }};

  self.validateUserMediaResolution = function() {
    var encodingWidth = configuration.resolutionEncodingWidth();
    var encodingHeight = configuration.resolutionEncodingHeight();
    var videoWidth = self.localWidth;
    var videoHeight = self.localHeight;
    debug("validating video resolution " + videoWidth + "," + videoHeight + " to match selected encoding " + encodingWidth + "," + encodingHeight);
    if (!videoWidth && !videoHeight) {
      return;
    }

    if (encodingWidth !== videoWidth || encodingHeight !== videoHeight) {
      var msg = "Video resolution " + videoWidth + "," + videoHeight + " does not match selected encoding " + encodingWidth + "," + encodingHeight;
      debug(msg);
    }
  };

  self.listeners = function(configurationDatabinder) {
    configurationDatabinder.onModelPropChange(['enableSelfView', 'views', 'selfViewLocation', 'selfViewSize'], function(){
      updateClasses();
    });
    eventbus.on(["viewChanged"], function(e) {
      if(e.view === 'video') {
        self.visible = e.visible;
      }
    });
    eventbus.on(["disconnected", "endCall", "ended", "failed"], function(e) {
      self.updateSessionStreams();
    });
    eventbus.on("userMediaUpdated", function(e) {
      self.updateStreams([e && e.localStream], []);
    });
    eventbus.on("resumed", function(e) {
      self.updateSessionStreams(e.sender);
    });
    eventbus.on("started", function(e) {
      self.updateSessionStreams(e.sender);
    });
    updateClasses();
  };

  self.updateSessionStreams = function(session) {
    self.updateStreams(session && session.getLocalStreams(), session && session.getRemoteStreams());
  };

  self.updateStreams = function(localStreams, remoteStreams) {
    debug("updating video streams");
    self.setVideoStream(self.localEl, localStreams);
    self.setVideoStream(self.remoteEl, remoteStreams);
  };

  self.setVideoStream = function(video, streams) {
    var hasStream = streams && streams.length > 0 && typeof(streams[0]) !== 'undefined' && !streams[0].ended;
    if (video && video.mozSrcObject !== undefined) {
      if (hasStream) {
        video.mozSrcObject = streams[0];
        video.play();
      } else {
        video.mozSrcObject = null;
      }
    } else if (video) {
      if (hasStream) {
        video.src = (window.URL && window.URL.createObjectURL(streams[0])) || streams[0];
      } else {
        video.src = "";
      }
    }
  };

  return self;
}