module.exports = require('webrtc-core').bdsft.View(VideoView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
});

// require('jquery-ui/draggable');

function VideoView(eventbus, configuration, video) {
  var self = {}; 

  self.model = video;

  self.elements = ['local', 'remote', 'localVideo', 'video'];

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

  self.listeners = function() {
    self.view.bind("click", function(e) {
      eventbus.viewChanged({visible: false, viewName: 'history'})
    });
    self.local.bind("playing", function() {
      video.validateUserMediaResolution();
    });
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