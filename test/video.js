var jsdom = require('mocha-jsdom');
expect = require('expect');
jsdom({});

describe('video', function() {

  before(function() {
    core = require('webrtc-core');
    testUA = core.testUA;
    ExSIP = core.exsip;
    config = {};
    testUA.createCore('configuration', config);
    testUA.createCore('sipstack', config);
    testUA.mockWebRTC();
    testUA.createModelAndView('video', {
      video: require('../')
    });
    eventbus = bdsft_client_instances.eventbus_test;
  });

  it('localVideo visible', function() {
    testUA.isVisible(videoview.localVideo, true);
  });

  it('localVideo on viewChanged', function() {
    eventbus.viewChanged({visible: false, viewName: 'video'});
    testUA.isVisible(videoview.localVideo, false);
  });
});