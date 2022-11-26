function logVideoAudioTrackInfo(localStream) {
    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();
    if (videoTracks.length > 0) {
        console.log(`Using video device: ${videoTracks[0].label}`);
    }
    if (audioTracks.length > 0) {
        console.log(`Using audio device: ${audioTracks[0].label}`);
    }
}

async function displayLocalScreen() {
    const screenVideo = document.getElementById("video");
    const stream = await navigator.mediaDevices.getDisplayMedia({
                audio: true,
                video: true
            });
    screenVideo.srcObject = stream;
    logVideoAudioTrackInfo(stream);
}

displayLocalScreen();

