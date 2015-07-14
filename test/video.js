test = require('../node_modules/webrtc-sipstack/test/includes/common')(require('../node_modules/webrtc-core/test/includes/common'));
describe('video', function() {
  var createModel = function(){
    test.createModelAndView('video', {
      video: require('../'),
      sipstack: require('webrtc-sipstack'),
      fullscreen: require('webrtc-fullscreen')
    });
  };
  
  before(function() {
    test.createCore('urlconfig');
    test.createCore('cookieconfig');
    test.createModelAndView('sipstack', {
      sipstack: require('webrtc-sipstack')
    });
    createModel();
  });

  it('displayResolution default', function() {
    expect(video.displayResolution).toEqual('640x480');
  });
  it('displayResolution with urlconfig.hd', function() {
    urlconfig.hd = true;
    expect(video.classes.indexOf('hd')).toNotEqual('-1');
    urlconfig.hd = false;
  });
  it('displayResolution with cookieconfig.hd', function() {
    cookieconfig.hd = true;
    expect(video.classes.indexOf('hd')).toNotEqual('-1');
    cookieconfig.hd = false;
  });
  it('displayResolution with cookieconfig.displayResolution', function() {
    cookieconfig.displayResolution = '320x180';
    expect(video.displayResolution).toEqual('320x180');
  });
  it('enableSelfView with cookieconfig.enableSelfView', function() {
    urlconfig.enableSelfView = undefined;
    cookieconfig.enableSelfView = false;
    createModel();
    expect(video.enableSelfView).toEqual(false);
  });
  it('enableSelfView with cookieconfig.enableSelfView and urlconfig.enableSelfView', function() {
    urlconfig.enableSelfView = true;
    cookieconfig.enableSelfView = false;
    createModel();
    expect(video.enableSelfView).toEqual(true);
  });
  it('with audioOnly', function() {
    urlconfig.view = 'audioOnly';
    expect(video.classes.indexOf('audioOnly')).toNotEqual(-1);
    urlconfig.view = '';
  });
  it('with widescreen', function() {
    video.displayResolution = '1280x720';
    expect(video.classes.indexOf('_1280x720')).toNotEqual(-1);
  });
  it('after call start', function() {
    test.startCall();
    expect(video.classes.indexOf('started')).toNotEqual(-1);
  });
  it('with selfViewSize', function() {
    video.selfViewSize = '2x';
    expect(video.classes.indexOf('_2x')).toNotEqual(-1);
  });
  it('localVideo visible', function() {
    test.isVisible(videoview.view.find('.localVideo'), true);
  });

  it('localVideo on viewChanged', function() {
    video.visible = false;
    test.isVisible(videoview.view.find('.localVideo'), false);
  });
});