# Video

Handles the video media flow using a local and remote \<video\> element.

Model : bdsft_webrtc.default.video
View : bdsft_webrtc.default.videoview
Dependencies : [Fullscreen](../fullscreen), [SIP Stack](../sipstack)

## Images
<a name="images"></a>

Filename     |Key      |Description
-------------|---------|--------------------------------------------------------------
videobg.svg  |videobg  |The background image on the remote video when not on a call.

## Elements
<a name="elements"></a>

Element  |Type   |Description
---------|-------|----------------------------
local    |video  |Displays the local video.
remote   |video  |Displays the remote video.

## Properties
<a name="properties"></a>

Property      |Type    |Description
--------------|--------|---------------------------------------------------------------------------------
localStream   |object  |The object for the local stream. Setting it to null will end the local video.
remoteStream  |object  |The object for the remote stream. Setting it to null will end the remote video.

## Configuration
<a name="configuration"></a>

Property           |Type     |Default            |Description
-------------------|---------|-------------------|-----------------------------------------------------------------------------------
displayResolution  |string   |640x480            |The display resolution of the remote video.
enableSelfView     |boolean  |true               |True the self view is enabled.
selfViewLocation   |string   |bl / br / tl / tr  |The location of the self view – bottom left / bottom right / top left / top right
selfViewSize       |string   |1x / 2x            |The size of the self view – normal size / doubled size

## Methods
<a name="methods"></a>

Method                   |Parameters                             |Description
-------------------------|---------------------------------------|------------------------------------------------------------
isMediaFlowing(streams)  |streams : localStream or remoteStream  |True if all tracks of the stream are in readyState = live.
