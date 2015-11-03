module.exports = require('bdsft-sdk-view')(VideoView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles'),
  image: require('../../js/images')
});

// require('jquery-ui/draggable');

function VideoView(eventbus, debug, video, sipstack) {
  var self = {}; 

  self.model = video;

  self.elements = ['local', 'remote'];

  self.init = function() {
    // Allow some windows to be draggable, required jQuery.UI
    // TODO - allow draggable window
    // if (configuration.enableWindowDrag) {
    //   self.localVideo.draggable && self.localVideo.draggable({
    //     snap: ".remoteVideo,.videoBar",
    //     containment: ".main",
    //     snapTolerance: 200,
    //     stop: function(event, ui) {
    //       settings.updateViewPositions();
    //     }
    //   });
    // }
  };

  self.listeners = function(databinder) {
    // TODO - implement without dependency on history
    // self.view.bind("click", function(e) {
    //   eventbus.viewChanged({visible: false, viewName: 'history'})
    // });
    databinder.onModelPropChange('localStream', function(stream){
      self.playOrEnd(self.localEl(), stream);
    });
    databinder.onModelPropChange('remoteStream', function(stream){
      self.playOrEnd(self.remoteEl(), stream);
    });
    self.local.bind("playing", function() {
      video.validateUserMediaResolution(self.localWidth(), self.localHeight());
    });
    self.remote.bind('progress', function(e) {
      video.hasRemote = video.getRemoteVideoTrack().readyState === 'live';
    });
    self.local.bind('progress', function(e) {
      video.hasLocal = video.getLocalVideoTrack().readyState === 'live';
    });
    // self.remote.bind('abort canplay canplaythrough durationchange emptied encrypted ended error interruptbegin interruptend loadeddata '+
    //   'loadedmetadata loadstart mozaudioavailable pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting', function(e) {
    //   debug.log('remote.'+e.type);
    // });
    eventbus.on("ended", function(e) {
      debug.debug('ending remote video');
      self.end(self.remoteEl());
      if(!sipstack.enableConnectLocalMedia) {
        debug.debug('ending local video');
        self.end(self.localEl());
      } 
    });
  };

  self.playOrEnd = function(videoEl, stream) {
    if(stream) {
      self.play(videoEl, stream);
    } else {
      self.end(videoEl);
    }
  };

  self.play = function(videoEl, stream) {
    if (videoEl && videoEl.mozSrcObject !== undefined) {
      videoEl.mozSrcObject = stream;
      videoEl.play();
    } else {
      var src = (window.URL && window.URL.createObjectURL(stream)) || stream;
      debug.debug('src : ' + src);
      videoEl.src = src;
    }
  };

  self.end = function(videoEl) {
    if (videoEl.mozSrcObject !== undefined) {
      videoEl.mozSrcObject = null;
    } else {
      videoEl.src = "";
    }
  };

  self.isVideoActive = function(videoEl) {
    return !(videoEl.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || videoEl.paused || videoEl.currentTime <= 0);
  };

  self.localEl = function() {
    return self.local[0];
  };

  self.remoteEl = function() {
    return self.remote[0];
  };

  self.localWidth = function() {
    return self.local[0].videoWidth;
  };

  self.localHeight = function() {
    return self.local[0].videoHeight;
  };

  return self;
}