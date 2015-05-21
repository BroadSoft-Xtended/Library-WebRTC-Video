var jsdom = require('mocha-jsdom');
expect = require('expect');
jsdom({});

describe('video', function() {

  before(function() {
    core = require('webrtc-core');
    testUA = core.testUA;
    ExSIP = core.exsip;
    config = {selfViewSize: '1x'};
    testUA.createCore('configuration', config);
    testUA.createCore('sipstack', config);
    testUA.mockWebRTC();
    testUA.createModelAndView('video', {
      video: require('../')
    });
    eventbus = bdsft_client_instances.test.eventbus;
  });

  it('with audioOnly', function() {
    configuration.view = 'audioOnly';
    expect(video.classes.indexOf('audioOnly')).toNotEqual(-1);
    configuration.view = '';
  });
  it('with widescreen', function() {
    configuration.resolutionType = core.constants.WIDESCREEN;
    expect(video.classes.indexOf('widescreen')).toNotEqual(-1);
  });
  it('after call start', function() {
    testUA.startCall();
    expect(video.classes.indexOf('started')).toNotEqual(-1);
  });
  it('with selfViewSize', function() {
    configuration.selfViewSize = '2x';
    expect(video.classes.indexOf('_2x')).toNotEqual(-1);
  });
  it('localVideo visible', function() {
    testUA.isVisible(videoview.localVideo, true);
  });

  it('localVideo on viewChanged', function() {
    video.visible = false;
    testUA.isVisible(videoview.localVideo, false);
  });
});