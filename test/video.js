test = require('../node_modules/webrtc-sipstack/test/includes/common')(require('../node_modules/bdsft-sdk-test/lib/common'));
describe('video', function() {
  var createModel = function(){
    test.createModelAndView('video', {
      video: require('../'),
      sipstack: require('webrtc-sipstack'),
      fullscreen: require('webrtc-fullscreen'),
      eventbus: require('bdsft-sdk-eventbus'),
      debug: require('bdsft-sdk-debug'),
      core: require('webrtc-core')
    });
  };
  
  before(function() {
    createModel();
    sipstack = bdsft_client_instances.test.sipstack.sipstack;
    cookieconfig = bdsft_client_instances.test.core.cookieconfig;
    urlconfig = bdsft_client_instances.test.core.urlconfig;
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
  it('urlconfig.audioOnlyView', function() {
    urlconfig.view = 'audioOnly';
    expect(video.classes.indexOf('showLocal')).toEqual(-1);
    expect(video.classes.indexOf('showRemote')).toEqual(-1);
    test.equalCss(videoview.view.find('.video'), 'display', 'none');
    urlconfig.view = 'audioVideo';
  });
  it('with widescreen', function() {
    video.displayResolution = '1280x720';
    expect(video.classes.indexOf('_1280x720')).toNotEqual(-1);
  });
  it('after call start', function() {
    test.startCall();
    expect(video.classes.indexOf('started')).toNotEqual(-1);
    test.endCall();
  });
  it('with selfViewSize', function() {
    video.selfViewSize = '2x';
    expect(video.classes.indexOf('_2x')).toNotEqual(-1);
  });
  it('localVideo visible', function() {
    test.equalCss(videoview.view.find('.localVideo'), 'opacity', '1');
  });
  it('showLocal = false, showRemote = false', function() {
    video.showLocal = false;
    video.showRemote = false;
    video.hasLocal = false;
    video.hasRemote = false;
    test.equalCss(videoview.view.find('.video'), 'display', 'none');
  });
  it('showLocal = false, showRemote = true, hasRemote = false', function() {
    test.startCall();
    video.showLocal = false;
    video.showRemote = true;
    video.hasLocal = false;
    video.hasRemote = false;
    test.equalCss(videoview.view.find('.video'), 'width', '0px');
    test.endCall();
  });
  it('showLocal = true, showRemote = false, hasLocal = true, hasRemote = false', function() {
    test.startCall();
    video.showLocal = true;
    video.showRemote = false;
    video.hasLocal = true;
    video.hasRemote = false;
    test.equalCss(videoview.view.find('.video'), 'display', '');
    test.endCall();
  });
});